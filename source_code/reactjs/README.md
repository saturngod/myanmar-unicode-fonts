# Myanmar Unicode Fonts

A React (Create React App) site to preview and download Myanmar Unicode fonts.
Fonts are grouped by author/category and rendered with live previews.

## Scripts

In the project directory:

- `npm start` — run dev server at [http://localhost:3000](http://localhost:3000)
- `npm test` — run the test runner
- `npm run build` — build for production into `build/`

## Project layout

```
source_code/
  buildCSS/                 # font sources + CSS generator
    buildfont.js            # reads .ttf files, generates mmfonts.css
    mmfonts.css             # generated output
    KhmerType/ masterpiece/ Aka/ ...   # one folder per category
  reactjs/
    public/
      mmfonts.css           # copy of generated CSS used by the app
      Aka/ KhmerType/ ...   # font files served to the browser
    src/
      data/fontCatalog.ts   # font catalog (categories, fonts, names)
      components/MainContent.tsx   # category colors
```

The React app does NOT read `mmfonts.css` directly for previews — it builds an
`@font-face` on the fly from `fontCatalog.ts` (see `components/fontBox.tsx`).
So the catalog is the source of truth for the app.

## How to add a new font

Say you want to add a new category **Foo** with font files `Foo-Regular.ttf`,
`Foo-Bold.ttf`.

### 1. Add the font files

Copy the `.ttf` files into BOTH folders:

```
source_code/buildCSS/Foo/Foo-Regular.ttf
source_code/reactjs/public/Foo/Foo-Regular.ttf
```

(`buildCSS/Foo` is used to generate the CSS; `public/Foo` is what the browser
downloads.)

### 2. Regenerate mmfonts.css

If you added a NEW category folder, register it in
`source_code/buildCSS/buildfont.js`:

```js
var text =
  typesCSS("KhmerType") + "\n" +
  ...
  typesCSS("Foo") + "\n" +     // add this line
  typesCSS("other");
```

Then run the generator and copy the result into `public/`:

```bash
cd source_code/buildCSS
node buildfont.js
cp mmfonts.css ../reactjs/public/mmfonts.css
```

(For an existing category you only add the `.ttf` files and re-run; no edit to
`buildfont.js` is needed.)

### 3. Update the font catalog

Edit `source_code/reactjs/src/data/fontCatalog.ts`:

**a. Add the category key** to `FontCategoryKey`:

```ts
export type FontCategoryKey =
  | "khmer"
  | ...
  | "foo"
  | "other";
```

**b. Add a CSS suffix** in `CATEGORY_CSS_SUFFIX` (used to disambiguate duplicate
font names across categories):

```ts
const CATEGORY_CSS_SUFFIX: Record<FontCategoryKey, string> = {
  ...
  foo: "Foo",
  other: "Other",
};
```

**c. Add the category and its fonts** to `BASE_CATEGORY_DATA`:

```ts
{
  key: "foo",
  title: "Foo",
  description: "Foo Myanmar Unicode font family.",
  fonts: [
    { displayName: "Foo-Regular", category: "foo", filePath: "/Foo/Foo-Regular.ttf" },
    { displayName: "Foo-Bold",    category: "foo", filePath: "/Foo/Foo-Bold.ttf" },
  ],
},
```

**d. Add the local install name** in `LOCAL_NAMES` — this is the name shown in
the generated `mmfonts.css` `local('...')` (the font's embedded family name).
Find it in `mmfonts.css` after step 2:

```ts
const LOCAL_NAMES: Record<string, string> = {
  ...
  "/Foo/Foo-Regular.ttf": "Foo",
  "/Foo/Foo-Bold.ttf": "Foo",
};
```

> `id`, `cssFamily`, `previewFamily` and `downloadFileName` are derived
> automatically — you don't set them.

### 4. Add a category color

If you added a NEW category, edit
`source_code/reactjs/src/components/MainContent.tsx` and add an entry to
`categoryColors` (TypeScript requires every category key):

```ts
const categoryColors: Record<FontCategoryKey, { bg: string; text: string; dot: string }> = {
  ...
  foo: { bg: "bg-teal-50", text: "text-teal-700", dot: "bg-teal-400" },
  ...
};
```

### 5. Verify

```bash
npm start
```

Check the new category appears with working previews and that download works.

## Checklist

- [ ] `.ttf` files in `buildCSS/<Category>/` and `public/<Category>/`
- [ ] New category registered in `buildfont.js`
- [ ] `mmfonts.css` regenerated and copied to `public/`
- [ ] `FontCategoryKey`, `CATEGORY_CSS_SUFFIX`, `BASE_CATEGORY_DATA`, `LOCAL_NAMES` updated
- [ ] `categoryColors` updated in `MainContent.tsx`
- [ ] Verified in the browser
