/* vite-crypto-shim.cjs
   Loaded via `node -r ./vite-crypto-shim.cjs` to ensure a
   `globalThis.crypto.getRandomValues` implementation exists before
   Vite (or its dependencies) run. Uses Node's webcrypto when
   available, otherwise falls back to randomFillSync.
*/
const { webcrypto, randomFillSync } = require('crypto');

if (!globalThis.crypto || typeof globalThis.crypto.getRandomValues !== 'function') {
  if (webcrypto && typeof webcrypto.getRandomValues === 'function') {
    globalThis.crypto = webcrypto;
  } else {
    globalThis.crypto = {
      getRandomValues: (typedArray) => {
        if (!typedArray || typeof typedArray !== 'object' || typeof typedArray.byteLength !== 'number') {
          throw new TypeError('Expected an array-like object');
        }
        randomFillSync(typedArray);
        return typedArray;
      }
    };
  }
}
