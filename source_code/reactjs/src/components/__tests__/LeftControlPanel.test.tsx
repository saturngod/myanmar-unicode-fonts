import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { LeftControlPanel } from '../LeftControlPanel';
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

const renderWithContext = (component: React.ReactElement) => {
    return render(
        <FontContext.Provider value={mockFontContext}>
            {component}
        </FontContext.Provider>
    );
};

describe('LeftControlPanel', () => {
    const mockToggleCollapse = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders collapse toggle button', () => {
        renderWithContext(
            <LeftControlPanel isCollapsed={false} onToggleCollapse={mockToggleCollapse} />
        );

        const toggleButton = screen.getByRole('button', { name: /collapse control panel/i });
        expect(toggleButton).toBeInTheDocument();
    });

    test('calls onToggleCollapse when toggle button is clicked', () => {
        renderWithContext(
            <LeftControlPanel isCollapsed={false} onToggleCollapse={mockToggleCollapse} />
        );

        const toggleButton = screen.getByRole('button', { name: /collapse control panel/i });
        fireEvent.click(toggleButton);

        expect(mockToggleCollapse).toHaveBeenCalledTimes(1);
    });

    test('hides panel content when collapsed', () => {
        renderWithContext(
            <LeftControlPanel isCollapsed={true} onToggleCollapse={mockToggleCollapse} />
        );

        expect(screen.queryByText('Myanmar Fonts')).not.toBeInTheDocument();
        expect(screen.queryByLabelText('Preview Text')).not.toBeInTheDocument();
    });

    test('shows panel content when expanded', () => {
        renderWithContext(
            <LeftControlPanel isCollapsed={false} onToggleCollapse={mockToggleCollapse} />
        );

        expect(screen.getByText('Myanmar Fonts')).toBeInTheDocument();
        expect(screen.getByLabelText('Preview Text')).toBeInTheDocument();
        expect(screen.getByLabelText(/Font Size/)).toBeInTheDocument();
        expect(screen.getByLabelText(/Line Height/)).toBeInTheDocument();
    });

    test('calls changeFontSize when font size slider changes', () => {
        renderWithContext(
            <LeftControlPanel isCollapsed={false} onToggleCollapse={mockToggleCollapse} />
        );

        const fontSizeSlider = screen.getByLabelText(/Font Size/);
        fireEvent.change(fontSizeSlider, { target: { value: '20' } });

        expect(mockFontContext.changeFontSize).toHaveBeenCalledWith(20);
    });

    test('calls toggleGrid when grid toggle button is clicked', () => {
        renderWithContext(
            <LeftControlPanel isCollapsed={false} onToggleCollapse={mockToggleCollapse} />
        );

        const gridToggleButton = screen.getByRole('button', { name: /switch to grid view/i });
        fireEvent.click(gridToggleButton);

        expect(mockFontContext.toggleGrid).toHaveBeenCalledWith(true);
    });
});