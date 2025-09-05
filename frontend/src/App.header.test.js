import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
const mkAuth = (isAuthenticated) => ({
    useAuth: () => ({ isAuthenticated, token: isAuthenticated ? 't' : null, login: () => { }, logout: () => { } }),
    AuthProvider: ({ children }) => children,
});
describe('Header auth', () => {
    afterEach(() => {
        vi.resetModules();
        vi.clearAllMocks();
    });
    it('shows Logout and Bookmarks when authenticated', async () => {
        vi.doMock('./contexts/AuthContext', () => mkAuth(true));
        const AppAuthed = (await import('./App')).default;
        render(_jsx(AppAuthed, {}));
        expect(await screen.findByLabelText('logout')).toBeInTheDocument();
        expect(screen.getByText('Bookmarks')).toBeInTheDocument();
        expect(screen.queryByText('Login')).not.toBeInTheDocument();
    });
    it('shows Login and hides Bookmarks when unauthenticated', async () => {
        vi.doMock('./contexts/AuthContext', () => mkAuth(false));
        const AppAnon = (await import('./App')).default;
        render(_jsx(AppAnon, {}));
        expect(await screen.findByText('Login')).toBeInTheDocument();
        expect(screen.queryByLabelText('logout')).not.toBeInTheDocument();
        expect(screen.queryByText('Bookmarks')).not.toBeInTheDocument();
    });
});
