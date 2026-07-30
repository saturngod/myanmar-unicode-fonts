import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../App';

const localStorageMock = {
    getItem: jest.fn().mockReturnValue(null),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

const renderApp = () => {
    return render(<App />);
};

describe('App Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });

    test('renders header with title', () => {
        renderApp();
        expect(screen.getByText('Myanmar Fonts')).toBeInTheDocument();
    });

    test('renders style category list in sidebar', () => {
        renderApp();
        // Query by button role — these labels also appear in the main title bar.
        expect(screen.getByRole('button', { name: /All Fonts/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Sans-Serif \/ Clean UI/ })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Display \/ Decorative/ })).toBeInTheDocument();
    });

    test('renders font preview controls', () => {
        renderApp();
        expect(screen.getByText('Preview Text')).toBeInTheDocument();
        expect(screen.getByText('Font Size')).toBeInTheDocument();
        expect(screen.getByText('Line Height')).toBeInTheDocument();
        expect(screen.getByText('View Mode')).toBeInTheDocument();
    });

    test('category filter works', () => {
        renderApp();
        const category = screen.getByRole('button', { name: /Handwritten \/ Script/ });
        fireEvent.click(category);
        // Selecting a style updates the main content title bar — proves the filter applied.
        expect(
            screen.getByRole('heading', { name: /Handwritten \/ Script/ }),
        ).toBeInTheDocument();
    });

    test('search functionality works', () => {
        renderApp();
        const searchInputs = screen.getAllByPlaceholderText('Search fonts...');
        const searchInput = searchInputs[0];
        fireEvent.change(searchInput, { target: { value: 'Myanmar' } });
        expect(searchInput).toHaveValue('Myanmar');
    });

    test('a multi-weight family shows one card with a weight selector', () => {
        renderApp();
        // Padauk ships 5 weights (400-800) as a single family.
        expect(screen.getByText('Padauk', { exact: true })).toBeInTheDocument();

        const regular = screen.getByRole('button', { name: 'Padauk Regular 400' });
        const bold = screen.getByRole('button', { name: 'Padauk Bold 700' });

        // Default is the upright weight nearest 400.
        expect(regular).toHaveAttribute('aria-pressed', 'true');
        expect(bold).toHaveAttribute('aria-pressed', 'false');

        fireEvent.click(bold);
        expect(bold).toHaveAttribute('aria-pressed', 'true');
        expect(regular).toHaveAttribute('aria-pressed', 'false');
    });

    test('the preview renders at the selected weight', () => {
        const { container } = renderApp();
        const previewOf = (weight: number) =>
            container.querySelector<HTMLElement>(
                `[style*="MMFont-Padauk"][style*="font-weight: ${weight}"]`,
            );

        expect(previewOf(400)).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button', { name: 'Padauk ExtraBold 800' }));
        expect(previewOf(800)).toBeInTheDocument();
    });
});
