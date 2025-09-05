import request from 'supertest';
import { app, initRoutes } from '../../../web/app';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { User } from '../../users/user.entity';
import { News } from '../../news/news.entity';
import { UserSession } from '../../users/user-session.entity';
import { Bookmark } from '../bookmark.entity';
import { hashPassword } from '../../../utils/hash';
import { signAccessToken } from '../../auth/jwt';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: DataType.uuid, implementation: () => '70000000-0000-4000-8000-000000000000' });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
}

describe('Bookmarks', () => {
  let ds: DataSource;
  let userId: string;
  let accessToken: string;
  let newsId: string;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [User, UserSession, News, Bookmark], synchronize: true } as any);
    await ds.initialize();
    initRoutes(ds);

    const u = await ds.getRepository(User).save(ds.getRepository(User).create({ email: 'b@example.com', passwordHash: await hashPassword('Password123!') }));
    userId = (u as any).id;
    accessToken = signAccessToken({ sub: userId, email: u.email, role: 'user' });
    const n = await ds.getRepository(News).save(ds.getRepository(News).create({ sourceUrl: 's', title: 'News', contentHash: 'h' } as any));
    newsId = (n as any).id;
  });

  afterAll(async () => { await ds.destroy(); });

  it('toggles bookmark and lists it', async () => {
    const add = await request(app).post(`/news/${newsId}/bookmark`).set('Authorization', `Bearer ${accessToken}`);
    expect([200, 201]).toContain(add.status);
    const list = await request(app).get('/user/bookmarks').set('Authorization', `Bearer ${accessToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data.bookmarks.length).toBe(1);

    const remove = await request(app).post(`/news/${newsId}/bookmark`).set('Authorization', `Bearer ${accessToken}`);
    expect(remove.status).toBe(200);
    const list2 = await request(app).get('/user/bookmarks').set('Authorization', `Bearer ${accessToken}`);
    expect(list2.body.data.bookmarks.length).toBe(0);
  });
});


