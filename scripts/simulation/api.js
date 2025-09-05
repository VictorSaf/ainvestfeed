#!/usr/bin/env node
/*
  Backend API simulation: runs a subset of API checks and writes an audit log under docs/audit.
*/

const fs = require('fs');
const path = require('path');

const AUDIT_DIR = path.resolve(__dirname, '../../docs/audit');
const TIMESTAMP = new Date()
  .toISOString()
  .replace(/[-:T.Z]/g, '')
  .slice(0, 14);
const LOG_PATH = path.join(AUDIT_DIR, `run_api_simulation_${TIMESTAMP}.md`);

async function httpJson(method, url, body) {
  const start = Date.now();
  const res = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  const ms = Date.now() - start;
  let json = null;
  try { json = await res.json(); } catch {}
  return { status: res.status, ms, json };
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  ensureDir(AUDIT_DIR);
  const lines = [];
  lines.push('# Backend API Simulation');
  lines.push('');
  const base = 'http://127.0.0.1:3002';

  // News list default
  const newsDefault = await httpJson('GET', `${base}/news`);
  lines.push(`- GET /news -> ${newsDefault.status} (${newsDefault.ms} ms)`);

  // News list custom pagination
  const newsPage = await httpJson('GET', `${base}/news?page=2&limit=5`);
  lines.push(`- GET /news?page=2&limit=5 -> ${newsPage.status} (${newsPage.ms} ms)`);

  // News filter market
  const newsStocks = await httpJson('GET', `${base}/news?market=stocks&limit=5`);
  lines.push(`- GET /news?market=stocks -> ${newsStocks.status} (${newsStocks.ms} ms)`);

  // Search simple
  const searchApple = await httpJson('GET', `${base}/search?q=Seeded`);
  lines.push(`- GET /search?q=Seeded -> ${searchApple.status} (${searchApple.ms} ms)`);

  // Fetch a single news by id if available
  let newsId = null;
  if (newsDefault.json && newsDefault.json.data && Array.isArray(newsDefault.json.data.news) && newsDefault.json.data.news.length > 0) {
    newsId = newsDefault.json.data.news[0].id;
  }
  if (newsId) {
    const one = await httpJson('GET', `${base}/news/${newsId}`);
    lines.push(`- GET /news/:id -> ${one.status} (${one.ms} ms)`);
  }

  lines.push('');
  lines.push('```json');
  lines.push(JSON.stringify({ newsDefault, newsPage, newsStocks, searchApple }, null, 2));
  lines.push('```');

  fs.writeFileSync(LOG_PATH, lines.join('\n') + '\n', 'utf8');
  console.log(`API simulation log written: ${LOG_PATH}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


