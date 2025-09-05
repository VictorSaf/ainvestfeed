import request from 'supertest';
import { app, initRoutes } from '../../../web/app';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { News } from '../../news/news.entity';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    returns: DataType.uuid,
    implementation: () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    })
  });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
}

describe('Search', () => {
  let ds: DataSource;
  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [News], synchronize: true } as any);
    await ds.initialize();
    initRoutes(ds);

    const repo = ds.getRepository(News);
    await repo.save(repo.create({ id: '80000000-0000-4000-8000-000000000001', sourceUrl: 's', title: 'Apple beats earnings', contentClean: 'Strong quarter', contentHash: 'h1', market: 'stocks' } as any));
    await repo.save(repo.create({ id: '80000000-0000-4000-8000-000000000002', sourceUrl: 's2', title: 'Oil prices down', contentClean: 'Market fall', contentHash: 'h2', market: 'commodities' } as any));
  });

  afterAll(async () => { await ds.destroy(); });

  it('finds items by text and filters by market', async () => {
    const r1 = await request(app).get('/search?q=apple');
    expect(r1.status).toBe(200);
    expect(r1.body.data.results.length).toBe(1);
    expect(r1.body.data.results[0].title.toLowerCase()).toContain('apple');

    const r2 = await request(app).get('/search?q=down&market=commodities');
    expect(r2.status).toBe(200);
    expect(r2.body.data.results.length).toBe(1);
    expect(r2.body.data.results[0].market).toBe('commodities');
  });
});


