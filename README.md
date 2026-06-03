Rewrite with ReactJS and Tailwind for myanmar font preview. All the source codes are under source code folder.

To run react app

```
cd source_code/reactjs
npm start
```

To build

```
cd source_code/reactjs
npm run production
```

File will available at docs folder.

## Add New Font

`fonts.json` is the single source of truth. To add a font:

1. Copy the `.ttf` into `source_code/reactjs/public/<AuthorFolder>/`
   (e.g. `public/KhmerType/`). For a brand-new author, create the folder and
   add the author to the `authors` array in `fonts.json`.
2. Add one entry to the `fonts` array in `source_code/reactjs/fonts.json`:

   ```json
   { "name": "MyNewFont", "author": "khmer", "style": "Sans-Serif / Clean UI", "file": "MyNewFont.ttf" }
   ```

   `localName` is optional — if omitted it is read from the TTF automatically.
3. Run the generator:

   ```
   cd source_code/reactjs
   bun run fonts
   ```

   This regenerates `src/data/fontCatalog.generated.ts` and `public/mmfonts.css`,
   and warns about any `.ttf` on disk that is missing from `fonts.json` or any
   font without a `style`.
4. Build: `bun run production` (or `npm run production`).

> The old `buildCSS/buildfont.js` flow and per-category components are no longer
> used — everything derives from `fonts.json` now.
