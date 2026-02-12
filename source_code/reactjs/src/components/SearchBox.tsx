import React, { useContext, useCallback } from 'react';
import { FontContext } from '../Context/mmfontContext';

interface SearchBoxProps {
    placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
    placeholder = 'Search fonts by name (e.g., "Angoun", "Chatu", "Phiksel")...'
}) => {
    const { searchTerm, changeSearchTerm } = useContext(FontContext) || {};

    const handleClear = useCallback(() => {
        changeSearchTerm?.('');
    }, [changeSearchTerm]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            handleClear();
        }
    }, [handleClear]);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        changeSearchTerm?.(e.target.value);
    }, [changeSearchTerm]);

    return (
        <div className="search-box-container">
            <div className="search-input-wrapper">
                <div className="search-icon">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </div>

                <input
                    type="text"
                    name="fontSearch"
                    className="search-input"
                    placeholder={placeholder}
                    value={searchTerm || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    aria-label="Search fonts"
                />

                {searchTerm && (
                    <button
                        onClick={handleClear}
                        className="clear-search-btn"
                        title="Clear search"
                        aria-label="Clear search"
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                )}
            </div>

            {searchTerm && (
                <div className="search-results-info">
                    <span className="search-term">Searching for: "{searchTerm}"</span>
                    <button
                        onClick={handleClear}
                        className="clear-link"
                    >
                        Clear
                    </button>
                </div>
            )}
        </div>
    );
};
