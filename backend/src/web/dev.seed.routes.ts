import { Router, Request, Response } from 'express';
import { DataSource } from 'typeorm';
import { z } from 'zod';
import { News } from '../modules/news/news.entity';

export function createSeedRouter(ds: DataSource): Router {
  const router = Router();
  const repo = ds.getRepository(News);

  router.post('/__seed/news', async (req: Request, res: Response) => {
    const body = z.object({ title: z.string().min(1), market: z.string().optional() }).safeParse(req.body);
    if (!body.success) return res.status(400).json({ success: false, error: { code: 'VALIDATION_ERROR' } });
    const { title, market } = body.data;
    const now = Date.now();
    const item = repo.create({
      sourceUrl: `seed://news/${now}`,
      title,
      contentHash: `seed_${now}_${Math.random().toString(36).slice(2)}`,
      market: market ?? 'stocks',
    } as any);
    const saved = await repo.save(item);
    const s = saved as unknown as News;
    return res.status(201).json({ success: true, data: { id: s.id, title: s.title } });
  });

  return router;
}


