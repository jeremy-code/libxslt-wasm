import { libxslt } from "./module";

// `main.c`
export const {
  _main: main,
  _libxsltWasmExternalEntityLoader: libxsltWasmExternalEntityLoader,
  _free: free,
  _malloc: malloc,
} = libxslt;
