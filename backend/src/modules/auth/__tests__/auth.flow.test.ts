import request from 'supertest';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { app, initRoutes } from '../../../web/app';
import { User } from '../../users/user.entity';
import { UserSession } from '../../users/user-session.entity';

function registerPgMemFunctions(db: ReturnType<typeof newDb>) {
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
      'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }),
  });
}

describe('Auth flow', () => {
  let memDs: DataSource;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    registerPgMemFunctions(db);
    memDs = await db.adapters.createTypeormDataSource({
      type: 'postgres',
      entities: [User, UserSession],
      synchronize: true,
    } as any);
    await memDs.initialize();
    // Register routes with the in-memory datasource
    initRoutes(memDs);
  });

  afterAll(async () => {
    await memDs.destroy();
  });

  it('registers, logins, refreshes and logs out', async () => {
    const email = 'flow@example.com';
    const password = 'Password123!';

    const r1 = await request(app).post('/auth/register').send({ email, password });
    expect(r1.status).toBe(201);

    const r2 = await request(app).post('/auth/login').send({ email, password });
    expect(r2.status).toBe(200);
    const { accessToken, refreshToken } = r2.body.data.tokens;
    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    const r3 = await request(app).post('/auth/refresh').send({ refreshToken });
    expect(r3.status).toBe(200);
    expect(r3.body.data.tokens.accessToken).toBeDefined();

    const r4 = await request(app).post('/auth/logout').send({ refreshToken });
    expect(r4.status).toBe(200);
  });
});


