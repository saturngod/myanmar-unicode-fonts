import React from "react";


interface HeaderFontPreviewProps {
    title: string;
}

export const HeaderFontPreview: React.FC<HeaderFontPreviewProps> = ({ title }) => {
    return (
        <h2 className="text-xl font-bold mb-2 mt-4">{title}</h2>
    );
};
