import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBox } from '../SearchBox';
import { FontContext } from '../../Context/mmfontContext';

const mockFontContext = {
    fontSize: 16,
    lineHeight: 1.5,
    previewText: 'Test text',
    grid: false,
    searchTerm: '',
    leftPanelCollapsed: false,
    changeFontSize: jest.fn(),
    changeLineHeight: jest.fn(),
    changePreviewText: jest.fn(),
    toggleGrid: jest.fn(),
    changeSearchTerm: jest.fn(),
    toggleLeftPanel: jest.fn(),
};

const renderWithContext = (component: React.ReactElement, contextValue = mockFontContext) => {
    return render(
        <FontContext.Provider value={contextValue}>
            {component}
        </FontContext.Provider>
    );
};

describe('SearchBox', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders search input with default placeholder', () => {
        renderWithContext(<SearchBox />);

        const searchInput = screen.getByRole('textbox', { name: /search fonts/i });
        expect(searchInput).toBeInTheDocument();
        expect(searchInput).toHaveAttribute('placeholder', expect.stringContaining('Search fonts by name'));
    });

    test('renders search input with custom placeholder', () => {
        const customPlaceholder = 'Custom search placeholder';
        renderWithContext(<SearchBox placeholder={customPlaceholder} />);

        const searchInput = screen.getByRole('textbox', { name: /search fonts/i });
        expect(searchInput).toHaveAttribute('placeholder', customPlaceholder);
    });

    test('displays current search term', () => {
        const contextWithSearchTerm = {
            ...mockFontContext,
            searchTerm: 'Angoun'
        };

        renderWithContext(<SearchBox />, contextWithSearchTerm);

        const searchInput = screen.getByRole('textbox', { name: /search fonts/i });
        expect(searchInput).toHaveValue('Angoun');
    });

    test('calls changeSearchTerm when input changes', () => {
        renderWithContext(<SearchBox />);

        const searchInput = screen.getByRole('textbox', { name: /search fonts/i });
        fireEvent.change(searchInput, { target: { value: 'Myanmar' } });

        expect(mockFontContext.changeSearchTerm).toHaveBeenCalledWith('Myanmar');
    });

    test('shows clear button when search term exists', () => {
        const contextWithSearchTerm = {
            ...mockFontContext,
            searchTerm: 'Angoun'
        };

        renderWithContext(<SearchBox />, contextWithSearchTerm);

        const clearButton = screen.getByRole('button', { name: /clear search/i });
        expect(clearButton).toBeInTheDocument();
    });

    test('hides clear button when search term is empty', () => {
        renderWithContext(<SearchBox />);

        const clearButton = screen.queryByRole('button', { name: /clear search/i });
        expect(clearButton).not.toBeInTheDocument();
    });

    test('clears search when clear button is clicked', () => {
        const contextWithSearchTerm = {
            ...mockFontContext,
            searchTerm: 'Angoun'
        };

        renderWithContext(<SearchBox />, contextWithSearchTerm);

        const clearButton = screen.getByRole('button', { name: /clear search/i });
        fireEvent.click(clearButton);

        expect(mockFontContext.changeSearchTerm).toHaveBeenCalledWith('');
    });

    test('clears search when Escape key is pressed', () => {
        const contextWithSearchTerm = {
            ...mockFontContext,
            searchTerm: 'Angoun'
        };

        renderWithContext(<SearchBox />, contextWithSearchTerm);

        const searchInput = screen.getByRole('textbox', { name: /search fonts/i });
        fireEvent.keyDown(searchInput, { key: 'Escape' });

        expect(mockFontContext.changeSearchTerm).toHaveBeenCalledWith('');
    });

    test('shows search results info when search term exists', () => {
        const contextWithSearchTerm = {
            ...mockFontContext,
            searchTerm: 'Angoun'
        };

        renderWithContext(<SearchBox />, contextWithSearchTerm);

        expect(screen.getByText('Searching for: "Angoun"')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
    });
});