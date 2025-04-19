// Polyfill for XMLHttpRequest in Node.js for Emscripten Fetch API (XHR)
if (!globalThis.XMLHttpRequest) {
  globalThis.XMLHttpRequest = require("xmlhttprequest-ssl");
}
