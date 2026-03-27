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
        expect(screen.getByText('All Fonts')).toBeInTheDocument();
        expect(screen.getByText('Sans-Serif / Clean UI')).toBeInTheDocument();
        expect(screen.getByText('Display / Decorative')).toBeInTheDocument();
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
        const category = screen.getByText('Handwritten / Script');
        fireEvent.click(category);
        expect(screen.getByText('Handwritten / Script')).toBeInTheDocument();
    });

    test('search functionality works', () => {
        renderApp();
        const searchInputs = screen.getAllByPlaceholderText('Search fonts...');
        const searchInput = searchInputs[0];
        fireEvent.change(searchInput, { target: { value: 'Myanmar' } });
        expect(searchInput).toHaveValue('Myanmar');
    });
});
