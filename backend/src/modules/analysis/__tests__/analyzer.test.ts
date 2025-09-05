import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { AnalyzerService } from '../analyzer.service';
import { AnalysisDetail } from '../analysis-detail.entity';
import { News } from '../../news/news.entity';

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

describe('AnalyzerService', () => {
  let ds: DataSource;
  let svc: AnalyzerService;

  beforeEach(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [News, AnalysisDetail], synchronize: true } as any);
    await ds.initialize();
    svc = new AnalyzerService(ds);
  });

  afterEach(async () => {
    await ds.destroy();
  });

  it('returns BUY for positive keywords', async () => {
    const repo = ds.getRepository(News);
    const n = await repo.save(
      repo.create({ id: '40000000-0000-4000-8000-000000000001', sourceUrl: 's', title: 'Company beats expectations', contentRaw: 'Up 10%', contentHash: 'x' } as any),
    );
    const d = await svc.analyzeNews((n as any).id);
    expect(d.recommendation).toBe('BUY');
  });

  it('returns SELL for negative keywords', async () => {
    const repo = ds.getRepository(News);
    const n = await repo.save(repo.create({ sourceUrl: 's', title: 'Revenue down', contentRaw: 'miss forecast', contentHash: 'y' } as any));
    const d = await svc.analyzeNews((n as any).id);
    expect(d.recommendation).toBe('SELL');
  });
});


