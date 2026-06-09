// Catalog data is generated from fonts.json — edit that file, then run `bun run fonts`.
// This module only re-exports the data and provides URL helpers (which need
// process.env.PUBLIC_URL at runtime, so they can't be precomputed).
import {
  fontCatalog,
  allFonts,
  fontLanguageCategories,
  type FontCategoryKey,
  type FontDefinition,
  type FontCategory,
  type LanguageCategory,
} from "./fontCatalog.generated";

export type { FontCategoryKey, FontDefinition, FontCategory, LanguageCategory };
export { fontCatalog, allFonts, fontLanguageCategories };

const CDN_BASE_URL =
  "https://cdn.jsdelivr.net/gh/saturngod/myanmar-unicode-fonts@master/docs";

export const getFontsByCategory = (
  categoryKey: FontCategoryKey,
): FontDefinition[] =>
  fontCatalog.find((category) => category.key === categoryKey)?.fonts ?? [];

export const getCdnFontUrl = (filePath: string): string => {
  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  return `${CDN_BASE_URL}${normalizedPath}`;
};

export const getPublicFontUrl = (filePath: string): string => {
  const normalizedPath = filePath.startsWith("/") ? filePath : `/${filePath}`;
  const basePath = process.env.PUBLIC_URL || "";
  return `${basePath}${normalizedPath}`;
};
