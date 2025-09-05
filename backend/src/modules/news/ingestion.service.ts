import { DataSource } from 'typeorm';
import { News } from './news.entity';
import { sha256 } from '../../utils/hash';

export class IngestionService {
  constructor(private readonly ds: DataSource) {}

  async ingestItem(input: { sourceUrl: string; title: string; contentRaw?: string | null; sourceName?: string | null; canonicalUrl?: string | null; publishedAtSource?: Date | null; language?: string | null; market?: string | null; }): Promise<{ created: boolean; news: News }>
  {
    const repo = this.ds.getRepository(News);
    const contentBasis = `${input.title}\n${input.contentRaw ?? ''}`;
    const contentHash = sha256(contentBasis);

    const existing = await repo.findOne({ where: { contentHash } });
    if (existing) return { created: false, news: existing };

    const entity = repo.create({
      sourceUrl: input.sourceUrl,
      canonicalUrl: input.canonicalUrl,
      sourceName: input.sourceName,
      title: input.title,
      contentRaw: input.contentRaw ?? null,
      contentClean: input.contentRaw ?? null,
      contentHash,
      language: input.language ?? 'en',
      market: input.market ?? null,
      publishedAtSource: input.publishedAtSource ?? null,
    });
    const saved = await repo.save(entity);
    return { created: true, news: saved };
  }
}


