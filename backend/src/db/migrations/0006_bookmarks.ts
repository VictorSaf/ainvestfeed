import { MigrationInterface, QueryRunner } from 'typeorm';

export class Bookmarks1700000000005 implements MigrationInterface {
  name = 'Bookmarks1700000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE bookmarks (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        news_id uuid NOT NULL REFERENCES news(id) ON DELETE CASCADE,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT uq_user_news UNIQUE (user_id, news_id)
      );
    `);
    await queryRunner.query(`CREATE INDEX idx_bookmarks_user ON bookmarks(user_id);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_bookmarks_user`);
    await queryRunner.query(`DROP TABLE IF EXISTS bookmarks`);
  }
}


