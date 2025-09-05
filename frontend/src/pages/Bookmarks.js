import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { apiFetch } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
export default function Bookmarks() {
    const [items, setItems] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const auth = useAuth();
    React.useEffect(() => {
        (async () => {
            if (!auth.isAuthenticated) {
                setLoading(false);
                return;
            }
            const r = await apiFetch('/user/bookmarks');
            const j = await r.json();
            setItems(j.data?.bookmarks ?? []);
            setLoading(false);
        })();
    }, [auth.isAuthenticated]);
    if (!auth.isAuthenticated)
        return _jsx("div", { className: "max-w-2xl mx-auto p-4", role: "alert", children: "Please login to view bookmarks." });
    if (loading)
        return (_jsxs("div", { className: "max-w-2xl mx-auto p-4", children: ["Loading\u2026", _jsxs("div", { className: "mt-3 space-y-3 animate-pulse", "aria-hidden": true, children: [_jsx("div", { className: "h-5 bg-gray-200 rounded" }), _jsx("div", { className: "h-5 bg-gray-200 rounded w-5/6" }), _jsx("div", { className: "h-5 bg-gray-200 rounded w-2/3" })] })] }));
    return (_jsxs("div", { className: "max-w-2xl mx-auto p-4", children: [_jsx("h2", { className: "text-xl font-semibold mb-4", children: "My Bookmarks" }), items.length === 0 ? (_jsx("div", { className: "text-gray-600", children: "No bookmarks yet." })) : (_jsx("ul", { className: "space-y-3", children: items.map((b) => (_jsxs("li", { className: "p-4 border rounded", children: [_jsx("div", { className: "font-medium", children: b.news.title }), b.news.excerpt ? _jsx("div", { className: "text-sm text-gray-600 mt-1", children: b.news.excerpt }) : null] }, b.id))) }))] }));
}
