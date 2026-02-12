import React from 'react';
import { render, screen } from '@testing-library/react';
import { RightPreviewPanel } from '../RightPreviewPanel';
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

// Mock the font components to avoid complex dependencies
jest.mock('../khmerfont', () => ({
    KhmerFont: () => <div data-testid="khmer-font">KhmerFont</div>
}));

jest.mock('../masterpieceFont', () => ({
    MasterPieceFont: () => <div data-testid="masterpiece-font">MasterPieceFont</div>
}));

jest.mock('../unknownFont', () => ({
    UnknwonFont: () => <div data-testid="unknown-font">UnknownFont</div>
}));

jest.mock('../otherFont', () => ({
    OtherFont: () => <div data-testid="other-font">OtherFont</div>
}));

jest.mock('../phoenixDigitalArt', () => ({
    PhoenixDigitalArtFont: () => <div data-testid="phoenix-font">PhoenixDigitalArtFont</div>
}));

jest.mock('../SearchBox', () => ({
    SearchBox: () => <div data-testid="search-box">SearchBox</div>
}));

describe('RightPreviewPanel', () => {
    test('renders search box', () => {
        renderWithContext(<RightPreviewPanel isLeftPanelCollapsed={false} />);

        expect(screen.getByTestId('search-box')).toBeInTheDocument();
    });

    test('renders all font category components', () => {
        renderWithContext(<RightPreviewPanel isLeftPanelCollapsed={false} />);

        expect(screen.getByTestId('khmer-font')).toBeInTheDocument();
        expect(screen.getByTestId('masterpiece-font')).toBeInTheDocument();
        expect(screen.getByTestId('phoenix-font')).toBeInTheDocument();
        expect(screen.getByTestId('unknown-font')).toBeInTheDocument();
        expect(screen.getByTestId('other-font')).toBeInTheDocument();
    });

    test('applies expanded class when left panel is collapsed', () => {
        const { container } = renderWithContext(
            <RightPreviewPanel isLeftPanelCollapsed={true} />
        );

        const panel = container.querySelector('.right-preview-panel');
        expect(panel).toHaveClass('expanded');
    });

    test('does not apply expanded class when left panel is not collapsed', () => {
        const { container } = renderWithContext(
            <RightPreviewPanel isLeftPanelCollapsed={false} />
        );

        const panel = container.querySelector('.right-preview-panel');
        expect(panel).not.toHaveClass('expanded');
    });
});
