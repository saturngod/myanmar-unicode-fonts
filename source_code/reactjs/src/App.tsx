import { useContext, useState } from 'react';
import './App.css';
import { KhmerFont } from './components/khmerfont';
import { MasterPieceFont } from './components/masterpieceFont';
import { UnknwonFont } from './components/unknownFont';
import { OtherFont } from './components/otherFont';
import { FontContext } from './Context/mmfontContext';

function App() {

  const { fontSize, changeFontSize, lineHeight, changeLineHeight, previewText, changePreviewText, grid, toggleGrid } = useContext(FontContext) || {};


  return (
    <div className='container mx-auto'>
      <h1 className='text-2xl font-bold mb-2 mt-4'>Myanmar Font Preview</h1>

      <textarea rows={4} name='previewText' className='border border-gray-300 rounded-md p-2 mt-2 w-full' value={previewText} onChange={e => changePreviewText?.(e.target.value)} />

      <div className='mt-4 mb-8'>
        <div className='inline'>
          <span className='pr-2'>Font Size:</span>
          <input type='range' min="10" max="32" value={fontSize} id="fontSize" onChange={e => changeFontSize?.(Number(e.target.value))} />
          <label htmlFor="fontSize" className='pl-2 font-bold'>{fontSize}px</label>
        </div>

        <div className='inline pl-4'>
          <span className='pr-2'>Line Height:</span>
          <input type='range' min="1" max="3" value={lineHeight} id="fontSize" step={0.1} onChange={e => changeLineHeight?.(Number(e.target.value))} />
          <label htmlFor="fontSize" className='pl-2 font-bold'>{lineHeight}</label>
        </div>

        <div className='inline pl-4'>
          <span className='pr-2'>Show Grid:</span>
          <input type='checkbox' id="grid" checked={grid} onChange={e => toggleGrid?.(e.target.checked)} />
        </div>
      </div>

      <KhmerFont />
      <MasterPieceFont />
      <UnknwonFont />
      <OtherFont />

    </div>
  );
}

export default App;
