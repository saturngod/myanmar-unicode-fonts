import React, { useContext, useMemo } from 'react';
import { FontContext } from '../Context/mmfontContext';
import { FontList } from './fontList';
import { fontCatalog, FontDefinition, FontCategoryKey } from '../data/fontCatalog';
import { fontStyleCategories } from '../data/styleCategories';

export const MainContent: React.FC = () => {
  const { searchTerm, selectedStyleCategory } = useContext(FontContext) || {};

  const filteredCatalog = useMemo(() => {
    const search = (searchTerm || '').toLowerCase().trim();

    // Step 1: build the set of font names allowed by the style filter
    let allowedNames: Set<string> | null = null;
    if (selectedStyleCategory && selectedStyleCategory !== 'all') {
      const styleCat = fontStyleCategories.find(c => c.name === selectedStyleCategory);
      if (styleCat) {
        allowedNames = new Set(styleCat.fonts.map(f => f.replace(/\s+/g, '')));
      }
    }

    // Step 2: map over author categories, filter fonts within each
    const result = fontCatalog
      .map(authorCat => {
        let fonts = authorCat.fonts;

        if (allowedNames) {
          fonts = fonts.filter(f => allowedNames!.has(f.displayName.replace(/\s+/g, '')));
        }

        if (search) {
          fonts = fonts.filter(f => f.displayName.toLowerCase().includes(search));
        }

        return { ...authorCat, fonts };
      })
      .filter(cat => cat.fonts.length > 0);

    return result;
  }, [selectedStyleCategory, searchTerm]);

  const totalFontCount = useMemo(
    () => filteredCatalog.reduce((sum, cat) => sum + cat.fonts.length, 0),
    [filteredCatalog]
  );

  const styleLabel = selectedStyleCategory === 'all' || !selectedStyleCategory
    ? 'All Fonts'
    : selectedStyleCategory;

  return (
    <main className="flex-1 min-w-0">
      {/* Title bar */}
      <div className="sticky top-[57px] z-20 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="px-4 lg:px-6 py-3 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{styleLabel}</h2>
            {(searchTerm && searchTerm.trim() !== '') && (
              <p className="text-xs text-gray-500 mt-0.5">
                {totalFontCount} result{totalFontCount !== 1 ? 's' : ''} for &ldquo;{searchTerm}&rdquo;
              </p>
            )}
          </div>
          <span className="text-sm text-gray-500">
            {totalFontCount} font{totalFontCount !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Font sections grouped by author */}
      <div className="px-4 lg:px-6 py-6 space-y-8">
        {filteredCatalog.length > 0 ? (
          filteredCatalog.map(authorCat => (
            <AuthorSection key={authorCat.key} category={authorCat} />
          ))
        ) : (
          <div className="text-center py-16">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
              </svg>
            </div>
            <p className="text-gray-500 font-medium">No fonts found</p>
            <p className="text-gray-400 text-sm mt-1">Try a different category or search term</p>
          </div>
        )}
      </div>
    </main>
  );
};

const categoryColors: Record<FontCategoryKey, { bg: string; text: string; dot: string }> = {
  khmer:                  { bg: 'bg-blue-50',    text: 'text-blue-700',    dot: 'bg-blue-400' },
  masterpiece:            { bg: 'bg-purple-50',  text: 'text-purple-700',  dot: 'bg-purple-400' },
  'phoenix-digital-art':  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-400' },
  unknown:                { bg: 'bg-gray-50',    text: 'text-gray-600',    dot: 'bg-gray-400' },
  other:                  { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-400' },
};

const AuthorSection: React.FC<{
  category: { key: FontCategoryKey; title: string; description: string; fonts: FontDefinition[] };
}> = ({ category }) => {
  const colors = categoryColors[category.key];

  return (
    <section>
      <div className="flex items-center gap-2.5 mb-4">
        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
        <h2 className="text-base font-bold text-gray-900">{category.title}</h2>
        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
          {category.fonts.length}
        </span>
      </div>
      <FontList fonts={category.fonts} />
    </section>
  );
};
