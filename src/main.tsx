// @ts-nocheck
// Fix for "Uncaught TypeError: Cannot set property fetch of #<Window> which has only a getter"
// This error happens when a library tries to polyfill fetch in an environment where window.fetch is read-only.
// This must be at the very top, before any other imports.
if (typeof window !== 'undefined') {
  (function() {
    try {
      const originalFetch = window.fetch;
      if (originalFetch) {
        Object.defineProperty(window, 'fetch', {
          get: () => originalFetch,
          set: (v) => { console.warn('Ignored attempt to overwrite window.fetch with:', v); },
          configurable: true,
          enumerable: true
        });
      }
    } catch (e) {
      console.warn('Could not redefine window.fetch setter in main.tsx:', e);
    }
  })();
}

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
