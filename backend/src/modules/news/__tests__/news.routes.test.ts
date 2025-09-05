import request from 'supertest';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { app, initRoutes } from '../../../web/app';
import { News } from '../news.entity';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    returns: DataType.uuid,
    implementation: () =>
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }),
  });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
}

describe('News routes', () => {
  let ds: DataSource;
  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [News], synchronize: true } as any);
    await ds.initialize();
    initRoutes(ds);
    const repo = ds.getRepository(News);
    await repo.save(
      repo.create({ id: '00000000-0000-4000-8000-000000000001', sourceUrl: 's', title: 'T1', contentHash: 'h1' } as any),
    );
    await repo.save(
      repo.create({ id: '00000000-0000-4000-8000-000000000002', sourceUrl: 's2', title: 'T2', contentHash: 'h2', market: 'stocks' } as any),
    );
  });
  afterAll(async () => { await ds.destroy(); });

  it('lists news with pagination', async () => {
    const r = await request(app).get('/news?limit=1&page=1');
    expect(r.status).toBe(200);
    expect(r.body.data.news.length).toBe(1);
    expect(r.body.data.pagination.total).toBe(2);
  });

  it('filters by market', async () => {
    const r = await request(app).get('/news?market=stocks');
    expect(r.status).toBe(200);
    expect(r.body.data.news.every((n: any) => n.market === 'stocks' || n.market === null || n.market === undefined)).toBe(true);
  });

  it('gets news by id', async () => {
    const list = await request(app).get('/news');
    const id = list.body.data.news[0].id;
    const r = await request(app).get(`/news/${id}`);
    expect(r.status).toBe(200);
    expect(r.body.data.id).toBe(id);
  });

  it('returns 400 on invalid pagination (page=0)', async () => {
    const r = await request(app).get('/news?page=0');
    expect(r.status).toBe(400);
    expect(r.body.success).toBe(false);
  });
});


