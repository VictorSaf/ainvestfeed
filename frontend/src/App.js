import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
const Feed = React.lazy(() => import('./pages/Feed'));
const Login = React.lazy(() => import('./pages/Login'));
import { AuthProvider, useAuth } from './contexts/AuthContext';
const Bookmarks = React.lazy(() => import('./pages/Bookmarks'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));
function AppShell() {
    const [health, setHealth] = React.useState('checking...');
    React.useEffect(() => {
        fetch('/health')
            .then((r) => r.json())
            .then((j) => setHealth(j.status || 'unknown'))
            .catch(() => setHealth('error'));
    }, []);
    const auth = useAuth();
    return (_jsx(BrowserRouter, { children: _jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx("header", { className: "bg-white border-b", children: _jsxs("div", { className: "max-w-5xl mx-auto px-4 py-3 flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-semibold", children: "aInvestFeed" }), _jsxs("nav", { className: "text-sm text-gray-600 flex gap-4", children: [_jsx(Link, { to: "/", children: "Home" }), _jsx(Link, { to: "/feed", children: "Feed" }), auth.isAuthenticated && _jsx(Link, { to: "/bookmarks", children: "Bookmarks" }), auth.isAuthenticated && _jsx(Link, { to: "/profile", children: "Profile" }), !auth.isAuthenticated && _jsx(Link, { to: "/login", children: "Login" }), auth.isAuthenticated && _jsx("button", { onClick: auth.logout, "aria-label": "logout", children: "Logout" }), _jsxs("span", { children: ["Health: ", _jsx("span", { "data-testid": "health", children: health })] })] })] }) }), _jsx("main", { children: _jsx(React.Suspense, { fallback: _jsx("div", { className: "max-w-2xl mx-auto p-4", children: "Loading\u2026" }), children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx("div", { className: "max-w-2xl mx-auto p-4", children: "Welcome" }) }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/feed", element: _jsx(Feed, {}) }), _jsx(Route, { path: "/bookmarks", element: _jsx(Bookmarks, {}) }), _jsx(Route, { path: "/profile", element: _jsx(ProfilePage, {}) })] }) }) })] }) }));
}
export function App() {
    return (_jsx(AuthProvider, { children: _jsx(AppShell, {}) }));
}
export default App;
