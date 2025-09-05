import { Router, Response } from 'express';
import { DataSource } from 'typeorm';
import { requireAuth, AuthenticatedRequest } from '../auth/requireAuth';
import { Bookmark } from './bookmark.entity';
import { News } from '../news/news.entity';

export function createBookmarkRouter(ds: DataSource): Router {
  const router = Router();
  const repo = ds.getRepository(Bookmark);
  const newsRepo = ds.getRepository(News);

  router.post('/news/:id/bookmark', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const newsId = req.params.id;
    try {
      const news = await newsRepo.findOne({ where: { id: newsId } });
      if (!news) return res.status(404).json({ success: false, error: { code: 'RESOURCE_NOT_FOUND', message: 'News not found' } });

      const existing: Array<{ id: string }> = await ds.query('SELECT id FROM bookmarks WHERE user_id = $1 AND news_id = $2 LIMIT 1', [req.user!.id, newsId]);
      if (existing.length > 0) {
        await ds.query('DELETE FROM bookmarks WHERE id = $1', [existing[0].id]);
        return res.status(200).json({ success: true, data: { bookmarked: false } });
      }
      const inserted: Array<{ id: string }> = await ds.query(
        'INSERT INTO bookmarks (user_id, news_id) VALUES ($1, $2) RETURNING id',
        [req.user!.id, newsId]
      );
      return res.status(201).json({ success: true, data: { bookmarked: true, id: inserted[0].id } });
    } catch (e: any) {
      return res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: e.message } });
    }
  });

  router.get('/user/bookmarks', requireAuth, async (req: AuthenticatedRequest, res: Response) => {
    const rows: Array<{ id: string; news_id: string; title: string | null; excerpt: string | null }> = await ds.query(
      `SELECT b.id, b.news_id, n.title, n.excerpt
       FROM bookmarks b
       JOIN news n ON n.id = b.news_id
       WHERE b.user_id = $1
       ORDER BY b.created_at DESC`,
      [req.user!.id]
    );
    return res.status(200).json({ success: true, data: { bookmarks: rows.map((r) => ({ id: r.id, news: { id: r.news_id, title: r.title, excerpt: r.excerpt } })) } });
  });

  return router;
}


