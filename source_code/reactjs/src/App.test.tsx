import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import { FontProvider } from './Context/mmfontContext';

// Mock font components to avoid complex dependencies
jest.mock('./components/khmerfont', () => ({
  KhmerFont: () => <div data-testid="khmer-font">KhmerFont</div>
}));

jest.mock('./components/masterpieceFont', () => ({
  MasterPieceFont: () => <div data-testid="masterpiece-font">MasterPieceFont</div>
}));

jest.mock('./components/unknownFont', () => ({
  UnknwonFont: () => <div data-testid="unknown-font">UnknownFont</div>
}));

jest.mock('./components/otherFont', () => ({
  OtherFont: () => <div data-testid="other-font">OtherFont</div>
}));

test('renders Myanmar Font Preview app', () => {
  render(
    <FontProvider>
      <App />
    </FontProvider>
  );

});
