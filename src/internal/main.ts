import { libxslt } from "./module";

// `main.c`
export const {
  _init: init,
  _cleanup: cleanup,
  _fetchExternalEntity: fetchExternalEntity,
  _libxsltWasmExternalEntityLoader: libxsltWasmExternalEntityLoader,
  _free: free,
  _malloc: malloc,
} = libxslt;
