import request from 'supertest';
import { app, initRoutes } from '../../../web/app';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { News } from '../news.entity';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: DataType.uuid, implementation: () => (global as any).crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; const v = c === 'x' ? r : (r & 0x3) | 0x8; return v.toString(16); }) });
}

describe('News cache', () => {
  let ds: DataSource;
  let newsId: string;
  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [News], synchronize: true } as any);
    await ds.initialize();
    initRoutes(ds);
    const repo = ds.getRepository(News);
    const n = await repo.save(repo.create({ sourceUrl: 's', title: 'Cached item', contentHash: 'hc' } as any));
    newsId = (n as any).id;
  });

  afterAll(async () => { await ds.destroy(); });

  it('returns x-cache MISS then HIT for detail', async () => {
    const r1 = await request(app).get(`/news/${newsId}`);
    expect(r1.headers['x-cache']).toBe('MISS');
    const r2 = await request(app).get(`/news/${newsId}`);
    expect(r2.headers['x-cache']).toBe('HIT');
  });

  it('returns x-cache MISS then HIT for list', async () => {
    const r1 = await request(app).get('/news?limit=5&page=1');
    expect(r1.headers['x-cache']).toBe('MISS');
    const r2 = await request(app).get('/news?limit=5&page=1');
    expect(r2.headers['x-cache']).toBe('HIT');
  });
});


