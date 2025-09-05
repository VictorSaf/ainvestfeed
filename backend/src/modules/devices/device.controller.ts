import { Router, Response } from 'express';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { requireAuth, AuthenticatedRequest } from '../auth/requireAuth';
import { Device } from './device.entity';
import { User } from '../users/user.entity';

export function createDeviceRouter(ds: DataSource): Router {
  const router = Router();
  const repo = ds.getRepository(Device);
  const userRepo = ds.getRepository(User);

  router.post('/user/devices', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const body = z
      .object({ pushToken: z.string().min(1), platform: z.string().optional(), deviceModel: z.string().optional(), locale: z.string().optional() })
      .safeParse(req.body);
    if (!body.success || !req.user) {
      return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid body' } });
    }
    const user = await userRepo.findOneByOrFail({ id: req.user.id });

    const existing: Array<{ id: string }> = await ds.query(
      'SELECT id FROM devices WHERE user_id = $1 AND push_token = $2 LIMIT 1',
      [user.id, body.data.pushToken]
    );
    if (existing.length === 0) {
      const inserted: Array<{ id: string }> = await ds.query(
        'INSERT INTO devices (user_id, push_token, platform, device_model, locale) VALUES ($1, $2, $3, $4, $5) RETURNING id',
        [user.id, body.data.pushToken, body.data.platform ?? null, body.data.deviceModel ?? null, body.data.locale ?? null]
      );
      const device = await repo.findOneByOrFail({ id: inserted[0].id });
      return res.status(201).json({ success: true, data: { device } });
    }
    const id = existing[0].id;
    await ds.query('UPDATE devices SET platform = COALESCE($1, platform), device_model = COALESCE($2, device_model), locale = COALESCE($3, locale) WHERE id = $4', [
      body.data.platform ?? null,
      body.data.deviceModel ?? null,
      body.data.locale ?? null,
      id,
    ]);
    const device = await repo.findOneByOrFail({ id });
    return res.status(200).json({ success: true, data: { device } });
  });

  router.get('/user/devices', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const devices = await ds.query('SELECT * FROM devices WHERE user_id = $1 ORDER BY updated_at DESC', [req.user!.id]);
    return res.status(200).json({ success: true, data: { devices } });
  });

  router.delete('/user/devices/:id', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const id = req.params.id;
    const rows: Array<{ id: string }> = await ds.query('SELECT id FROM devices WHERE id = $1 AND user_id = $2 LIMIT 1', [id, req.user!.id]);
    if (rows.length === 0) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Device not found' } });
    await ds.query('DELETE FROM devices WHERE id = $1', [rows[0].id]);
    return res.status(200).json({ success: true });
  });

  return router;
}


