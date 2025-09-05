import { DataSource } from 'typeorm';
import { AnalysisDetail, Recommendation } from './analysis-detail.entity';
import { News } from '../news/news.entity';

export class AnalyzerService {
  constructor(private readonly ds: DataSource) {}

  // Stub analyzer: simple keyword heuristics for demo purposes
  async analyzeNews(newsId: string): Promise<AnalysisDetail> {
    const newsRepo = this.ds.getRepository(News);
    const detailRepo = this.ds.getRepository(AnalysisDetail);
    const item = await newsRepo.findOneByOrFail({ id: newsId });
    const text = `${item.title} ${item.contentClean ?? item.contentRaw ?? ''}`.toLowerCase();
    let rec: Recommendation = 'HOLD';
    let confidence = 60;
    if (text.includes('beats') || text.includes('record') || text.includes('up')) {
      rec = 'BUY';
      confidence = 75;
    } else if (text.includes('miss') || text.includes('down') || text.includes('fall')) {
      rec = 'SELL';
      confidence = 70;
    }
    const reasoning = `Heuristic analysis from content. Recommendation=${rec}`;
    const row = detailRepo.create({ news: item, recommendation: rec, confidenceScore: confidence, reasoning });
    return detailRepo.save(row);
  }
}


