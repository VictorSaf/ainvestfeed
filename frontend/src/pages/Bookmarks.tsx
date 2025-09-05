import React from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';

type BookmarkItem = { id: string; news: { id: string; title: string; excerpt?: string | null } };

export default function Bookmarks() {
  const [items, setItems] = React.useState<BookmarkItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const auth = useAuth();

  React.useEffect(() => {
    (async () => {
      if (!auth.isAuthenticated) { setLoading(false); return; }
      const r = await apiFetch('/user/bookmarks');
      const j = await r.json();
      setItems(j.data?.bookmarks ?? []);
      setLoading(false);
    })();
  }, [auth.isAuthenticated]);

  if (!auth.isAuthenticated) return <div className="max-w-2xl mx-auto p-4" role="alert">Please login to view bookmarks.</div>;
  if (loading) return (
    <div className="max-w-2xl mx-auto p-4">
      Loading…
      <div className="mt-3 space-y-3 animate-pulse" aria-hidden>
        <div className="h-5 bg-gray-200 rounded" />
        <div className="h-5 bg-gray-200 rounded w-5/6" />
        <div className="h-5 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4">My Bookmarks</h2>
      {items.length === 0 ? (
        <div className="text-gray-600">No bookmarks yet.</div>
      ) : (
        <ul className="space-y-3">
          {items.map((b) => (
            <li key={b.id} className="p-4 border rounded">
              <div className="font-medium">{b.news.title}</div>
              {b.news.excerpt ? <div className="text-sm text-gray-600 mt-1">{b.news.excerpt}</div> : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


