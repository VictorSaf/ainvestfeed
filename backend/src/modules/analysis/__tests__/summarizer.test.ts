import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { SummarizerService } from '../summarizer.service';
import { AnalysisSummary } from '../analysis-summary.entity';
import { News } from '../../news/news.entity';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: DataType.uuid, implementation: () => '30000000-0000-4000-8000-000000000000' });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
}

describe('SummarizerService', () => {
  let ds: DataSource;
  let svc: SummarizerService;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [News, AnalysisSummary], synchronize: true } as any);
    await ds.initialize();
    svc = new SummarizerService(ds);
  });

  afterAll(async () => {
    await ds.destroy();
  });

  it('creates a summary for a news item', async () => {
    const repo = ds.getRepository(News);
    const saved = await repo.save(repo.create({ sourceUrl: 's', title: 'Title', contentRaw: 'Some long content', contentHash: 'h' } as any));
    const summary = await svc.summarizeNews((saved as any).id);
    expect(summary.summaryText.length).toBeGreaterThan(0);
    expect(summary.news.id).toBe((saved as any).id);
  });
});


