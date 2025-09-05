import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Login from './Login';
describe('Login', () => {
    afterEach(() => { vi.restoreAllMocks(); });
    it('stores access token on success', async () => {
        const tokens = { accessToken: 'abc', refreshToken: 'def' };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ data: { tokens } }) }));
        const setItem = vi.spyOn(window.localStorage.__proto__, 'setItem');
        render(_jsx(Login, {}));
        fireEvent.change(screen.getByTestId('email'), { target: { value: 'x@example.com' } });
        fireEvent.change(screen.getByTestId('password'), { target: { value: 'Password123!' } });
        fireEvent.click(screen.getByTestId('login-btn'));
        await waitFor(() => expect(setItem).toHaveBeenCalled());
    });
    it('shows error on failure', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: () => Promise.resolve({ error: { message: 'Bad creds' } }) }));
        render(_jsx(Login, {}));
        fireEvent.change(screen.getByTestId('email'), { target: { value: 'x@example.com' } });
        fireEvent.change(screen.getByTestId('password'), { target: { value: 'wrong' } });
        fireEvent.click(screen.getByTestId('login-btn'));
        await waitFor(() => expect(screen.getByTestId('login-error')).toHaveTextContent('Bad creds'));
    });
});
