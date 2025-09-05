import { jsx as _jsx } from "react/jsx-runtime";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Feed from './Feed';
import { AuthProvider } from '../contexts/AuthContext';
function renderWithProviders(ui) {
    return render(_jsx(AuthProvider, { children: ui }));
}
describe('Feed search concurrency', () => {
    afterEach(() => vi.restoreAllMocks());
    it('latest search wins while previous is aborted', async () => {
        const slow = new Promise((resolve) => setTimeout(() => resolve({ json: () => Promise.resolve({ data: { results: [{ id: 's1', title: 'SLOW' }] } }) }), 50));
        const fast = Promise.resolve({ json: () => Promise.resolve({ data: { results: [{ id: 's2', title: 'FAST' }] } }) });
        const fetchMock = vi.fn((url) => {
            if (url.startsWith('/search') && url.includes('slow'))
                return slow;
            if (url.startsWith('/search') && url.includes('fast'))
                return fast;
            return Promise.resolve({ json: () => Promise.resolve({ data: { news: [] } }) });
        });
        vi.stubGlobal('fetch', fetchMock);
        renderWithProviders(_jsx(Feed, {}));
        const input = await screen.findByTestId('search-box');
        const button = screen.getByTestId('search-button');
        fireEvent.change(input, { target: { value: 'slow' } });
        fireEvent.click(button);
        fireEvent.change(input, { target: { value: 'fast' } });
        fireEvent.click(button);
        await waitFor(() => expect(screen.getByText('FAST')).toBeInTheDocument());
        expect(screen.queryByText('SLOW')).not.toBeInTheDocument();
    });
});
