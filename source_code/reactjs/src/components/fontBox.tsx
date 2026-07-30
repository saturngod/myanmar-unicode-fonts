import React, { useEffect, useState } from "react";
import { useFontContext } from "../Context/mmfontContext";
import { useToast } from "../Context/toastContext";
import { FontDefinition, FontVariant, getCdnFontUrl, getPublicFontUrl } from "../data/fontCatalog";

interface FontBoxProps {
    fontDefinition: FontDefinition;
}

const FONT_STYLE_TAG_ID = 'mmfont-preview-faces';
const injectedPreviewFamilies = new Set<string>();

// All weights of a family share one previewFamily and differ by font-weight /
// font-style, so the browser picks the right file the same way Google Fonts does.
const ensurePreviewFaces = (fontDefinition: FontDefinition) => {
    if (typeof document === 'undefined' || injectedPreviewFamilies.has(fontDefinition.previewFamily)) {
        return;
    }

    let styleTag = document.getElementById(FONT_STYLE_TAG_ID) as HTMLStyleElement | null;
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = FONT_STYLE_TAG_ID;
        document.head.appendChild(styleTag);
    }

    const rules = fontDefinition.variants
        .map(
            (variant) =>
                `@font-face{font-family:"${fontDefinition.previewFamily}";` +
                `font-weight:${variant.weight};font-style:${variant.italic ? 'italic' : 'normal'};` +
                `src:local("${variant.localName}"),url("${getPublicFontUrl(variant.filePath)}") format("truetype");` +
                `font-display:swap;}`
        )
        .join('');

    styleTag.appendChild(document.createTextNode(rules));
    injectedPreviewFamilies.add(fontDefinition.previewFamily);
};

const variantKey = (variant: FontVariant) => `${variant.weight}${variant.italic ? 'i' : ''}`;

export const FontBox: React.FC<FontBoxProps> = React.memo(({ fontDefinition }) => {
    const { fontSize, lineHeight, previewText } = useFontContext();
    const { showToast } = useToast();
    const [copied, setCopied] = useState(false);
    const [selectedKey, setSelectedKey] = useState(
        `${fontDefinition.defaultWeight}${fontDefinition.defaultItalic ? 'i' : ''}`,
    );

    useEffect(() => {
        ensurePreviewFaces(fontDefinition);
    }, [fontDefinition]);

    const selected =
        fontDefinition.variants.find((v) => variantKey(v) === selectedKey) ?? fontDefinition.variants[0];
    const hasWeights = fontDefinition.variants.length > 1;
    const cdnUrl = getCdnFontUrl(selected.filePath);

    const copyCSS = async () => {
        // Copy the whole family so the caller can use any weight, not just the
        // one currently previewed.
        const cssText = fontDefinition.variants
            .map(
                (variant) =>
                    `@font-face {font-family:"${fontDefinition.cssFamily}";` +
                    `font-weight:${variant.weight};font-style:${variant.italic ? 'italic' : 'normal'};` +
                    `src:local('${variant.localName}'),url('${getCdnFontUrl(variant.filePath)}') format('truetype');}`,
            )
            .join('\n');

        try {
            await navigator.clipboard.writeText(cssText);
            setCopied(true);
            showToast(`CSS for ${fontDefinition.displayName} copied!`, 'success');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy CSS:', err);
            showToast('Failed to copy CSS', 'error');
        }
    };

    const downloadFont = async () => {
        try {
            const response = await fetch(cdnUrl);
            if (!response.ok) throw new Error('Download failed');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = selected.downloadFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showToast(`${fontDefinition.displayName} ${selected.label} downloaded`, 'success');
        } catch (err) {
            console.error('Failed to download:', err);
            showToast('Failed to download font', 'error');
        }
    };

    return (
        <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300">
            {/* Font name header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <h3 className="flex items-baseline gap-1.5 min-w-0 text-sm font-semibold text-gray-700 pr-2">
                    <span className="truncate">{fontDefinition.displayName}</span>
                    {hasWeights && (
                        <span className="shrink-0 text-xs font-normal text-gray-400">
                            {fontDefinition.variants.length} weights
                        </span>
                    )}
                </h3>
                <div className="flex items-center gap-0.5 shrink-0">
                    <button
                        onClick={copyCSS}
                        className={`
                            p-2 rounded-lg transition-all duration-200
                            ${copied
                                ? 'bg-blue-50 text-blue-600'
                                : 'text-blue-500 hover:text-blue-700 hover:bg-blue-50'
                            }
                        `}
                        title="Copy CSS"
                    >
                        {copied ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        )}
                    </button>
                    <button
                        onClick={downloadFont}
                        className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        title="Download Font"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Weight selector — only for families that ship more than one weight */}
            {hasWeights && (
                <div className="flex items-center gap-1 px-4 py-2 border-b border-gray-50 overflow-x-auto scrollbar-thin">
                    {fontDefinition.variants.map((variant) => {
                        const key = variantKey(variant);
                        const isActive = key === selectedKey;
                        return (
                            <button
                                key={key}
                                onClick={() => setSelectedKey(key)}
                                title={`${variant.label} ${variant.weight}`}
                                aria-label={`${fontDefinition.displayName} ${variant.label} ${variant.weight}`}
                                aria-pressed={isActive}
                                className={`
                                    shrink-0 px-2 py-0.5 rounded-md text-xs font-medium transition-colors duration-150
                                    ${isActive
                                        ? 'bg-blue-500 text-white'
                                        : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100'
                                    }
                                `}
                            >
                                {variant.weight}
                                {variant.italic && <span className="italic">i</span>}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* Font preview */}
            <div className="px-4 py-4 min-h-[80px]">
                <div
                    className="text-gray-900 break-words"
                    style={{
                        fontFamily: `"${fontDefinition.previewFamily}", "${fontDefinition.displayName}", sans-serif`,
                        fontSize: fontSize + "px",
                        lineHeight: lineHeight,
                        fontWeight: selected.weight,
                        fontStyle: selected.italic ? "italic" : "normal",
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {previewText}
                </div>
            </div>
        </div>
    );
});
