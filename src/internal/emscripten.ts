import { libxslt } from "./module.ts";

export const {
  // preamble.js
  HEAPU8,

  // libcore.js
  ptrToString,
  getNativeTypeSize,

  // libstrings.js
  UTF8ToString,
  lengthBytesUTF8,
  stringToNewUTF8,

  // libgetvalue.js
  getValue,
  setValue,
} = libxslt;
