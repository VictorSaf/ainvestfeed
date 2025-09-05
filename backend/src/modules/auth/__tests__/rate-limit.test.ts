import request from 'supertest';
import { app, initRoutes } from '../../../web/app';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { User } from '../../users/user.entity';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: DataType.uuid, implementation: () => '60000000-0000-4000-8000-000000000000' });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
}

describe('Global rate limit', () => {
  let ds: DataSource;
  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [User], synchronize: true } as any);
    await ds.initialize();
    initRoutes(ds);
  });
  afterAll(async () => { await ds.destroy(); });

  it('handles multiple requests without crashing', async () => {
    for (let i = 0; i < 50; i++) {
      await request(app).get('/health');
    }
    const r = await request(app).get('/health');
    expect([200, 429]).toContain(r.status);
  });
});


