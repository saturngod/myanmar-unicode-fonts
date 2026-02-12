import React, { useContext, useEffect, useMemo, useState } from "react";
import { FontContext } from "../Context/mmfontContext";
import { useToast } from "../Context/toastContext";
import { FontCategoryKey, FontDefinition, getCdnFontUrl, getFontsByCategory, getPublicFontUrl } from "../data/fontCatalog";

interface FontBoxProps {
    fontName: string;
    categoryKey: FontCategoryKey;
}

const FONT_STYLE_TAG_ID = 'mmfont-preview-faces';
const injectedPreviewFamilies = new Set<string>();

const ensurePreviewFace = (fontDefinition: FontDefinition) => {
    if (typeof document === 'undefined' || injectedPreviewFamilies.has(fontDefinition.previewFamily)) {
        return;
    }

    let styleTag = document.getElementById(FONT_STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = FONT_STYLE_TAG_ID;
        document.head.appendChild(styleTag);
    }

    styleTag.appendChild(
        document.createTextNode(
            `@font-face{font-family:"${fontDefinition.previewFamily}";src:local("${fontDefinition.displayName}"),url("${getPublicFontUrl(fontDefinition.filePath)}") format("truetype");font-display:swap;}`
        )
    );
    injectedPreviewFamilies.add(fontDefinition.previewFamily);
};

export const FontBox: React.FC<FontBoxProps> = React.memo(({ fontName, categoryKey }) => {

    const { fontSize, lineHeight, previewText } = useContext(FontContext) || {};
    const { showToast } = useToast();
    const [copied, setCopied] = useState(false);
    const fontDefinition = useMemo(
        () => getFontsByCategory(categoryKey).find(font => font.displayName === fontName),
        [categoryKey, fontName]
    );

    useEffect(() => {
        if (fontDefinition) {
            ensurePreviewFace(fontDefinition);
        }
    }, [fontDefinition]);

    const getFontPath = () => {
        if (fontDefinition) {
            return getCdnFontUrl(fontDefinition.filePath);
        }

        // Determine the font path based on font name
        let fontPath = '';

        // Khmer fonts are in KhmerType folder
        const khmerFonts = [
            "MyanmarAngoun", "MyanmarChatu", "MyanmarChatuLight", "MyanmarGantgaw",
            "MyanmarKhyay", "MyanmarKuttar", "MyanmarNayone", "MyanmarNjaun",
            "MyanmarPauklay", "MyanmarPhetsot", "MyanmarPhiksel", "MyanmarPhikselSmooth",
            "MyanmarPonenyet", "MyanmarSabae", "MyanmarSagar", "MyanmarSanpya",
            "MyanmarTagu", "MyanmarThuriya", "MyanmarWaso", "MyanmarYinmar"
        ];

        // Masterpiece fonts are in masterpiece folder
        const masterpieceFonts = [
            "MasterpieceCTL", "MasterpieceLakwel", "MasterpieceSpringRev",
            "MasterpieceStadium", "MasterpieceTawWin", "MasterpieceUniHand",
            "MasterpieceUniRound", "MasterpieceUniSerif", "MasterpieceUniType",
            "MasterpieceYayChanZin", "MasterpieceDaung", "MasterpieceDaungRound"
        ];

        // Unknown fonts are in unknown folder
        const unknownFonts = [
            "CherryUnicode", "Kamjing", "MyanmarBlack", "MyanmarHeadOne",
            "MyanmarSquare", "MyanmarSquareLight", "NKSSmart2", "NKSSmart3",
            "Yangon", "YoeYar-One", "MyanmarSansPro"
        ];

        // Other fonts are in other folder
        const otherFonts = [
            "Mon3", "Myanmar3", "MyanmarSansPro", "NotoSanMyanmar",
            "NotoSansMyanmarUI", "NotoSerifMyanmar", "Ours-Unicode",
            "Pyidaungsu", "Yunghkio", "MyMyanmarUniversal", "NotoZawDecode"
        ];

        const phoenixDigitalArt = [
            "ThitSarShweSi"
        ]

        if (khmerFonts.includes(fontName)) {
            fontPath = `/KhmerType/${fontName}.ttf`;
        } else if (masterpieceFonts.includes(fontName)) {
            fontPath = `/masterpiece/${fontName}.ttf`;
        } else if (unknownFonts.includes(fontName)) {
            fontPath = `/unknown/${fontName}.ttf`;
        } else if (otherFonts.includes(fontName)) {
            fontPath = `/other/${fontName}.ttf`;
        } else if (phoenixDigitalArt.includes(fontName)) {
            fontPath = `/PhoenixDigitalArt/${fontName}.ttf`;
        }
        else {
            fontPath = `/${fontName}.ttf`;
        }

        return "https://cdn.jsdelivr.net/gh/saturngod/myanmar-unicode-fonts@master/docs" + fontPath;
    };

    const copyCSS = async () => {
        const fontPath = getFontPath();
        const cssFamily = fontDefinition?.cssFamily || fontName;
        const cssText = `@font-face {font-family:"${cssFamily}";src:local('${fontName}'),url('${fontPath}') format('truetype');}`;

        try {
            await navigator.clipboard.writeText(cssText);
            setCopied(true);
            showToast(`CSS for ${fontName} copied to clipboard!`, 'success');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy CSS:', err);
            showToast('Failed to copy CSS to clipboard', 'error');
        }
    };

    const downloadFont = async () => {
        try {
            const fontPath = getFontPath();
            const response = await fetch(fontPath);

            if (!response.ok) {
                throw new Error('Font download failed');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fontDefinition?.downloadFileName || `${fontName}.ttf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            showToast(`${fontName} font ready to download`, 'success');
        } catch (err) {
            console.error('Failed to download font:', err);
            showToast('Failed to download font', 'error');
        }
    };

    return (
        <div className="card-base p-md transition-normal" style={{ minHeight: '120px' }}>
            <div className="flex-between mb-2">
                <h2 className="text-scale-xs font-weight-medium text-primary">{fontName}</h2>
                <div className="flex gap-1">
                    <button
                        onClick={copyCSS}
                        className="p-1 hover:bg-surface rounded-sm transition-fast"
                        title="Copy CSS"
                    >
                        {copied ? (
                            <svg className="w-4 h-4 text-accent-success" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4 text-secondary hover:text-primary transition-fast" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={downloadFont}
                        className="p-1 hover:bg-surface rounded-sm transition-fast"
                        title="Download Font"
                    >
                        <svg className="w-4 h-4 text-secondary hover:text-primary transition-fast" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                </div>
            </div>
            <div
                className={`${fontName} text-primary`}
                style={{
                    fontFamily: fontDefinition ? `"${fontDefinition.previewFamily}", "${fontName}", sans-serif` : undefined,
                    fontSize: fontSize + "px",
                    lineHeight: lineHeight,
                    whiteSpace: "pre-wrap"
                }}
            >
                {previewText}
            </div>
        </div>
    );
});
