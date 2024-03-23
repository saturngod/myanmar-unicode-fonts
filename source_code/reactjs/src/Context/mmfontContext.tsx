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

enum StorageType {
    FontSize = 'fontSize',
    LineHeight = 'lineHeight',
    PreviewText = 'previewText',
    Grid = 'grid'
  }


export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const defaultFontSize = (): number => {
        const storedFontSize = localStorage.getItem(StorageType.FontSize);
        return storedFontSize ? parseInt(storedFontSize, 10) : 14;
    };

    const defaultLineHeight = (): number => {
        const storedLineHeight = localStorage.getItem(StorageType.LineHeight);
        return storedLineHeight ? parseFloat(storedLineHeight) : 1.5;
    }
    

    const defaultPreviewText = (): string => {
        const storedPreviewText = localStorage.getItem(StorageType.PreviewText);
        return storedPreviewText ? storedPreviewText : "သင်္ကြန်ဟူသော ဝေါဟာရသည် သင်္ကန္တခေါ် ပါဠိဘာသာ၊ သင်္ကြန္တခေါ် သက္ကတဘာသာမှ သက်ဆင်းလာသော ဝေါဟာရဖြစ်သည်။ သင်္ကန္တ၊ သင်္ကြန္တဟူသည် ကူးပြောင်းခြင်းဟု အနက်အဓိပ္ပာယ်ရသည်။ တပေါင်းလတွင် မြန်မာနှစ် တစ်နှစ်ကုန်ဆုံးကာ နှစ်ဟောင်းကုန်၍ တန်ခူးလတွင် နှစ်သစ်ကြုံရသောကာလ၊ နှစ်သစ်ကူးပြောင်းသောကာလဟု ဆိုလိုရင်းဖြစ်သည်။";
    }

    const defaultGrid = (): boolean => {
        const storedGrid = localStorage.getItem(StorageType.Grid);
        return storedGrid ? storedGrid === 'true' : false;
    }


    const [fontSize, setFontSize] = useState<number>(defaultFontSize());
    const [lineHeight, setLineHeight] = useState<number>(defaultLineHeight());
    const [previewText, setPreviewText] = useState<string>(defaultPreviewText());
    const [grid, setGrid] = useState<boolean>(defaultGrid());

    
    
    const changeFontSize = (newFontSize: number) => {
        setFontSize(newFontSize);
        localStorage.setItem(StorageType.FontSize, newFontSize.toString());
    };

    const changeLineHeight = (newLineHeight: number) => {
        setLineHeight(newLineHeight);
        localStorage.setItem(StorageType.LineHeight, newLineHeight.toString());
    };

    const changePreviewText = (newPreviewText: string) => {
        setPreviewText(newPreviewText);
        localStorage.setItem(StorageType.PreviewText, newPreviewText);
    };

    const toggleGrid = (gird: boolean) => {
        setGrid(gird);
        localStorage.setItem(StorageType.Grid, gird.toString());
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