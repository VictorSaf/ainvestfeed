import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnalysisSummary1700000000003 implements MigrationInterface {
  name = 'AnalysisSummary1700000000003';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE analysis_summary (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        news_id uuid NOT NULL REFERENCES news(id) ON DELETE CASCADE,
        summary_text TEXT NOT NULL,
        sentiment_score NUMERIC,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE INDEX idx_analysis_summary_news ON analysis_summary(news_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_analysis_summary_news`);
    await queryRunner.query(`DROP TABLE IF EXISTS analysis_summary`);
  }
}


