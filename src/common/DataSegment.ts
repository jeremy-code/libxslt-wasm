import { NULL_POINTER } from "../constants.ts";
import { ptrToString } from "../internal/emscripten.ts";

abstract class DataSegment implements Disposable {
  /**
   * The location of the data segment in memory in bytes. Value is established
   * when instance is constructed and cannot be changed
   */
  readonly byteOffset: number;

  /**
   * Given a non-zero pointer to some data segment in memory, creates a new
   * instance of the data segment as a wrapper class
   */
  constructor(byteOffset: number) {
    /**
     * `ptr` must ALWAYS exist (e.g. be non-null) when creating a new instance.
     * - Many C functions return `null` as a failure state, which should not
     *   fail silently
     * - If the output is the null pointer, instead of returning the wrapper
     *   class, it should return null (e.g. `DataSegment | null` and not
     *   `DataSegment`)
     */
    if (byteOffset === NULL_POINTER) {
      throw new RangeError("Constructor called with null pointer (0)");
    }
    this.byteOffset = byteOffset;
  }

  getValue(): number {
    return this.byteOffset;
  }

  toString(): string {
    return ptrToString(this.byteOffset);
  }

  /**
   * Deallocates the memory used by the data segment
   *
   * @remarks `.delete()` is the convention Emscripten uses for freeing memory
   */
  abstract delete(): void;

  /**
   *
   *
   * Implements the `Disposable` interface as part of the ECMAScript Explicit
   * Ressource Management proposal. This way, users can either dispose resources
   * imperatively (`.delete()`) or declaratively (`using`)
   *
   * @see {@link https://github.com/tc39/proposal-explicit-resource-management}
   * @see {@link https://v8.dev/features/explicit-resource-management}
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management}
   */
  [Symbol.dispose](): void {
    this.delete();
  }
}

export { DataSegment };
