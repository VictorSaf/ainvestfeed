import React from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type NewsItem = {
  id: string;
  title: string;
  excerpt?: string | null;
  sourceName?: string | null;
  publishedAtSource?: string | null;
};

async function toggleBookmark(newsId: string) {
  const res = await apiFetch(`/news/${newsId}/bookmark`, { method: 'POST' });
  return res.ok;
}

export default function Feed() {
  const [items, setItems] = React.useState<NewsItem[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = React.useState<Set<string>>(new Set());
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [q, setQ] = React.useState('');
  const [searching, setSearching] = React.useState(false);
  const [market, setMarket] = React.useState('');
  const [limit, setLimit] = React.useState(10);
  const auth = useAuth();
  const searchAbortRef = React.useRef<AbortController | null>(null);
  const searchSeqRef = React.useRef(0);

  async function fetchFeed(currentMarket: string, currentLimit: number) {
    const qs = new URLSearchParams();
    qs.set('limit', String(currentLimit));
    if (currentMarket) qs.set('market', currentMarket);
    const r = await apiFetch(`/news?${qs.toString()}`);
    const j = await r.json();
    setItems(j.data?.news ?? []);
  }

  React.useEffect(() => {
    fetchFeed(market, limit)
      .then(() => setLoading(false))
      .catch(() => {
        setError('Failed to load news');
        setLoading(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    (async () => {
      if (!auth.isAuthenticated) { setBookmarkedIds(new Set()); return; }
      try {
        const r = await apiFetch('/user/bookmarks');
        const j = await r.json();
        const ids = new Set<string>((j.data?.bookmarks ?? []).map((b: any) => b.news.id));
        setBookmarkedIds(ids);
      } catch {}
    })();
  }, [auth.isAuthenticated]);

  const handleBookmark = async (id: string) => {
    if (!auth.isAuthenticated) {
      alert('Please login to bookmark');
      return;
    }
    // optimistic toggle
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    const ok = await toggleBookmark(id);
    if (!ok) {
      // revert on failure
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">Latest News</h2>
      <div className="mb-4 flex gap-2">
        <select aria-label="Market" data-testid="market" className="border rounded px-3 py-2" value={market} onChange={(e) => setMarket(e.target.value)}>
          <option value="">All markets</option>
          <option value="stocks">stocks</option>
          <option value="commodities">commodities</option>
          <option value="forex">forex</option>
          <option value="crypto">crypto</option>
        </select>
        <select aria-label="Limit" data-testid="limit" className="border rounded px-3 py-2" value={limit} onChange={(e) => setLimit(Number(e.target.value))}>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <button className="border rounded px-3 py-2" data-testid="apply-filters" onClick={() => fetchFeed(market, limit)}>Apply</button>
        <input
          placeholder="Search news..."
          aria-label="Search news"
          className="flex-1 border rounded px-3 py-2"
          data-testid="search-box"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={async (e) => {
            if (e.key === 'Enter') {
              setSearching(true);
              // cancel previous request
              if (searchAbortRef.current) searchAbortRef.current.abort();
              const controller = new AbortController();
              searchAbortRef.current = controller;
              const myId = ++searchSeqRef.current;
              try {
                const r = await apiFetch(`/search?q=${encodeURIComponent(q)}&limit=10`, { signal: controller.signal });
                const j = await r.json();
                if (myId === searchSeqRef.current) setItems(j.data?.results ?? []);
              } catch (err: any) {
                if (err?.name !== 'AbortError') setError('Failed to search');
              } finally {
                if (myId === searchSeqRef.current) setSearching(false);
              }
            }
          }}
        />
        <button
          className="border rounded px-3 py-2"
          data-testid="search-button"
          aria-label="Search"
          disabled={q.trim().length === 0}
          onClick={async () => {
            setSearching(true);
            if (searchAbortRef.current) searchAbortRef.current.abort();
            const controller = new AbortController();
            searchAbortRef.current = controller;
            const myId = ++searchSeqRef.current;
            try {
              const r = await apiFetch(`/search?q=${encodeURIComponent(q)}&limit=10`, { signal: controller.signal });
              const j = await r.json();
              if (myId === searchSeqRef.current) setItems(j.data?.results ?? []);
            } catch (err: any) {
              if (err?.name !== 'AbortError') setError('Failed to search');
            } finally {
              if (myId === searchSeqRef.current) setSearching(false);
            }
          }}
        >Search</button>
      </div>
      {searching ? <div className="mb-2 text-sm text-gray-500" aria-live="polite">Searching…</div> : null}
      {error ? (
        <div className="p-4 text-red-600" role="alert">{error}</div>
      ) : loading ? (
        <div className="p-4">
          Loading…
          <div className="mt-3 space-y-3 animate-pulse" aria-hidden>
            <div className="h-5 bg-gray-200 rounded" />
            <div className="h-5 bg-gray-200 rounded w-5/6" />
            <div className="h-5 bg-gray-200 rounded w-2/3" />
          </div>
        </div>
      ) : (
        <div>
          <ul className="space-y-3">
            {items.length === 0 ? (
              <li className="p-4 text-gray-600" aria-live="polite">No results.</li>
            ) : items.map((n) => (
              <li key={n.id} className="p-4 border rounded">
                <div className="font-medium">{n.title}</div>
                {n.excerpt ? <div className="text-sm text-gray-600 mt-1">{n.excerpt}</div> : null}
                <div className="text-xs text-gray-500 mt-2">
                  {n.sourceName ?? 'Unknown source'}
                  {n.publishedAtSource ? ` • ${new Date(n.publishedAtSource).toLocaleString()}` : ''}
                </div>
                <div className="mt-2">
                  <button
                    className="text-sm border rounded px-2 py-1"
                    onClick={() => handleBookmark(n.id)}
                    data-testid={`bm-${n.id}`}
                    aria-current={bookmarkedIds.has(n.id) ? 'true' : undefined}
                  >
                    {bookmarkedIds.has(n.id) ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}


