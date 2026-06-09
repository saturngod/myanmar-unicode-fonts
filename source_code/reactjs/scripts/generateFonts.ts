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
interface FontEntry {
  name: string;
  author: string;
  file: string;
  localName?: string | null;
  style?: string | null;
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

// Read the embedded font-family name from a TTF (used when localName is omitted).
const readEmbeddedName = (filePath: string): string | null => {
  try {
    const buf = readFileSync(filePath);
    const numTables = buf.readUInt16BE(4);
    for (let i = 0; i < numTables; i++) {
      if (buf.toString("ascii", 12 + i * 16, 16 + i * 16) !== "name") continue;
      const tableOffset = buf.readUInt32BE(20 + i * 16);
      const count = buf.readUInt16BE(tableOffset + 2);
      const stringOffset = buf.readUInt16BE(tableOffset + 4);
      let preferred: string | null = null;
      let family: string | null = null;
      for (let j = 0; j < count; j++) {
        const rec = tableOffset + 6 + j * 12;
        const platformID = buf.readUInt16BE(rec);
        const encodingID = buf.readUInt16BE(rec + 2);
        const nameID = buf.readUInt16BE(rec + 6);
        const length = buf.readUInt16BE(rec + 8);
        const offset = buf.readUInt16BE(rec + 10);
        const strStart = tableOffset + stringOffset + offset;
        const swapped = Buffer.alloc(length);
        for (let k = 0; k < length - 1; k += 2) {
          swapped[k] = buf[strStart + k + 1];
          swapped[k + 1] = buf[strStart + k];
        }
        const val = swapped.toString("utf16le");
        if (nameID === 16 && platformID === 3 && encodingID === 1 && !preferred) preferred = val;
        if (nameID === 1 && platformID === 3 && encodingID === 1 && !family) family = val;
      }
      return preferred || family;
    }
  } catch {
    /* file missing - reported separately below */
  }
  return null;
};

// --- validate + warn -------------------------------------------------------
const warnings: string[] = [];

// duplicate display names across authors get a category suffix on cssFamily
const nameCounts = new Map<string, number>();
for (const f of data.fonts) nameCounts.set(f.name, (nameCounts.get(f.name) ?? 0) + 1);

const allowedStyles = new Set(data.styles);
const jsonFilesByFolder = new Map<string, Set<string>>();

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
}

const enriched: EnrichedFont[] = data.fonts.map((f) => {
  const author = authorByKey.get(f.author);
  if (!author) throw new Error(`Font "${f.name}" has unknown author "${f.author}"`);

  if (!jsonFilesByFolder.has(author.folder)) jsonFilesByFolder.set(author.folder, new Set());
  jsonFilesByFolder.get(author.folder)!.add(f.file);

  const filePath = `/${author.folder}/${f.file}`;
  const diskPath = join(PUBLIC_DIR, author.folder, f.file);

  let localName = f.localName ?? undefined;
  if (!localName) {
    localName = readEmbeddedName(diskPath) ?? f.name;
    warnings.push(`localName for "${f.name}" auto-read from TTF -> "${localName}" (add it to fonts.json to lock it)`);
  }
  if (!f.style) warnings.push(`"${f.name}" has no style`);
  else if (!allowedStyles.has(f.style)) warnings.push(`"${f.name}" has unknown style "${f.style}"`);

  const cssFamily = (nameCounts.get(f.name) ?? 0) > 1 ? `${f.name}-${author.cssSuffix}` : f.name;

  const languages = detectLanguages(diskPath);
  if (languages.length === 0) warnings.push(`"${f.name}" supports no detected Myanmar language (file missing or unreadable?)`);

  return {
    id: `${f.author}:${f.name}`,
    displayName: f.name,
    category: f.author,
    filePath,
    cssFamily,
    previewFamily: `MMFont-${normalizeForFamily(cssFamily)}`,
    localName,
    downloadFileName: f.file,
    languages,
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

export interface FontDefinition {
  id: string;
  displayName: string;
  category: FontCategoryKey;
  filePath: string;
  cssFamily: string;
  previewFamily: string;
  localName: string;
  downloadFileName: string;
  languages: string[];
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
const css =
  enriched
    .map((f) => {
      const fam = f.downloadFileName.replace(/\.[^.]+$/, ""); // family = filename without extension
      return (
        `@font-face {\n` +
        `    font-family:"${fam}";\n` +
        `    src:local('${f.localName}'),url('.${f.filePath}') format('truetype');\n` +
        `}\n` +
        `.${fam} {\n` +
        `    font-family: "${fam}";\n` +
        `}\n`
      );
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
