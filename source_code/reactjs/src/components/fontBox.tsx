import React, { useContext, useEffect, useState } from "react";
import { FontContext } from "../Context/mmfontContext";
import { useToast } from "../Context/toastContext";
import { FontDefinition, getCdnFontUrl, getPublicFontUrl } from "../data/fontCatalog";

interface FontBoxProps {
    fontDefinition: FontDefinition;
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

export const FontBox: React.FC<FontBoxProps> = React.memo(({ fontDefinition }) => {
    const { fontSize, lineHeight, previewText } = useContext(FontContext) || {};
    const { showToast } = useToast();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        ensurePreviewFace(fontDefinition);
    }, [fontDefinition]);

    const cdnUrl = getCdnFontUrl(fontDefinition.filePath);

    const copyCSS = async () => {
        const cssText = `@font-face {font-family:"${fontDefinition.cssFamily}";src:local('${fontDefinition.displayName}'),url('${cdnUrl}') format('truetype');}`;

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
            link.download = fontDefinition.downloadFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            showToast(`${fontDefinition.displayName} downloaded`, 'success');
        } catch (err) {
            console.error('Failed to download:', err);
            showToast('Failed to download font', 'error');
        }
    };

    return (
        <div className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-300">
            {/* Font name header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50">
                <h3 className="text-sm font-semibold text-gray-700 truncate pr-2">
                    {fontDefinition.displayName}
                </h3>
                <div className="flex items-center gap-0.5 shrink-0">
                    <button
                        onClick={copyCSS}
                        className={`
                            p-2 rounded-lg transition-all duration-200
                            ${copied
                                ? 'bg-gray-100 text-black'
                                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
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
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                        title="Download Font"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Font preview */}
            <div className="px-4 py-4 min-h-[80px]">
                <div
                    className="text-gray-900 break-words"
                    style={{
                        fontFamily: `"${fontDefinition.previewFamily}", "${fontDefinition.displayName}", sans-serif`,
                        fontSize: (fontSize || 14) + "px",
                        lineHeight: lineHeight || 1.5,
                        whiteSpace: "pre-wrap"
                    }}
                >
                    {previewText}
                </div>
            </div>
        </div>
    );
});
