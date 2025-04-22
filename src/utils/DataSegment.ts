import { NULL_POINTER } from "../constants";

class DataSegment implements Disposable {
  dataOffset: number | null;

  constructor(ptr: number) {
    /**
     * `ptr` must ALWAYS exist (e.g. be non-null) when creating a new instance.
     * - Checking if `this.dataOffset` is `null` will always be a valid check to
     *   see if the instance has been deleted or not.
     * - Many C functions return `null` as a failure state, which should not
     *   fail silently
     * - Checking if `.dataOffset === null` AND `.dataOffset === 0` is unclear
     * - If the output is the null pointer, instead of returning the wrapper
     *   class, it should return null (e.g. `DataSegment | null` and not
     *   `DataSegment`)
     */
    if (ptr === NULL_POINTER) {
      throw new RangeError("Constructor called with null pointer");
    }
    this.dataOffset = ptr;
  }

  /* While it would be tempting to throw an error in this function if
   * `this.dataOffset` is `null`, it would prevent some valid use cases such as
   * checking if a pointer exists.
   */
  getValue(): number {
    return this.dataOffset ?? NULL_POINTER;
  }

  /**
   * `.delete()` is the convention Emscripten uses for freeing memory. For this
   * base class, it does not free the pointer and only sets it to `null` since
   * some convenience functions exist that free more than one pointer
   */
  delete(): void {
    this.dataOffset = null;
  }

  /**
   * Implements the `Disposable` interface as part of the ECMAScript Explicit
   * Ressource Management proposal. This way, users can either dispose resources
   * imperatively (`.delete()`) or declaratively (`using`)
   *
   * @see {@link https://github.com/tc39/proposal-explicit-resource-management}
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management}
   */
  [Symbol.dispose]() {
    this.delete();
  }
}

export { DataSegment };
