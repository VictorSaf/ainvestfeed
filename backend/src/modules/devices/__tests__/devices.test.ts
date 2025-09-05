import request from 'supertest';
import { app, initRoutes } from '../../../web/app';
import { newDb, DataType } from 'pg-mem';
import { DataSource } from 'typeorm';
import { User } from '../../users/user.entity';
import { UserSession } from '../../users/user-session.entity';
import { Device } from '../device.entity';
import { hashPassword } from '../../../utils/hash';
import { signAccessToken } from '../../auth/jwt';

function setupFns(db: ReturnType<typeof newDb>) {
  db.public.registerFunction({ name: 'now', returns: DataType.timestamptz, implementation: () => new Date() });
  db.public.registerFunction({ name: 'version', returns: DataType.text, implementation: () => 'PostgreSQL 14.0 on pg-mem' });
  db.public.registerFunction({ name: 'current_database', returns: DataType.text, implementation: () => 'pg_mem_db' });
  db.public.registerFunction({ name: 'current_schema', returns: DataType.text, implementation: () => 'public' });
  db.public.registerFunction({ name: 'uuid_generate_v4', returns: DataType.uuid, implementation: () => (global as any).crypto?.randomUUID?.() || 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => { const r = (Math.random() * 16) | 0; const v = c === 'x' ? r : (r & 0x3) | 0x8; return v.toString(16); }) });
}

describe('Devices', () => {
  let ds: DataSource;
  let accessToken: string;
  let deviceId: string;

  beforeAll(async () => {
    const db = newDb({ autoCreateForeignKeyIndices: true });
    setupFns(db);
    ds = await db.adapters.createTypeormDataSource({ type: 'postgres', entities: [User, UserSession, Device], synchronize: true } as any);
    await ds.initialize();
    initRoutes(ds);
    const u = await ds.getRepository(User).save(ds.getRepository(User).create({ email: 'dev@example.com', passwordHash: await hashPassword('Password123!') }));
    accessToken = signAccessToken({ sub: (u as any).id, email: u.email, role: 'user' });
  });

  afterAll(async () => { await ds.destroy(); });

  it('registers a device and lists it, updates and deletes', async () => {
    const reg = await request(app).post('/user/devices').set('Authorization', `Bearer ${accessToken}`).send({ pushToken: 'tkn1', platform: 'ios', deviceModel: 'iPhone', locale: 'en-US' });
    expect([200, 201]).toContain(reg.status);
    deviceId = reg.body.data.device.id;
    const list = await request(app).get('/user/devices').set('Authorization', `Bearer ${accessToken}`);
    expect(list.status).toBe(200);
    expect(list.body.data.devices.length).toBe(1);
    const upd = await request(app).post('/user/devices').set('Authorization', `Bearer ${accessToken}`).send({ pushToken: 'tkn1', platform: 'android' });
    expect([200, 201]).toContain(upd.status);
    const del = await request(app).delete(`/user/devices/${deviceId}`).set('Authorization', `Bearer ${accessToken}`);
    expect(del.status).toBe(200);
    const list2 = await request(app).get('/user/devices').set('Authorization', `Bearer ${accessToken}`);
    expect(list2.body.data.devices.length).toBe(0);
  });
});


