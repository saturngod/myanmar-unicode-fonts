import React, { useContext } from 'react';
import { FontContext } from '../Context/mmfontContext';
import { fontStyleCategories } from '../data/styleCategories';
import { allFonts, fontCatalog } from '../data/fontCatalog';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const {
    fontSize,
    changeFontSize,
    lineHeight,
    changeLineHeight,
    previewText,
    changePreviewText,
    grid,
    toggleGrid,
    selectedStyleCategory,
    changeSelectedStyleCategory,
    selectedAuthorCategory,
    changeSelectedAuthorCategory,
    changeSearchTerm,
  } = useContext(FontContext) || {};

  const totalFontCount = allFonts.length;

  const getCategoryCount = (categoryFonts: string[]) => {
    const normalized = new Set(allFonts.map(f => f.displayName.replace(/\s+/g, '')));
    return categoryFonts.filter(f => normalized.has(f.replace(/\s+/g, ''))).length;
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-80 bg-white border-r border-gray-200 z-50
          transform transition-transform duration-300 ease-in-out
          lg:sticky lg:top-[57px] lg:h-[calc(100vh-57px)] lg:translate-x-0 lg:z-0 lg:w-72 lg:shrink-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-thin">
          {/* Mobile header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
            <span className="font-semibold text-gray-900">Settings</span>
            <button
              onClick={onClose}
              className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-4 space-y-5">
            {/* Preview Text */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Preview Text
              </label>
              <textarea
                rows={5}
                value={previewText || ''}
                onChange={e => changePreviewText?.(e.target.value)}
                placeholder="Type Myanmar text to preview..."
                className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent resize-none transition-all"
              />
            </div>

            {/* Font Size Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Font Size
                </label>
                <span className="text-sm font-mono font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">
                  {fontSize}px
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="32"
                value={fontSize}
                onChange={e => changeFontSize?.(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">10px</span>
                <span className="text-xs text-gray-400">32px</span>
              </div>
            </div>

            {/* Line Height Slider */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Line Height
                </label>
                <span className="text-sm font-mono font-bold text-black bg-gray-100 px-2 py-0.5 rounded-md">
                  {lineHeight}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step={0.1}
                value={lineHeight}
                onChange={e => changeLineHeight?.(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-black"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-gray-400">1</span>
                <span className="text-xs text-gray-400">3</span>
              </div>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                View Mode
              </label>
              <div className="flex rounded-xl border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleGrid?.(false)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    !grid
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  List
                </button>
                <button
                  onClick={() => toggleGrid?.(true)}
                  className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                    grid
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  Grid
                </button>
              </div>
            </div>

            {/* Author Categories */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Author
              </label>
              <nav className="space-y-1">
                <CategoryItem
                  label="All Authors"
                  count={totalFontCount}
                  active={selectedAuthorCategory === 'all' || !selectedAuthorCategory}
                  onClick={() => {
                    changeSelectedAuthorCategory?.('all');
                    changeSearchTerm?.('');
                  }}
                />
                {fontCatalog.map(cat => (
                  <CategoryItem
                    key={cat.key}
                    label={cat.title}
                    count={cat.fonts.length}
                    active={selectedAuthorCategory === cat.key}
                    onClick={() => {
                      changeSelectedAuthorCategory?.(cat.key);
                      changeSearchTerm?.('');
                    }}
                  />
                ))}
              </nav>
            </div>

            {/* Style Categories */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Style Category
              </label>
              <nav className="space-y-1">
                <CategoryItem
                  label="All Fonts"
                  count={totalFontCount}
                  active={selectedStyleCategory === 'all'}
                  onClick={() => {
                    changeSelectedStyleCategory?.('all');
                    changeSearchTerm?.('');
                  }}
                />
                {fontStyleCategories.map(cat => (
                  <CategoryItem
                    key={cat.name}
                    label={cat.name}
                    count={getCategoryCount(cat.fonts)}
                    active={selectedStyleCategory === cat.name}
                    onClick={() => {
                      changeSelectedStyleCategory?.(cat.name);
                      changeSearchTerm?.('');
                    }}
                  />
                ))}
              </nav>
            </div>

            {/* Reset button */}
            <button
              onClick={() => {
                changeFontSize?.(14);
                changeLineHeight?.(1.5);
                changePreviewText?.('သင်္ကြန်ဟူသော ဝေါဟာရသည် သင်္ကန္တခေါ် ပါဠိဘာသာ၊ သင်္ကြန္တခေါ် သက္ကတဘာသာမှ သက်ဆင်းလာသော ဝေါဟာရဖြစ်သည်။');
                toggleGrid?.(false);
                changeSelectedAuthorCategory?.('all');
                changeSelectedStyleCategory?.('all');
              }}
              className="w-full py-2 px-3 text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Reset to Default
            </button>
          </div>

          {/* Footer info */}
          <div className="mt-auto p-4 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              Myanmar Unicode Fonts Preview
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

const CategoryItem: React.FC<{
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
}> = ({ label, count, active, onClick }) => (
  <button
    onClick={onClick}
    className={`
      w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-150
      ${active
        ? 'bg-gray-100 text-black font-semibold'
        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }
    `}
  >
    <span className="truncate text-left">{label}</span>
    <span className={`
      shrink-0 ml-2 text-xs px-1.5 py-0.5 rounded-full font-semibold
      ${active
        ? 'bg-black text-white'
        : 'bg-gray-100 text-gray-500'
      }
    `}>
      {count}
    </span>
  </button>
);
