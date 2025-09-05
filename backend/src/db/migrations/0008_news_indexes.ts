import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewsIndexes1700000000007 implements MigrationInterface {
  name = 'NewsIndexes1700000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_news_published_at ON news(published_at_source DESC NULLS LAST, created_at DESC);`);
    await queryRunner.query(`CREATE INDEX IF NOT EXISTS idx_news_market_published ON news(market, published_at_source DESC NULLS LAST);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_news_market_published;`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_news_published_at;`);
  }
}


