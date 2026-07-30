/**
 * Generates the font data the app uses, from a single source of truth: fonts.json.
 *
 *   bun run fonts            (-> bun scripts/generateFonts.ts)
 *
 * Outputs:
 *   src/data/fontCatalog.generated.ts   - typed catalog + style data the app imports
 *   public/mmfonts.css                  - global @font-face stylesheet (linked in index.html)
 *
 * fonts.json is the ONLY file you edit to add a font. Everything else is derived.
 */
import { readdirSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = join(ROOT, "public");

// unicode.js (CommonJS) detects which Myanmar languages a .ttf actually covers,
// by checking real glyph coverage for each script's codepoints.
const require = createRequire(import.meta.url);
const { detectMyanmarFontSupport, MYANMAR_LANGUAGES } = require("../unicode.js") as {
  detectMyanmarFontSupport: (p: string) => { languages: { id: string; status: string }[] };
  MYANMAR_LANGUAGES: { id: string; name: string }[];
};

// Short, sidebar-friendly labels for each language id (unicode.js names are verbose).
const LANGUAGE_LABELS: Record<string, string> = {
  burmese: "Burmese",
  mon: "Mon",
  shan: "Shan",
  rakhine: "Rakhine",
  karen: "Karen",
  pao: "Pa'O",
  tailaing: "Tai Laing",
  kayahli: "Kayah Li",
  khamti: "Khamti",
};

// Returns the ids of languages the font fully supports. opentype.js prints noisy
// warnings for some fonts, so silence console during detection.
const detectLanguages = (diskPath: string): string[] => {
  const origWarn = console.warn;
  const origError = console.error;
  console.warn = () => {};
  console.error = () => {};
  try {
    const report = detectMyanmarFontSupport(diskPath);
    return report.languages.filter((l) => l.status === "supported").map((l) => l.id);
  } catch {
    return [];
  } finally {
    console.warn = origWarn;
    console.error = origError;
  }
};

interface AuthorMeta {
  key: string;
  title: string;
  description: string;
  folder: string;
  cssSuffix: string;
  link?: string;
}
// One weight/style of a family. `weight` defaults to 400, `italic` to false.
interface VariantEntry {
  file: string;
  weight?: number | null;
  italic?: boolean | null;
  // Optional override for the name used in the CSS `local()` lookup. Auto-read
  // from the TTF when omitted.
  localName?: string | null;
}
interface FontEntry {
  name: string;
  author: string;
  // Single-weight font: just `file`. Multi-weight family: `variants`.
  file?: string | null;
  variants?: VariantEntry[] | null;
  localName?: string | null;
  style?: string | null;
  // Languages to drop from auto-detection. Use when a font bundles a script's
  // glyphs (so glyph-coverage detection matches) but doesn't truly support it,
  // e.g. Kamjing carries Mon glyphs but has no real Mon shaping.
  excludeLanguages?: string[] | null;
}
interface FontsJson {
  authors: AuthorMeta[];
  styles: string[];
  fonts: FontEntry[];
}

const data: FontsJson = JSON.parse(readFileSync(join(ROOT, "fonts.json"), "utf8"));
const authorByKey = new Map(data.authors.map((a) => [a.key, a]));

// --- derived-field helpers (must match the app's historical behaviour) ---
const normalizeForFamily = (value: string): string =>
  value
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

// CSS numeric weight -> the name Google Fonts (and everyone else) uses for it.
const WEIGHT_NAMES: Record<number, string> = {
  100: "Thin",
  200: "ExtraLight",
  300: "Light",
  400: "Regular",
  500: "Medium",
  600: "SemiBold",
  700: "Bold",
  800: "ExtraBold",
  900: "Black",
};

const variantLabel = (weight: number, italic: boolean): string => {
  const base = WEIGHT_NAMES[weight] ?? String(weight);
  if (!italic) return base;
  return weight === 400 ? "Italic" : `${base} Italic`;
};

// Read entries from a TTF's `name` table, keyed by nameID (Windows/Unicode records only).
const readNameTable = (filePath: string): Map<number, string> => {
  const names = new Map<number, string>();
  try {
    const buf = readFileSync(filePath);
    const numTables = buf.readUInt16BE(4);
    for (let i = 0; i < numTables; i++) {
      if (buf.toString("ascii", 12 + i * 16, 16 + i * 16) !== "name") continue;
      const tableOffset = buf.readUInt32BE(20 + i * 16);
      const count = buf.readUInt16BE(tableOffset + 2);
      const stringOffset = buf.readUInt16BE(tableOffset + 4);
      for (let j = 0; j < count; j++) {
        const rec = tableOffset + 6 + j * 12;
        const platformID = buf.readUInt16BE(rec);
        const encodingID = buf.readUInt16BE(rec + 2);
        const nameID = buf.readUInt16BE(rec + 6);
        const length = buf.readUInt16BE(rec + 8);
        const offset = buf.readUInt16BE(rec + 10);
        if (platformID !== 3 || encodingID !== 1 || names.has(nameID)) continue;
        const strStart = tableOffset + stringOffset + offset;
        const swapped = Buffer.alloc(length);
        for (let k = 0; k < length - 1; k += 2) {
          swapped[k] = buf[strStart + k + 1];
          swapped[k + 1] = buf[strStart + k];
        }
        names.set(nameID, swapped.toString("utf16le"));
      }
      break;
    }
  } catch {
    /* file missing - reported separately below */
  }
  return names;
};

// The name used in CSS `local()`.
//
// For a single-weight font the family name (nameID 16 / 1) is right and matches
// what this script has always emitted. For a multi-weight family it is NOT:
// every Padauk weight reports family "Padauk", so `local("Padauk")` inside the
// weight-700 face would match a locally-installed Regular and the browser would
// fake the bold instead of loading our Bold file. Use the full name (nameID 4,
// "Padauk SemiBold") there — browsers match `local()` on full and PostScript names.
const readEmbeddedName = (filePath: string, perVariant: boolean): string | null => {
  const names = readNameTable(filePath);
  if (perVariant) {
    const full = names.get(4) ?? names.get(6);
    if (full) return full;
  }
  return names.get(16) ?? names.get(1) ?? null;
};

// --- validate + warn -------------------------------------------------------
const warnings: string[] = [];

// duplicate display names across authors get a category suffix on cssFamily
const nameCounts = new Map<string, number>();
for (const f of data.fonts) nameCounts.set(f.name, (nameCounts.get(f.name) ?? 0) + 1);

const allowedStyles = new Set(data.styles);
const jsonFilesByFolder = new Map<string, Set<string>>();

interface EnrichedVariant {
  weight: number;
  italic: boolean;
  label: string;
  filePath: string;
  downloadFileName: string;
  localName: string;
}
interface EnrichedFont {
  id: string;
  displayName: string;
  category: string;
  filePath: string;
  cssFamily: string;
  previewFamily: string;
  localName: string;
  downloadFileName: string;
  languages: string[];
  variants: EnrichedVariant[];
  defaultWeight: number;
  defaultItalic: boolean;
}

const enriched: EnrichedFont[] = data.fonts.map((f) => {
  const author = authorByKey.get(f.author);
  if (!author) throw new Error(`Font "${f.name}" has unknown author "${f.author}"`);

  // `file` is shorthand for a single 400-weight variant.
  const rawVariants: VariantEntry[] = f.variants?.length
    ? f.variants
    : f.file
      ? [{ file: f.file }]
      : [];
  if (rawVariants.length === 0) throw new Error(`Font "${f.name}" has neither "file" nor "variants"`);

  if (!jsonFilesByFolder.has(author.folder)) jsonFilesByFolder.set(author.folder, new Set());
  for (const v of rawVariants) jsonFilesByFolder.get(author.folder)!.add(v.file);

  if (!f.style) warnings.push(`"${f.name}" has no style`);
  else if (!allowedStyles.has(f.style)) warnings.push(`"${f.name}" has unknown style "${f.style}"`);

  const cssFamily = (nameCounts.get(f.name) ?? 0) > 1 ? `${f.name}-${author.cssSuffix}` : f.name;
  const excluded = new Set(f.excludeLanguages ?? []);
  const languageIds = new Set<string>();

  const variants: EnrichedVariant[] = rawVariants.map((v) => {
    const diskPath = join(PUBLIC_DIR, author.folder, v.file);
    const weight = v.weight ?? 400;
    const italic = v.italic ?? false;

    // localName drives the CSS `local()` lookup, so it must be per-file.
    // fonts.json's entry-level localName only applies to a single-variant font.
    const multi = rawVariants.length > 1;
    let localName = v.localName ?? (multi ? undefined : (f.localName ?? undefined));
    if (!localName) {
      localName = readEmbeddedName(diskPath, multi) ?? f.name;
      // For a multi-weight family the per-file full name is the correct value,
      // so auto-reading it is the intended path — only nag for single fonts.
      if (!multi) {
        warnings.push(
          `localName for "${f.name}" auto-read from TTF -> "${localName}" (add it to fonts.json to lock it)`,
        );
      }
    }

    for (const id of detectLanguages(diskPath)) {
      if (!excluded.has(id)) languageIds.add(id);
    }

    return {
      weight,
      italic,
      label: variantLabel(weight, italic),
      filePath: `/${author.folder}/${v.file}`,
      downloadFileName: v.file,
      localName,
    };
  });

  // Sort upright weights first, then italics — the order shown in the selector.
  variants.sort((a, b) => Number(a.italic) - Number(b.italic) || a.weight - b.weight);

  for (const id of excluded) warnings.push(`"${f.name}" excludes language "${id}" (manual override in fonts.json)`);
  const languages = [...languageIds];
  if (languages.length === 0) warnings.push(`"${f.name}" supports no detected Myanmar language (file missing or unreadable?)`);

  // Default = the upright weight nearest 400 (that's what the card previews).
  const upright = variants.filter((v) => !v.italic);
  const pool = upright.length ? upright : variants;
  const def = pool.reduce((best, v) =>
    Math.abs(v.weight - 400) < Math.abs(best.weight - 400) ? v : best,
  );

  return {
    id: `${f.author}:${f.name}`,
    displayName: f.name,
    category: f.author,
    filePath: def.filePath,
    cssFamily,
    previewFamily: `MMFont-${normalizeForFamily(cssFamily)}`,
    localName: def.localName,
    downloadFileName: def.downloadFileName,
    languages,
    variants,
    defaultWeight: def.weight,
    defaultItalic: def.italic,
  };
});

// drift check: any .ttf on disk not listed in fonts.json
for (const author of data.authors) {
  let onDisk: string[] = [];
  try {
    onDisk = readdirSync(join(PUBLIC_DIR, author.folder)).filter((n) => /\.ttf$/i.test(n));
  } catch {
    warnings.push(`folder public/${author.folder} not found`);
    continue;
  }
  const listed = jsonFilesByFolder.get(author.folder) ?? new Set();
  for (const file of onDisk) {
    if (!listed.has(file)) warnings.push(`public/${author.folder}/${file} is on disk but NOT in fonts.json`);
  }
}

// --- emit fontCatalog.generated.ts -----------------------------------------
const fontsByAuthor = new Map<string, EnrichedFont[]>();
for (const f of enriched) {
  if (!fontsByAuthor.has(f.category)) fontsByAuthor.set(f.category, []);
  fontsByAuthor.get(f.category)!.push(f);
}

const keyUnion = data.authors.map((a) => JSON.stringify(a.key)).join(" | ");

const catalogLiteral = data.authors
  .map((a) => {
    const fonts = (fontsByAuthor.get(a.key) ?? [])
      .map(
        (f) =>
          `      {\n` +
          `        id: ${JSON.stringify(f.id)},\n` +
          `        displayName: ${JSON.stringify(f.displayName)},\n` +
          `        category: ${JSON.stringify(f.category)},\n` +
          `        filePath: ${JSON.stringify(f.filePath)},\n` +
          `        cssFamily: ${JSON.stringify(f.cssFamily)},\n` +
          `        previewFamily: ${JSON.stringify(f.previewFamily)},\n` +
          `        localName: ${JSON.stringify(f.localName)},\n` +
          `        downloadFileName: ${JSON.stringify(f.downloadFileName)},\n` +
          `        languages: ${JSON.stringify(f.languages)},\n` +
          `        defaultWeight: ${f.defaultWeight},\n` +
          `        defaultItalic: ${f.defaultItalic},\n` +
          `        variants: [\n` +
          f.variants
            .map(
              (v) =>
                `          { weight: ${v.weight}, italic: ${v.italic}, label: ${JSON.stringify(v.label)}, ` +
                `filePath: ${JSON.stringify(v.filePath)}, downloadFileName: ${JSON.stringify(v.downloadFileName)}, ` +
                `localName: ${JSON.stringify(v.localName)} },`,
            )
            .join("\n") +
          `\n        ],\n` +
          `      },`,
      )
      .join("\n");
    return (
      `  {\n` +
      `    key: ${JSON.stringify(a.key)},\n` +
      `    title: ${JSON.stringify(a.title)},\n` +
      `    description: ${JSON.stringify(a.description)},\n` +
      `    link: ${JSON.stringify(a.link ?? "")},\n` +
      `    fonts: [\n${fonts}\n    ],\n` +
      `  },`
    );
  })
  .join("\n");

// styles: name -> list of display names (in fonts.json order, style order from data.styles)
const stylesLiteral = data.styles
  .map((styleName) => {
    // dedupe display names (the same name can appear under multiple authors)
    const names = [...new Set(data.fonts.filter((f) => f.style === styleName).map((f) => f.name))].map((n) =>
      JSON.stringify(n),
    );
    return `  {\n    name: ${JSON.stringify(styleName)},\n    fonts: [${names.join(", ")}],\n  },`;
  })
  .join("\n");

// languages: id -> label, in unicode.js order, only those at least one font supports
const supportedLangIds = new Set(enriched.flatMap((f) => f.languages));
const languagesLiteral = MYANMAR_LANGUAGES.filter((l) => supportedLangIds.has(l.id))
  .map(
    (l) =>
      `  {\n    id: ${JSON.stringify(l.id)},\n    name: ${JSON.stringify(LANGUAGE_LABELS[l.id] ?? l.name)},\n  },`,
  )
  .join("\n");

const generatedTs = `// AUTO-GENERATED by scripts/generateFonts.ts from fonts.json.
// Do NOT edit by hand. Run \`bun run fonts\` to regenerate.

export type FontCategoryKey = ${keyUnion};

/** One weight/style of a family (Google-Fonts style: 400 Regular, 700 Bold, ...). */
export interface FontVariant {
  weight: number;
  italic: boolean;
  label: string;
  filePath: string;
  downloadFileName: string;
  localName: string;
}

export interface FontDefinition {
  id: string;
  displayName: string;
  category: FontCategoryKey;
  /** Default variant's file — kept for callers that don't care about weights. */
  filePath: string;
  cssFamily: string;
  previewFamily: string;
  localName: string;
  downloadFileName: string;
  languages: string[];
  /** Always at least one entry, sorted upright-first then by weight. */
  variants: FontVariant[];
  defaultWeight: number;
  defaultItalic: boolean;
}

export interface FontCategory {
  key: FontCategoryKey;
  title: string;
  description: string;
  link: string;
  fonts: FontDefinition[];
}

export interface StyleCategory {
  name: string;
  fonts: string[];
}

export interface LanguageCategory {
  id: string;
  name: string;
}

export const fontCatalog: FontCategory[] = [
${catalogLiteral}
];

export const allFonts: FontDefinition[] = fontCatalog.flatMap((category) => category.fonts);

export const fontStyleCategories: StyleCategory[] = [
${stylesLiteral}
];

export const fontLanguageCategories: LanguageCategory[] = [
${languagesLiteral}
];
`;

await Bun.write(join(ROOT, "src/data/fontCatalog.generated.ts"), generatedTs);

// --- emit public/mmfonts.css -----------------------------------------------
// Two kinds of rules per family:
//   1. weight-aware faces keyed by cssFamily — one per variant, so
//      `font-family: Padauk; font-weight: 700` picks the right file.
//   2. legacy faces + helper classes keyed by filename (kept so existing
//      pages using `.Padauk-Bold` don't break).
const css =
  enriched
    .map((f) => {
      const familyFaces = f.variants
        .map(
          (v) =>
            `@font-face {\n` +
            `    font-family:"${f.cssFamily}";\n` +
            `    font-style: ${v.italic ? "italic" : "normal"};\n` +
            `    font-weight: ${v.weight};\n` +
            `    src:local('${v.localName}'),url('.${v.filePath}') format('truetype');\n` +
            `}\n`,
        )
        .join("");

      const legacy = f.variants
        .map((v) => {
          const fam = v.downloadFileName.replace(/\.[^.]+$/, ""); // family = filename without extension
          const face =
            fam === f.cssFamily
              ? "" // already emitted above under the same name
              : `@font-face {\n` +
                `    font-family:"${fam}";\n` +
                `    src:local('${v.localName}'),url('.${v.filePath}') format('truetype');\n` +
                `}\n`;
          return `${face}.${fam} {\n    font-family: "${fam}";\n}\n`;
        })
        .join("");

      return familyFaces + legacy;
    })
    .join("\n") + "\n";

await Bun.write(join(PUBLIC_DIR, "mmfonts.css"), css);

// --- report ----------------------------------------------------------------
console.log(`Generated ${enriched.length} fonts across ${data.authors.length} authors.`);
console.log(`  -> src/data/fontCatalog.generated.ts`);
console.log(`  -> public/mmfonts.css`);
if (warnings.length) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const w of warnings) console.log(`  ! ${w}`);
}
