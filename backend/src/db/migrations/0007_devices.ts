import { MigrationInterface, QueryRunner } from 'typeorm';

export class Devices1700000000006 implements MigrationInterface {
  name = 'Devices1700000000006';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE devices (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        push_token text NOT NULL,
        platform text NULL,
        device_model text NULL,
        locale text NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT uq_user_token UNIQUE (user_id, push_token)
      );
    `);
    await queryRunner.query(`CREATE INDEX idx_devices_user ON devices(user_id);`);
    await queryRunner.query(`CREATE INDEX idx_devices_push_token ON devices(push_token);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS idx_devices_push_token`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_devices_user`);
    await queryRunner.query(`DROP TABLE IF EXISTS devices`);
  }
}


