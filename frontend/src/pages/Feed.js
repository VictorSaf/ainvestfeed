import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
async function toggleBookmark(newsId) {
    const res = await apiFetch(`/news/${newsId}/bookmark`, { method: 'POST' });
    return res.ok;
}
export default function Feed() {
    const [items, setItems] = React.useState([]);
    const [bookmarkedIds, setBookmarkedIds] = React.useState(new Set());
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [q, setQ] = React.useState('');
    const [searching, setSearching] = React.useState(false);
    const [market, setMarket] = React.useState('');
    const [limit, setLimit] = React.useState(10);
    const auth = useAuth();
    const searchAbortRef = React.useRef(null);
    const searchSeqRef = React.useRef(0);
    async function fetchFeed(currentMarket, currentLimit) {
        const qs = new URLSearchParams();
        qs.set('limit', String(currentLimit));
        if (currentMarket)
            qs.set('market', currentMarket);
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
            if (!auth.isAuthenticated) {
                setBookmarkedIds(new Set());
                return;
            }
            try {
                const r = await apiFetch('/user/bookmarks');
                const j = await r.json();
                const ids = new Set((j.data?.bookmarks ?? []).map((b) => b.news.id));
                setBookmarkedIds(ids);
            }
            catch { }
        })();
    }, [auth.isAuthenticated]);
    const handleBookmark = async (id) => {
        if (!auth.isAuthenticated) {
            alert('Please login to bookmark');
            return;
        }
        // optimistic toggle
        setBookmarkedIds((prev) => {
            const next = new Set(prev);
            if (next.has(id))
                next.delete(id);
            else
                next.add(id);
            return next;
        });
        const ok = await toggleBookmark(id);
        if (!ok) {
            // revert on failure
            setBookmarkedIds((prev) => {
                const next = new Set(prev);
                if (next.has(id))
                    next.delete(id);
                else
                    next.add(id);
                return next;
            });
        }
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "Latest News" }), _jsxs("div", { className: "mb-4 flex gap-2", children: [_jsxs("select", { "aria-label": "Market", "data-testid": "market", className: "border rounded px-3 py-2", value: market, onChange: (e) => setMarket(e.target.value), children: [_jsx("option", { value: "", children: "All markets" }), _jsx("option", { value: "stocks", children: "stocks" }), _jsx("option", { value: "commodities", children: "commodities" }), _jsx("option", { value: "forex", children: "forex" }), _jsx("option", { value: "crypto", children: "crypto" })] }), _jsxs("select", { "aria-label": "Limit", "data-testid": "limit", className: "border rounded px-3 py-2", value: limit, onChange: (e) => setLimit(Number(e.target.value)), children: [_jsx("option", { value: 10, children: "10" }), _jsx("option", { value: 20, children: "20" }), _jsx("option", { value: 50, children: "50" })] }), _jsx("button", { className: "border rounded px-3 py-2", "data-testid": "apply-filters", onClick: () => fetchFeed(market, limit), children: "Apply" }), _jsx("input", { placeholder: "Search news...", "aria-label": "Search news", className: "flex-1 border rounded px-3 py-2", "data-testid": "search-box", value: q, onChange: (e) => setQ(e.target.value), onKeyDown: async (e) => {
                            if (e.key === 'Enter') {
                                setSearching(true);
                                // cancel previous request
                                if (searchAbortRef.current)
                                    searchAbortRef.current.abort();
                                const controller = new AbortController();
                                searchAbortRef.current = controller;
                                const myId = ++searchSeqRef.current;
                                try {
                                    const r = await apiFetch(`/search?q=${encodeURIComponent(q)}&limit=10`, { signal: controller.signal });
                                    const j = await r.json();
                                    if (myId === searchSeqRef.current)
                                        setItems(j.data?.results ?? []);
                                }
                                catch (err) {
                                    if (err?.name !== 'AbortError')
                                        setError('Failed to search');
                                }
                                finally {
                                    if (myId === searchSeqRef.current)
                                        setSearching(false);
                                }
                            }
                        } }), _jsx("button", { className: "border rounded px-3 py-2", "data-testid": "search-button", "aria-label": "Search", disabled: q.trim().length === 0, onClick: async () => {
                            setSearching(true);
                            if (searchAbortRef.current)
                                searchAbortRef.current.abort();
                            const controller = new AbortController();
                            searchAbortRef.current = controller;
                            const myId = ++searchSeqRef.current;
                            try {
                                const r = await apiFetch(`/search?q=${encodeURIComponent(q)}&limit=10`, { signal: controller.signal });
                                const j = await r.json();
                                if (myId === searchSeqRef.current)
                                    setItems(j.data?.results ?? []);
                            }
                            catch (err) {
                                if (err?.name !== 'AbortError')
                                    setError('Failed to search');
                            }
                            finally {
                                if (myId === searchSeqRef.current)
                                    setSearching(false);
                            }
                        }, children: "Search" })] }), searching ? _jsx("div", { className: "mb-2 text-sm text-gray-500", "aria-live": "polite", children: "Searching\u2026" }) : null, error ? (_jsx("div", { className: "p-4 text-red-600", role: "alert", children: error })) : loading ? (_jsxs("div", { className: "p-4", children: ["Loading\u2026", _jsxs("div", { className: "mt-3 space-y-3 animate-pulse", "aria-hidden": true, children: [_jsx("div", { className: "h-5 bg-gray-200 rounded" }), _jsx("div", { className: "h-5 bg-gray-200 rounded w-5/6" }), _jsx("div", { className: "h-5 bg-gray-200 rounded w-2/3" })] })] })) : (_jsx("div", { children: _jsx("ul", { className: "space-y-3", children: items.length === 0 ? (_jsx("li", { className: "p-4 text-gray-600", "aria-live": "polite", children: "No results." })) : items.map((n) => (_jsxs("li", { className: "p-4 border rounded", children: [_jsx("div", { className: "font-medium", children: n.title }), n.excerpt ? _jsx("div", { className: "text-sm text-gray-600 mt-1", children: n.excerpt }) : null, _jsxs("div", { className: "text-xs text-gray-500 mt-2", children: [n.sourceName ?? 'Unknown source', n.publishedAtSource ? ` • ${new Date(n.publishedAtSource).toLocaleString()}` : ''] }), _jsx("div", { className: "mt-2", children: _jsx("button", { className: "text-sm border rounded px-2 py-1", onClick: () => handleBookmark(n.id), "data-testid": `bm-${n.id}`, "aria-current": bookmarkedIds.has(n.id) ? 'true' : undefined, children: bookmarkedIds.has(n.id) ? 'Bookmarked' : 'Bookmark' }) })] }, n.id))) }) }))] }));
}
