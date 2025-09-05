import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewsAndScraping1700000000002 implements MigrationInterface {
  name = 'NewsAndScraping1700000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE news (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        source_url TEXT NOT NULL,
        canonical_url TEXT UNIQUE,
        source_name TEXT,
        title TEXT NOT NULL,
        excerpt TEXT,
        content_raw TEXT,
        content_clean TEXT,
        content_hash TEXT NOT NULL,
        language TEXT DEFAULT 'en',
        market TEXT,
        published_at_source TIMESTAMPTZ,
        scraped_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX idx_news_content_hash ON news(content_hash);`);

    await queryRunner.query(`
      CREATE TABLE scraping_configs (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        name TEXT NOT NULL,
        source_type TEXT NOT NULL,
        source_url TEXT NOT NULL,
        cron_schedule TEXT NOT NULL DEFAULT '*/5 * * * *',
        is_active BOOLEAN NOT NULL DEFAULT TRUE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE TABLE scraping_runs (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        config_id uuid NOT NULL REFERENCES scraping_configs(id),
        started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        finished_at TIMESTAMPTZ,
        status TEXT NOT NULL DEFAULT 'running',
        items_found INT NOT NULL DEFAULT 0
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS scraping_runs`);
    await queryRunner.query(`DROP TABLE IF EXISTS scraping_configs`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_news_content_hash`);
    await queryRunner.query(`DROP TABLE IF EXISTS news`);
  }
}


