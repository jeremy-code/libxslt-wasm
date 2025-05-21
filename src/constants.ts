import { getNativeTypeSize } from "./internal/emscripten.ts";

// 4 bytes by default, 8 bytes if `MEMORY64` is enabled
// https://emscripten.org/docs/tools_reference/settings_reference.html#memory64
const POINTER_SIZE: number = getNativeTypeSize("*");

/**
 * Emscripten represents a `ptr` as a `number` where `NULL` is `0`. This is true
 * for the output of any C functions and of the emitted TypeScript.
 *
 * Unfortunately, in WebAssembly, 0 is a valid location in memory.
 *
 * @remarks Every instance of 0 is not necessarily a null pointer; it can
 * indicate just a regular `int`
 */
const NULL_POINTER = 0;

export { NULL_POINTER, POINTER_SIZE };
