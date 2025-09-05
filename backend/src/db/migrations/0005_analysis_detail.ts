import { MigrationInterface, QueryRunner } from 'typeorm';

export class AnalysisDetail1700000000004 implements MigrationInterface {
  name = 'AnalysisDetail1700000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE analysis_detail (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        news_id uuid NOT NULL REFERENCES news(id) ON DELETE CASCADE,
        instrument_symbol TEXT,
        market TEXT,
        recommendation TEXT NOT NULL,
        confidence_score INT NOT NULL,
        reasoning TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE INDEX idx_analysis_detail_news ON analysis_detail(news_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_analysis_detail_news`);
    await queryRunner.query(`DROP TABLE IF EXISTS analysis_detail`);
  }
}


