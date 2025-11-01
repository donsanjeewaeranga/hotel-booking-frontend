import { webcrypto as webcryptoNode, randomFillSync } from 'crypto';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Ensure a Web Crypto-like `globalThis.crypto.getRandomValues` exists
// when running Vite in Node. Some versions/environments don't expose
// the browser Web Crypto API, and Vite (or plugins) call
// `crypto.getRandomValues`. This shim prefers Node's webcrypto when
// available, otherwise provides a minimal `getRandomValues` using
// `randomFillSync`.
if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
  if (webcryptoNode && typeof webcryptoNode.getRandomValues === 'function') {
    globalThis.crypto = webcryptoNode;
  } else {
    // Minimal shim implementing getRandomValues for TypedArrays
    globalThis.crypto = {
      getRandomValues: (typedArray) => {
        if (!typedArray || typeof typedArray !== 'object' || typeof typedArray.byteLength !== 'number') {
          throw new TypeError('Expected an array-like object');
        }
        // randomFillSync accepts TypedArray / Buffer and fills it in-place
        randomFillSync(typedArray);
        return typedArray;
      }
    };
  }
}

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5274,
    strictPort: true,
    proxy: {
      '/api': {
        target: 'http://localhost:5039/api',
        changeOrigin: true
      }
    }
  }
});

