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

            <ul className={ grid ? "grid grid-cols-3 gap-x-8 gap-y-1" : ""}>
            {data.map((font, index) => (
                <li className="mb-4 border p-8">
                <FontBox fontName={font}/>
                </li>
            ))}
            </ul>
        
        </>
    );
};
