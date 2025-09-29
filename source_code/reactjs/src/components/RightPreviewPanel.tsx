import React from 'react';
import { KhmerFont } from './khmerfont';
import { MasterPieceFont } from './masterpieceFont';
import { UnknwonFont } from './unknownFont';
import { OtherFont } from './otherFont';
import { PhoenixDigitalArtFont } from './phoenixDigitalArt';
import { SearchBox } from './SearchBox';

interface RightPreviewPanelProps {
    isLeftPanelCollapsed: boolean;
}

export const RightPreviewPanel: React.FC<RightPreviewPanelProps> = ({
    isLeftPanelCollapsed
}) => {
    return (
        <div className={`right-preview-panel ${isLeftPanelCollapsed ? 'expanded' : ''}`}>
            {/* Search Box at Top */}
            <div className="search-section">
                <SearchBox />
            </div>

            {/* Font Preview Sections */}
            <div className="font-preview-sections">
                <KhmerFont />
                <MasterPieceFont />
                <PhoenixDigitalArtFont />
                <UnknwonFont />
                <OtherFont />
            </div>
        </div>
    );
};