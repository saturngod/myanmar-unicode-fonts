Rewrite with ReactJS and Tailwind for myanmar font preview. All the source codes are under source code folder.

To build CSS

```
cd source_code/buildCSS
node buildfont.js
```

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

- Add font in source_code/buildCSS
- Update in `buildfont.js` , `var text = typesCSS("NewFont")`
- Run `node buildfont.js`
- copy `mmfonts.css` to `reactjs/public/mmfonts.css`
- copy new font folder to `reactjs/public/`
- clone component `src/components/khmerfont.tsx` to `src/components/newfont.tsx`
- update fonts in `src/components/newfont.tsx`
- update `fontBox.tsx` , to add new font file for download
- rebuild again
