import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';
import { FontProvider } from '../Context/mmfontContext';

// Mock localStorage
const localStorageMock = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
});

// Mock font components to avoid complex dependencies
jest.mock('../components/khmerfont', () => ({
    KhmerFont: () => <div data-testid="khmer-font">KhmerFont Component</div>
}));

jest.mock('../components/masterpieceFont', () => ({
    MasterPieceFont: () => <div data-testid="masterpiece-font">MasterPieceFont Component</div>
}));

jest.mock('../components/phoenixDigitalArt', () => ({
    PhoenixDigitalArtFont: () => <div data-testid="phoenix-font">PhoenixDigitalArtFont Component</div>
}));

jest.mock('../components/unknownFont', () => ({
    UnknwonFont: () => <div data-testid="unknown-font">UnknownFont Component</div>
}));

jest.mock('../components/otherFont', () => ({
    OtherFont: () => <div data-testid="other-font">OtherFont Component</div>
}));

const renderApp = () => {
    return render(
        <FontProvider>
            <App />
        </FontProvider>
    );
};

describe('App Integration Tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
    });

    test('renders two-panel layout correctly', () => {
        renderApp();



        // Check left panel
        expect(screen.getByRole('button', { name: /collapse control panel/i })).toBeInTheDocument();
        expect(screen.getByText('Myanmar Fonts')).toBeInTheDocument();

        // Check right panel with search and font components
        expect(screen.getByRole('textbox', { name: /search fonts/i })).toBeInTheDocument();
        expect(screen.getByTestId('khmer-font')).toBeInTheDocument();
        expect(screen.getByTestId('masterpiece-font')).toBeInTheDocument();
        expect(screen.getByTestId('phoenix-font')).toBeInTheDocument();
        expect(screen.getByTestId('unknown-font')).toBeInTheDocument();
        expect(screen.getByTestId('other-font')).toBeInTheDocument();
    });

    test('panel collapse/expand functionality works', async () => {
        renderApp();

        const collapseButton = screen.getByRole('button', { name: /collapse control panel/i });

        // Initially expanded - should show controls
        expect(screen.getByText('Myanmar Fonts')).toBeInTheDocument();
        expect(screen.getByLabelText('Preview Text')).toBeInTheDocument();

        // Collapse panel
        fireEvent.click(collapseButton);

        await waitFor(() => {
            expect(screen.getByText('Myanmar Fonts')).toBeInTheDocument();
            expect(screen.queryByLabelText('Preview Text')).not.toBeInTheDocument();
        });

        // Expand panel again
        fireEvent.click(collapseButton);

        await waitFor(() => {
            expect(screen.getByText('Myanmar Fonts')).toBeInTheDocument();
            expect(screen.getByLabelText('Preview Text')).toBeInTheDocument();
        });
    });

    test('search functionality integration', async () => {
        renderApp();

        const searchInput = screen.getByRole('textbox', { name: /search fonts/i });

        // Type in search box
        fireEvent.change(searchInput, { target: { value: 'Myanmar' } });

        // Should show search results info
        await waitFor(() => {
            expect(screen.getByText('Searching for: "Myanmar"')).toBeInTheDocument();
        });

        // Clear search
        const clearButton = screen.getByText('Clear');
        fireEvent.click(clearButton);

        await waitFor(() => {
            expect(searchInput).toHaveValue('');
            expect(screen.queryByText('Searching for:')).not.toBeInTheDocument();
        });
    });

    test('font controls integration', async () => {
        renderApp();

        // Test font size control
        const fontSizeSlider = screen.getByLabelText(/Font Size/);
        fireEvent.change(fontSizeSlider, { target: { value: '20' } });

        await waitFor(() => {
            expect(screen.getByText(/Font Size: 20px/)).toBeInTheDocument();
        });

        // Test line height control
        const lineHeightSlider = screen.getByLabelText(/Line Height/);
        fireEvent.change(lineHeightSlider, { target: { value: '2' } });

        await waitFor(() => {
            expect(screen.getByText(/Line Height: 2/)).toBeInTheDocument();
        });

        // Test grid toggle
        const gridToggle = screen.getByRole('button', { name: /grid view/i });
        fireEvent.click(gridToggle);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /list view/i })).toBeInTheDocument();
        });
    });

    test('localStorage persistence integration', () => {
        renderApp();

        // Change font size
        const fontSizeSlider = screen.getByLabelText(/Font Size/);
        fireEvent.change(fontSizeSlider, { target: { value: '18' } });

        // Verify localStorage was called
        expect(localStorageMock.setItem).toHaveBeenCalledWith('fontSize', '18');

        // Collapse panel
        const collapseButton = screen.getByRole('button', { name: /collapse control panel/i });
        fireEvent.click(collapseButton);

        // Verify panel state was saved
        expect(localStorageMock.setItem).toHaveBeenCalledWith('leftPanelCollapsed', 'true');
    });

    test('keyboard navigation works', () => {
        renderApp();

        const searchInput = screen.getByRole('textbox', { name: /search fonts/i });

        // Type search term
        fireEvent.change(searchInput, { target: { value: 'test' } });

        // Press Escape to clear
        fireEvent.keyDown(searchInput, { key: 'Escape' });

        expect(searchInput).toHaveValue('');
    });

    test('responsive layout classes are applied', () => {
        const { container } = renderApp();

        // Check main layout classes
        expect(container.querySelector('.app-container')).toBeInTheDocument();
        expect(container.querySelector('.two-panel-layout')).toBeInTheDocument();
        expect(container.querySelector('.left-control-panel')).toBeInTheDocument();
        expect(container.querySelector('.right-preview-panel')).toBeInTheDocument();
    });
});
