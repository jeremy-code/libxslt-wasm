import { libxslt } from "./module.ts";

export const {
  // <stdlib.h>
  _calloc: calloc,
  _free: free,
  _malloc: malloc,
  _realloc: realloc,

  // `main.c`
  _main: main,
  _libxsltWasmExternalEntityLoader: libxsltWasmExternalEntityLoader,
} = libxslt;
