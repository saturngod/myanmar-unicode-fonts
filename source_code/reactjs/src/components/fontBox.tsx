import React, { useContext } from "react";
import { FontContext } from "../Context/mmfontContext";

interface FontBoxProps {
    fontName: string;
}

export const FontBox: React.FC<FontBoxProps> = ({ fontName }) => {
    
    const { fontSize, lineHeight, previewText } = useContext(FontContext) || {};

  

    return (
        <div>
        <h2 className="text-sm font-light mb-2">{fontName}</h2>
            <div className={`${fontName}`} style={{fontSize: fontSize + "px", lineHeight: lineHeight, whiteSpace: "pre-wrap"}}>
                {previewText}
            </div>
        </div>
    );
};
