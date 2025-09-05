import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserProfileFields1700000000001 implements MigrationInterface {
  name = 'UserProfileFields1700000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      ADD COLUMN first_name TEXT,
      ADD COLUMN last_name TEXT,
      ADD COLUMN language TEXT DEFAULT 'en',
      ADD COLUMN timezone TEXT DEFAULT 'UTC'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE users
      DROP COLUMN IF EXISTS timezone,
      DROP COLUMN IF EXISTS language,
      DROP COLUMN IF EXISTS last_name,
      DROP COLUMN IF EXISTS first_name
    `);
  }
}


