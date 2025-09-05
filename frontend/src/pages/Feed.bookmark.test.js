import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Feed from './Feed';
import { AuthProvider } from '../contexts/AuthContext';
describe('Feed bookmarks', () => {
    afterEach(() => vi.restoreAllMocks());
    it('sends Authorization when bookmarking', async () => {
        const list = { data: { news: [{ id: 'n1', title: 'Item 1' }] } };
        const fetchMock = vi.fn((url, opts) => {
            if (url.startsWith('/news?'))
                return Promise.resolve({ json: () => Promise.resolve(list) });
            if (url.includes('/bookmark')) {
                expect(opts?.headers?.get?.('Authorization') || opts?.headers?.Authorization).toBeDefined();
                return Promise.resolve({ ok: true, json: () => Promise.resolve({ success: true, data: { bookmarked: true } }) });
            }
            return Promise.resolve({ json: () => Promise.resolve({}) });
        });
        vi.stubGlobal('fetch', fetchMock);
        vi.spyOn(window.localStorage.__proto__, 'getItem').mockReturnValue('token');
        render(_jsx(AuthProvider, { children: _jsx(Feed, {}) }));
        await screen.findByText('Item 1');
        fireEvent.click(screen.getByTestId('bm-n1'));
        await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    });
});
