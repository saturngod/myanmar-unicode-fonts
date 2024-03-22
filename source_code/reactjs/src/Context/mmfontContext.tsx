import React, { createContext, useState } from 'react';

interface FontContextProps {
    fontSize: number;
    lineHeight: number;
    previewText: string;
    grid: boolean;
    changeFontSize: (newFontSize: number) => void;
    changeLineHeight: (newLineHeight: number) => void;
    changePreviewText: (newPreviewText: string) => void;
    toggleGrid: (gird: boolean) => void;
}

export const FontContext = createContext<FontContextProps | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [fontSize, setFontSize] = useState<number>(14);
    const [lineHeight, setLineHeight] = useState<number>(1.5);
    const [previewText, setPreviewText] = useState<string>("သင်္ကြန်ဟူသော ဝေါဟာရသည် သင်္ကန္တခေါ် ပါဠိဘာသာ၊ သင်္ကြန္တခေါ် သက္ကတဘာသာမှ သက်ဆင်းလာသော ဝေါဟာရဖြစ်သည်။ သင်္ကန္တ၊ သင်္ကြန္တဟူသည် ကူးပြောင်းခြင်းဟု အနက်အဓိပ္ပာယ်ရသည်။ တပေါင်းလတွင် မြန်မာနှစ် တစ်နှစ်ကုန်ဆုံးကာ နှစ်ဟောင်းကုန်၍ တန်ခူးလတွင် နှစ်သစ်ကြုံရသောကာလ၊ နှစ်သစ်ကူးပြောင်းသောကာလဟု ဆိုလိုရင်းဖြစ်သည်။");
    const [grid, setGrid] = useState<boolean>(false);

    
    const changeFontSize = (newFontSize: number) => {
        setFontSize(newFontSize);
    };

    const changeLineHeight = (newLineHeight: number) => {
        setLineHeight(newLineHeight);
    };

    const changePreviewText = (newPreviewText: string) => {
        setPreviewText(newPreviewText);
    };

    const toggleGrid = (gird: boolean) => {
        setGrid(gird);
    };

    const contextValue: FontContextProps = {
        fontSize,
        lineHeight,
        previewText,
        grid,
        changeFontSize,
        changeLineHeight,
        changePreviewText,
        toggleGrid
    };

    return (
        <FontContext.Provider value={contextValue}>
            {children}
        </FontContext.Provider>
    );
};