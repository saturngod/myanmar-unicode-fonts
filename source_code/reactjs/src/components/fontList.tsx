import React, { useContext } from "react";
import { HeaderFontPreview } from "./headerFont";
import { FontBox } from "./fontBox";
import { FontContext } from "../Context/mmfontContext";
interface FontListProps {
    title: string;
    data: string[];
}

export const FontList: React.FC<FontListProps> = ({ title, data }) => {

    const { grid } = useContext(FontContext) || {};

    return (
        <>
        <HeaderFontPreview title={title}/>

            <ul className={ grid ? "grid grid-cols-3 gap-4" : ""}>
            {data.map((font, index) => (
                <li className="mb-4 border p-2">
                <FontBox fontName={font}/>
                </li>
            ))}
            </ul>
        
        </>
    );
};
