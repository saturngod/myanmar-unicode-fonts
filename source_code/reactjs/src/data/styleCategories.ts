// Style data is generated from the `style` field in fonts.json — edit that file,
// then run `bun run fonts`. This module re-exports it plus the name-matching helpers.
import {
  fontStyleCategories,
  type StyleCategory,
} from "./fontCatalog.generated";

export type { StyleCategory };
export { fontStyleCategories };

// Style categories reference fonts by displayName. Names are matched after
// stripping whitespace so "Noto Sans" and "NotoSans" compare equal. This is the
// ONE place that normalization lives — used by both the sidebar counts and the
// main content filter.
export const normalizeFontName = (name: string): string => name.replace(/\s+/g, "");

// The set of normalized font names allowed by a style category.
// Returns null for "all", an unknown name, or empty input = "no restriction".
export const getStyleAllowedNames = (
  styleCategoryName: string | undefined,
): Set<string> | null => {
  if (!styleCategoryName || styleCategoryName === "all") return null;
  const styleCat = fontStyleCategories.find((c) => c.name === styleCategoryName);
  if (!styleCat) return null;
  return new Set(styleCat.fonts.map(normalizeFontName));
};
