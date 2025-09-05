import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Feed from './Feed';
import { AuthProvider } from '../contexts/AuthContext';
function renderWithProviders(ui) {
    return render(_jsx(AuthProvider, { children: ui }));
}
describe('Feed page', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });
    it('renders news items from API', async () => {
        const fake = {
            data: {
                news: [
                    { id: '1', title: 'First item', excerpt: 'Ex1', sourceName: 'Src1', publishedAtSource: new Date().toISOString() },
                    { id: '2', title: 'Second item', excerpt: 'Ex2', sourceName: 'Src2', publishedAtSource: new Date().toISOString() }
                ]
            }
        };
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ json: () => Promise.resolve(fake) }));
        renderWithProviders(_jsx(Feed, {}));
        await waitFor(() => {
            expect(screen.getByText('First item')).toBeInTheDocument();
            expect(screen.getByText('Second item')).toBeInTheDocument();
        });
    });
    it('searches via /search and renders results', async () => {
        const fakeSearch = { data: { results: [{ id: 's1', title: 'Apple beats earnings' }] } };
        const fakeList = { data: { news: [] } };
        const fetchMock = vi.fn((url) => {
            if (url.startsWith('/search'))
                return Promise.resolve({ json: () => Promise.resolve(fakeSearch) });
            return Promise.resolve({ json: () => Promise.resolve(fakeList) });
        });
        vi.stubGlobal('fetch', fetchMock);
        renderWithProviders(_jsx(Feed, {}));
        const searchBtn = await screen.findByTestId('search-button');
        const input = screen.getByTestId('search-box');
        fireEvent.change(input, { target: { value: 'apple' } });
        fireEvent.click(searchBtn);
        await waitFor(() => {
            expect(screen.getByText('Apple beats earnings')).toBeInTheDocument();
        });
    });
});
