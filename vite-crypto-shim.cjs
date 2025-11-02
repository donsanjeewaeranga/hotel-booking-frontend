// Force a minimal crypto.getRandomValues implementation for Vite
const { randomFillSync } = require('crypto');

// Always override crypto to ensure consistent behavior
globalThis.crypto = {
  getRandomValues(buffer) {
    if (buffer.byteLength === undefined) {
      throw new TypeError('The argument must be an array-like object');
    }
    randomFillSync(buffer);
    return buffer;
  }
};
