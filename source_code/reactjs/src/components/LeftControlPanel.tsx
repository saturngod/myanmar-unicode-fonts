import React, { useContext } from 'react';
import { FontContext } from '../Context/mmfontContext';

interface LeftControlPanelProps {
    isCollapsed: boolean;
    onToggleCollapse: () => void;
}

export const LeftControlPanel: React.FC<LeftControlPanelProps> = ({
    isCollapsed,
    onToggleCollapse
}) => {
    const {
        fontSize,
        changeFontSize,
        lineHeight,
        changeLineHeight,
        previewText,
        changePreviewText,
        grid,
        toggleGrid
    } = useContext(FontContext) || {};

    return (
        <div className={`left-control-panel ${isCollapsed ? 'collapsed' : ''}`}>
            {/* Collapse Toggle Button at Top */}
            <div className="panel-header">
                <button
                    onClick={onToggleCollapse}
                    className="collapse-toggle-btn"
                    title={isCollapsed ? 'Expand Panel' : 'Collapse Panel'}
                    aria-label={isCollapsed ? 'Expand control panel' : 'Collapse control panel'}
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className={`collapse-icon ${isCollapsed ? 'collapsed' : ''}`}
                    >
                        <polyline points="15,18 9,12 15,6"></polyline>
                    </svg>
                </button>
                <h2 className={`panel-title ${isCollapsed ? 'collapsed' : ''}`}>Myanmar Fonts</h2>
            </div>

            {/* Panel Content - Hidden when collapsed */}
            {!isCollapsed && (
                <div className="panel-content">
                    {/* Preview Text */}
                    <div className="control-section">
                        <div className="flex justify-between items-center mb-2">
                            <label htmlFor="previewText" className="control-label">
                                Preview Text
                            </label>
                            {/* View Mode Toggle - Icon Only */}
                            <div className="flex rounded-md border border-gray-300 overflow-hidden hidden sm:flex">
                                <button
                                    onClick={() => toggleGrid?.(false)}
                                    className={`flex items-center justify-center p-2 ${
                                        !grid 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                    title="List View"
                                    aria-label="List view"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <line x1="8" y1="6" x2="21" y2="6" />
                                        <line x1="8" y1="12" x2="21" y2="12" />
                                        <line x1="8" y1="18" x2="21" y2="18" />
                                        <line x1="3" y1="6" x2="3.01" y2="6" />
                                        <line x1="3" y1="12" x2="3.01" y2="12" />
                                        <line x1="3" y1="18" x2="3.01" y2="18" />
                                    </svg>
                                </button>
                                <button
                                    onClick={() => toggleGrid?.(true)}
                                    className={`flex items-center justify-center p-2 ${
                                        grid 
                                            ? 'bg-blue-500 text-white' 
                                            : 'bg-white text-gray-700 hover:bg-gray-50'
                                    }`}
                                    title="Grid View"
                                    aria-label="Grid view"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <rect x="3" y="3" width="7" height="7" />
                                        <rect x="14" y="3" width="7" height="7" />
                                        <rect x="14" y="14" width="7" height="7" />
                                        <rect x="3" y="14" width="7" height="7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <textarea
                            id="previewText"
                            rows={10}
                            name="previewText"
                            className="input-base w-full resize-none"
                            placeholder="မြန်မာ ဖောင့် ပြသခြင်း - Type your Myanmar text here to preview fonts..."
                            value={previewText}
                            onChange={e => changePreviewText?.(e.target.value)}
                        />
                    </div>

                    {/* Font Size Control */}
                    <div className="control-section">
                        <div className="control-group">
                            <label htmlFor="fontSize" className="control-label">
                                Font Size: {fontSize}px
                            </label>
                            <input
                                type="range"
                                min="10"
                                max="32"
                                value={fontSize}
                                id="fontSize"
                                className="slider-modern"
                                onChange={e => changeFontSize?.(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    {/* Line Height Control */}
                    <div className="control-section">
                        <div className="control-group">
                            <label htmlFor="lineHeight" className="control-label">
                                Line Height: {lineHeight}
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="3"
                                value={lineHeight}
                                id="lineHeight"
                                step={0.1}
                                className="slider-modern"
                                onChange={e => changeLineHeight?.(Number(e.target.value))}
                            />
                        </div>
                    </div>

                    
                </div>
            )}
        </div>
    );
};