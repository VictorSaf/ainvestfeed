import { DataSource } from 'typeorm';
import { AnalysisSummary } from './analysis-summary.entity';
import { News } from '../news/news.entity';

export class SummarizerService {
  constructor(private readonly ds: DataSource) {}

  // Stub summarizer: trims content/title, returns first 150 chars
  async summarizeNews(newsId: string): Promise<AnalysisSummary> {
    const newsRepo = this.ds.getRepository(News);
    const sumRepo = this.ds.getRepository(AnalysisSummary);
    const item = await newsRepo.findOneByOrFail({ id: newsId });
    const base = item.contentClean ?? item.contentRaw ?? item.title;
    const text = (base || item.title).slice(0, 150);
    const row = sumRepo.create({ news: item, summaryText: text, sentimentScore: null });
    return sumRepo.save(row);
  }
}


