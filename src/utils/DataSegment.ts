class DataSegment implements Disposable {
  dataOffset: number | null;

  constructor(ptr: number) {
    /**
     * `ptr` must ALWAYS exist (e.g. be non-null) when creating a new instance.
     * This way, checking if `this.dataOffset` is `null` will always be a valid
     * check to see if the instance has been deleted or not.
     */
    if (ptr === 0) {
      throw new RangeError("constructor called with null pointer");
    }
    this.dataOffset = ptr;
  }

  /**
   * Emscripten represents a `ptr` as a `number` where NULL is 0. Unfortunately,
   * in WebAssembly, 0 is a valid location in memory. While it would be tempting
   * to throw an error in this function if `this.dataOffset` is `null`, it would
   * prevent some valid use cases such as checking if a pointer exists and if
   * not, allocating it.
   */
  getValue(): number {
    return this.dataOffset ?? 0;
  }

  /**
   * `.delete()` is the convention Emscripten uses for freeing memory. For this
   * base class, it only sets the pointer to `null` since some convenience
   * functions exist that free other pointers in addition to itself such as for
   * structs.
   */
  delete(): void {
    this.dataOffset = null;
  }

  /**
   * Implements the `Disposable` interface as part of the ECMAScript Explicit
   * Ressource Management proposal
   *
   * @see {@link https://github.com/tc39/proposal-explicit-resource-management}
   * @see {@link https://www.typescriptlang.org/docs/handbook/release-notes/typescript-5-2.html#using-declarations-and-explicit-resource-management}
   */
  [Symbol.dispose]() {
    this.delete();
  }
}

export { DataSegment };
