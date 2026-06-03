# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A React + TypeScript + Tailwind single-page app that previews and lets users download Myanmar Unicode fonts. Built with Create React App (`react-scripts`). The deployed site is `https://font.saturngod.net`, served from the repo's `docs/` folder (GitHub Pages).

## Commands

Run all from `source_code/reactjs/`:

- `bun run fonts` — regenerate font data from `fonts.json` (see below). Run after editing `fonts.json` or adding a `.ttf`.
- `npm start` — dev server
- `npm run build` — production build, then copies `build/*` into `../../docs/`
- `npm run production` — same as build but with `PUBLIC_URL=https://font.saturngod.net` (use this for the live site)
- `npm test` — Jest + React Testing Library (CRA watch mode). Run a single test: `npm test -- src/__tests__/App.integration.test.tsx`

`bun.lock`, `package-lock.json` both exist; npm is the documented tool.

## `fonts.json` is the single source of truth

`fonts.json` (in `source_code/reactjs/`) defines every font, author, and style. **It is the only file you edit to add/change fonts.** `bun run fonts` (`scripts/generateFonts.ts`) reads it and emits:

- `src/data/fontCatalog.generated.ts` — the typed catalog + style data the app imports (all derived fields precomputed: `id`, `cssFamily`, `previewFamily`, `localName`, `filePath`). **Never edit this file by hand** — it's regenerated.
- `public/mmfonts.css` — the global `@font-face` stylesheet linked from `index.html`.

`fonts.json` shape:
- `authors[]` — `{ key, title, description, folder, cssSuffix }`. `folder` is the `public/` subfolder; `title` is the **author name** shown in the sidebar.
- `styles[]` — ordered list of style category names.
- `fonts[]` — `{ name, author, file, style, localName? }`. `localName` is optional; if omitted the generator reads the embedded family name from the TTF.

The generator also **warns** if a `.ttf` exists in `public/<folder>/` but isn't in `fonts.json`, or if a font has no/unknown `style` — so the JSON can't silently drift from the actual files.

`src/data/fontCatalog.ts` and `src/data/styleCategories.ts` are now thin layers: they re-export the generated data and keep the runtime helpers (`getCdnFontUrl`, `getPublicFontUrl`, `getFontsByCategory`, `normalizeFontName`, `getStyleAllowedNames`). URL helpers can't be precomputed because they depend on `process.env.PUBLIC_URL`.

Derived-field rules (handled by the generator):
- `cssFamily` — appends the author `cssSuffix` **only when a `name` is duplicated** across authors (e.g. `MyanmarAngoun` in both `khmer` and `unknown`). Otherwise the bare name.
- `previewFamily` — `MMFont-<normalized cssFamily>`, the unique runtime face name.

## Two font-loading paths at runtime

1. **Runtime preview faces** (`src/components/fontBox.tsx`) — the React app injects its own `@font-face` rules into a single `<style id="mmfont-preview-faces">` tag, one per font, deduped via an in-memory `Set`, using the unique `previewFamily` so previews never collide. **This is what the live preview grid uses.**
2. **Global stylesheet** (`public/mmfonts.css`) — generated, linked from `index.html`; provides `local()`-first faces keyed by filename. Legacy/global helper.

The copy-CSS and download buttons in `fontBox` point at a **jsDelivr CDN** URL (`getCdnFontUrl`), not local files — fonts are served from the GitHub repo via CDN for end users.

## Two independent filter axes

Fonts are filtered by **author category** (the `fontCatalog` grouping) AND **style category**, plus a search term. These are orthogonal:

- Author categories come from `fontCatalog` (the `category` field).
- Style categories live in `src/data/styleCategories.ts` (Handwritten, Sans-Serif, Serif, Rounded, Square, Typewriter, Display). They reference fonts by `displayName`.

Name matching for style filters goes through `normalizeFontName` (strips whitespace) in `styleCategories.ts` — this is the **single place** that normalization lives, used by both the sidebar counts and `MainContent`'s filter. Keep it that way. `getStyleAllowedNames` returns `null` for "all"/unknown (meaning no restriction).

`MainContent.tsx` applies all three filters; `Sidebar.tsx` computes the category/style counts using the same helpers.

## State

`src/Context/mmfontContext.tsx` holds all view settings (font size, line height, preview text, grid toggle, search term, panel collapse) and persists most of them to `localStorage` via a `StorageType` enum. The selected author/style categories are **not** persisted (in-memory only). `toastContext.tsx` handles toast notifications.

## Adding a new font

1. Copy the `.ttf` into `public/<author-folder>/`. (New author? create the folder and add an `authors[]` entry to `fonts.json`.)
2. Add one entry to `fonts[]` in `fonts.json`: `{ "name", "author", "file", "style" }` (`localName` optional).
3. `bun run fonts` — regenerates the catalog + CSS and reports warnings.
4. `bun run production` (or `npm run production`).

Do **not** hand-edit `src/data/fontCatalog.generated.ts`. The legacy `source_code/buildCSS/` flow is obsolete.
