import request from 'supertest';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { app, initRoutes } from '../../../web/app';
import { User } from '../user.entity';
import { UserSession } from '../user-session.entity';
import { hashPassword } from '../../../utils/hash';
import { signAccessToken } from '../../auth/jwt';

function setupDbFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: DataType.uuid, implementation: () => '00000000-0000-4000-8000-000000000000' });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
  db.public.registerFunction({ name: 'inet_server_addr', returns: DataType.text, implementation: () => '127.0.0.1' });
  db.public.registerFunction({ name: 'inet_server_port', returns: DataType.integer, implementation: () => 5432 });
}

describe('User profile', () => {
  let ds: DataSource;
  let userId: string;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupDbFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [User, UserSession], synchronize: true } as any);
    await ds.initialize();
    initRoutes(ds);

    const repo = ds.getRepository(User);
    const u = repo.create({ email: 'p@example.com', passwordHash: await hashPassword('Password123!') });
    await repo.save(u);
    userId = u.id;
  });

  afterAll(async () => {
    await ds.destroy();
  });

  it('GET and PUT profile', async () => {
    const token = signAccessToken({ sub: userId, email: 'p@example.com', role: 'user' });

    const g = await request(app).get('/user/profile').set('Authorization', `Bearer ${token}`);
    expect(g.status).toBe(200);
    expect(g.body.data.user.email).toBe('p@example.com');

    const p = await request(app)
      .put('/user/profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ firstName: 'John', lastName: 'Doe', language: 'ro', timezone: 'Europe/Bucharest' });
    expect(p.status).toBe(200);
    expect(p.body.data.user.firstName).toBe('John');
  });
});


