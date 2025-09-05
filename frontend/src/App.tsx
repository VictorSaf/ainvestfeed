import React from 'react';
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom';
const Feed = React.lazy(() => import('./pages/Feed'));
const Login = React.lazy(() => import('./pages/Login'));
import { AuthProvider, useAuth } from './contexts/AuthContext';
const Bookmarks = React.lazy(() => import('./pages/Bookmarks'));
const ProfilePage = React.lazy(() => import('./pages/Profile'));

function AppShell() {
  const [health, setHealth] = React.useState<string>('checking...');
  React.useEffect(() => {
    fetch('/health')
      .then((r) => r.json())
      .then((j) => setHealth(j.status || 'unknown'))
      .catch(() => setHealth('error'));
  }, []);
  const auth = useAuth();
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <h1 className="text-xl font-semibold">aInvestFeed</h1>
            <nav className="text-sm text-gray-600 flex gap-4">
              <Link to="/">Home</Link>
              <Link to="/feed">Feed</Link>
              {auth.isAuthenticated && <Link to="/bookmarks">Bookmarks</Link>}
              {auth.isAuthenticated && <Link to="/profile">Profile</Link>}
              {!auth.isAuthenticated && <Link to="/login">Login</Link>}
              {auth.isAuthenticated && <button onClick={auth.logout} aria-label="logout">Logout</button>}
              <span>Health: <span data-testid="health">{health}</span></span>
            </nav>
          </div>
        </header>
        <main>
          <React.Suspense fallback={<div className="max-w-2xl mx-auto p-4">Loading…</div>}>
            <Routes>
              <Route path="/" element={<div className="max-w-2xl mx-auto p-4">Welcome</div>} />
              <Route path="/login" element={<Login />} />
              <Route path="/feed" element={<Feed />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Routes>
          </React.Suspense>
        </main>
      </div>
    </BrowserRouter>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}

export default App;


