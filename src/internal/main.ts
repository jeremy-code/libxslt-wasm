import { libxslt } from "./module.ts";

export const {
  // C
  _free: free,
  _malloc: malloc,
  _memcpy: memcpy,
  _memset: memset,

  // `main.c`
  _main: main,
  _libxsltWasmExternalEntityLoader: libxsltWasmExternalEntityLoader,
} = libxslt;
