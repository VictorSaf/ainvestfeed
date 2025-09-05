import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Feed from './Feed';
import { AuthProvider } from '../contexts/AuthContext';
describe('Feed filters', () => {
    afterEach(() => vi.restoreAllMocks());
    it('applies market and limit filters', async () => {
        const list = { data: { news: [{ id: 'n1', title: 'Item 1' }] } };
        const listStocks = { data: { news: [{ id: 'n2', title: 'Stock item' }] } };
        const fetchMock = vi.fn((url) => {
            if (url.startsWith('/news?limit=10'))
                return Promise.resolve({ json: () => Promise.resolve(list) });
            if (url.startsWith('/news?limit=20&market=stocks'))
                return Promise.resolve({ json: () => Promise.resolve(listStocks) });
            return Promise.resolve({ json: () => Promise.resolve({}) });
        });
        vi.stubGlobal('fetch', fetchMock);
        render(_jsx(AuthProvider, { children: _jsx(Feed, {}) }));
        await screen.findByText('Item 1');
        fireEvent.change(screen.getByTestId('market'), { target: { value: 'stocks' } });
        fireEvent.change(screen.getByTestId('limit'), { target: { value: '20' } });
        fireEvent.click(screen.getByTestId('apply-filters'));
        await waitFor(() => expect(screen.getByText('Stock item')).toBeInTheDocument());
    });
});
