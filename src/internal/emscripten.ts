import { libxslt } from "./module.ts";

export const {
  // Call compiled C functions. I avoid using these since I prefer having typing
  // with TypeScript (especially for number of parameters)
  ccall,
  cwrap,

  // Access Memory
  getValue,
  setValue,

  // Conversion functions
  UTF8ToString,
  stringToUTF8,
  intArrayFromString,
  intArrayToString,
  writeArrayToMemory,

  // Run dependencies
  addRunDependency,
  removeRunDependency,

  lengthBytesUTF8,
  stringToUTF8Array,
  stringToNewUTF8,
  getNativeTypeSize,

  warnOnce,

  // FS
  FS_createPath,
  FS_createDataFile,
  FS_createPreloadedFile,
  FS_unlink,
  FS_createLazyFile,
  FS_createDevice,
} = libxslt;
