import React, { useContext } from "react";
import { HeaderFontPreview } from "./headerFont";
import { FontBox } from "./fontBox";
import { FontContext } from "../Context/mmfontContext";
interface FontListProps {
    title: string;
    data: string[];
}

export const FontList: React.FC<FontListProps> = React.memo(({ title, data }) => {

    const { grid, searchTerm } = useContext(FontContext) || {};

    // Filter fonts based on search term
    const filteredFonts = data.filter(font =>
        font.toLowerCase().includes(searchTerm?.toLowerCase() || '')
    );

    // Don't render the section if no fonts match the search
    if (filteredFonts.length === 0 && searchTerm && searchTerm.trim() !== '') {
        return null;
    }

    return (
        <>
            <HeaderFontPreview title={title} />

            <ul className={`transition-normal ${grid ? "grid-responsive" : "flex flex-col space-md"}`}>
                {filteredFonts.map((font, index) => (
                    <li key={font} className={`transition-normal ${grid ? "" : "mb-md"}`}>
                        <FontBox fontName={font} />
                    </li>
                ))}
            </ul>

        </>
    );
});
