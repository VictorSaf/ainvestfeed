import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Profile from './Profile';
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({ isAuthenticated: true, token: 't', login: () => { }, logout: () => { } }),
    AuthProvider: ({ children }) => children,
}));
describe('Profile page', () => {
    afterEach(() => vi.restoreAllMocks());
    it('loads and saves profile', async () => {
        const fetchMock = vi.fn((url, opts) => {
            if (url === '/user/profile' && (!opts || !opts.method))
                return Promise.resolve({ json: () => Promise.resolve({ data: { email: 'u@example.com', firstName: 'John', lastName: 'Doe', language: 'en', timezone: 'UTC' } }) });
            if (url === '/user/profile' && opts?.method === 'PUT')
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true }) });
            return Promise.resolve({ json: () => Promise.resolve({}) });
        });
        vi.stubGlobal('fetch', fetchMock);
        render(_jsx(Profile, {}));
        await screen.findByDisplayValue('u@example.com');
        fireEvent.change(screen.getByTestId('firstName'), { target: { value: 'Jane' } });
        fireEvent.click(screen.getByTestId('save'));
        await waitFor(() => expect(screen.getByTestId('saved')).toBeInTheDocument());
    });
});
