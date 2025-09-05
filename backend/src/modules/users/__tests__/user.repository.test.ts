import 'reflect-metadata';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { User } from '../user.entity';

describe('User repository (pg-mem)', () => {
  let dataSource: DataSource;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
    db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
    db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
    db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
    db.public.registerFunction({ name: 'inet_server_addr', returns: DataType.text, implementation: () => '127.0.0.1' });
    db.public.registerFunction({ name: 'inet_server_port', returns: DataType.integer, implementation: () => 5432 });
    db.public.registerFunction({
      name: 'uuid_generate_v4',
      returns: DataType.uuid,
      implementation: () =>
        (global as any).crypto?.randomUUID?.() ||
        'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = (Math.random() * 16) | 0,
            v = c === 'x' ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }),
    });
    // citext extension not available in pg-mem; using TEXT for email in tests

    dataSource = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User],
      synchronize: true,
    } as any);
    await dataSource.initialize();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('creates and reads a user', async () => {
    const repo = dataSource.getRepository(User);
    const user = repo.create({ email: 'test@example.com', passwordHash: 'hash' });
    await repo.save(user);

    const found = await repo.findOneByOrFail({ email: 'test@example.com' });
    expect(found.id).toBeDefined();
    expect(found.email).toBe('test@example.com');
  });
});


