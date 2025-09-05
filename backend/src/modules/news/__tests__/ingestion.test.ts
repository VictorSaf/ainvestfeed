import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { IngestionService } from '../ingestion.service';
import { News } from '../news.entity';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: DataType.uuid, implementation: () => '10000000-0000-4000-8000-000000000000' });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
}

describe('IngestionService', () => {
  let ds: DataSource;
  let svc: IngestionService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [News], synchronize: true } as any);
    await ds.initialize();
    svc = new IngestionService(ds);
  });

  afterAll(async () => {
    await ds.destroy();
  });

  it('creates and deduplicates news by content_hash', async () => {
    const input = { sourceUrl: 'https://ex', title: 'Hello', contentRaw: 'World' };
    const r1 = await svc.ingestItem(input);
    expect(r1.created).toBe(true);
    const r2 = await svc.ingestItem(input);
    expect(r2.created).toBe(false);
    expect(r2.news.id).toBe(r1.news.id);
  });
});


