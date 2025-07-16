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
                {!isCollapsed && (
                    <h2 className="panel-title">Myanmar Fonts</h2>
                )}
            </div>

            {/* Panel Content - Hidden when collapsed */}
            {!isCollapsed && (
                <div className="panel-content">
                    {/* Preview Text */}
                    <div className="control-section">
                        <label htmlFor="previewText" className="control-label">
                            Preview Text
                        </label>
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

                    {/* Grid Toggle */}
                    <div className="control-section">
                        <div className="control-group">
                            <label className="control-label">Display Mode</label>
                            <button
                                onClick={() => toggleGrid?.(!grid)}
                                className={`grid-toggle-btn ${grid ? 'active' : ''}`}
                                title={grid ? 'Switch to List View' : 'Switch to Grid View'}
                                aria-label={grid ? 'Switch to list view' : 'Switch to grid view'}
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="3" width="7" height="7" />
                                    <rect x="14" y="3" width="7" height="7" />
                                    <rect x="14" y="14" width="7" height="7" />
                                    <rect x="3" y="14" width="7" height="7" />
                                </svg>
                                <span className="toggle-label">
                                    {grid ? 'Grid View' : 'List View'}
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};