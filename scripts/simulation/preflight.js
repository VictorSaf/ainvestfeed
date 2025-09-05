#!/usr/bin/env node
/*
  Preflight simulation: validates environment and writes an audit log under docs/audit.
  Checks performed:
  - Node.js version >= 20
  - Docker availability
  - Postgres (localhost:5434) connectivity via psql
  - Redis (localhost:6379) PING via raw TCP
  - Port availability (3001, 3002, 5434, 6379)
  - Backend health endpoint
*/

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const net = require('net');

const AUDIT_DIR = path.resolve(__dirname, '../../docs/audit');
const TIMESTAMP = new Date()
  .toISOString()
  .replace(/[-:T.Z]/g, '') // remove separators and milliseconds dot/Z
  .slice(0, 14); // YYYYMMDDHHMMSS
const LOG_PATH = path.join(AUDIT_DIR, `run_preflight_${TIMESTAMP}.md`);

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function logMarkdown(lines) {
  fs.writeFileSync(LOG_PATH, lines.join('\n') + '\n', 'utf8');
}

function checkNodeVersion() {
  const version = process.versions.node;
  const major = parseInt(version.split('.')[0], 10);
  return { component: 'node', ok: major >= 20, details: { version } };
}

function checkDocker() {
  try {
    const out = spawnSync('docker', ['--version'], { encoding: 'utf8' });
    return { component: 'docker', ok: out.status === 0, details: { output: (out.stdout || out.stderr || '').trim() } };
  } catch (e) {
    return { component: 'docker', ok: false, details: { error: String(e) } };
  }
}

function checkPostgres() {
  const env = { ...process.env, PGPASSWORD: process.env.PGPASSWORD || 'password' };
  const args = ['-h', '127.0.0.1', '-p', '5434', '-U', 'user', '-d', 'ainvestfeed', '-c', 'SELECT 1;'];
  const out = spawnSync('psql', args, { encoding: 'utf8', env });
  return { component: 'postgres', ok: out.status === 0, details: { output: (out.stdout || out.stderr || '').trim() } };
}

function checkRedis() {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port: 6379 }, () => {
      socket.setNoDelay(true);
      socket.write('PING\r\n');
    });
    let data = '';
    let resolved = false;
    function done(ok, details) {
      if (resolved) return;
      resolved = true;
      try { socket.end(); } catch {}
      resolve({ component: 'redis', ok, details });
    }
    socket.on('data', (chunk) => {
      data += chunk.toString('utf8');
      if (data.includes('+PONG')) {
        done(true, { response: data.trim() });
      }
    });
    socket.on('error', (err) => done(false, { error: String(err) }));
    socket.setTimeout(3000, () => done(false, { error: 'timeout' }));
    socket.on('close', () => {
      if (!resolved) {
        done(data.includes('+PONG'), { response: data.trim() || 'closed' });
      }
    });
  });
}

function checkPort(port) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host: '127.0.0.1', port }, () => {
      socket.destroy();
      resolve({ port, status: 'BUSY' });
    });
    socket.on('error', () => resolve({ port, status: 'FREE' }));
    socket.setTimeout(800, () => {
      socket.destroy();
      resolve({ port, status: 'FREE' });
    });
  });
}

async function checkBackendHealth() {
  const url = 'http://127.0.0.1:3002/health';
  const start = Date.now();
  try {
    const res = await fetch(url, { method: 'GET' });
    const ms = Date.now() - start;
    const ok = res.ok;
    let body = null;
    try { body = await res.json(); } catch {}
    return { component: 'backend_health', ok, details: { status: res.status, latencyMs: ms, body } };
  } catch (e) {
    return { component: 'backend_health', ok: false, details: { error: String(e) } };
  }
}

async function main() {
  ensureDir(AUDIT_DIR);
  const results = [];
  results.push(checkNodeVersion());
  results.push(checkDocker());
  results.push(checkPostgres());
  results.push(await checkRedis());
  const ports = await Promise.all([3001, 3002, 5434, 6379].map(checkPort));
  results.push({ component: 'ports', ok: ports.every((p) => p.status === 'FREE' || p.port === 3002 || p.port === 5434 || p.port === 6379), details: { ports } });
  results.push(await checkBackendHealth());

  const summary = {
    timestamp: new Date().toISOString(),
    pass: results.every((r) => r.ok),
    components: results,
  };

  const lines = [];
  lines.push('# Preflight Validation');
  lines.push('');
  lines.push(`Time: ${summary.timestamp}`);
  lines.push(`Overall: ${summary.pass ? 'PASS' : 'FAIL'}`);
  lines.push('');
  for (const r of results) {
    lines.push(`- ${r.component}: ${r.ok ? 'PASS' : 'FAIL'}`);
  }
  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify(summary, null, 2));
  lines.push('```');

  logMarkdown(lines);
  console.log(`Preflight log written: ${LOG_PATH}`);
  if (!summary.pass) process.exitCode = 1;
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


