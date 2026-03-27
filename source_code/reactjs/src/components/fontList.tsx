import React, { useContext } from 'react';
import { FontBox } from './fontBox';
import { FontContext } from '../Context/mmfontContext';
import { FontDefinition } from '../data/fontCatalog';

interface FontListProps {
    fonts: FontDefinition[];
}

export const FontList: React.FC<FontListProps> = React.memo(({ fonts }) => {
    const { grid } = useContext(FontContext) || {};

    if (fonts.length === 0) return null;

    return (
        <div className={
            grid
                ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4"
                : "flex flex-col gap-4"
        }>
            {fonts.map(font => (
                <FontBox key={font.id} fontDefinition={font} />
            ))}
        </div>
    );
});
