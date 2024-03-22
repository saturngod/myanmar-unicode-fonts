import React from "react";


interface HeaderFontPreview {
    title: string;
}

export const HeaderFontPreview: React.FC<HeaderFontPreview> = ({ title }) => {
    return (
        <h2 className="text-xl font-bold mb-2 mt-4">{title}</h2>
    );
};
