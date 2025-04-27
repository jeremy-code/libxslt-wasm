import {
  exsltCommonRegister,
  exsltDateRegister,
  exsltDynRegister,
  exsltFuncRegister,
  exsltMathRegister,
  exsltSetsRegister,
  exsltStrRegister,
  exsltRegisterAll,
  exsltSaxonRegister,
} from "../internal/libexslt.ts";

// Corresponds to namespace "http://exslt.org/*"
const EXSLT_MODULES_MAP = {
  common: exsltCommonRegister,
  math: exsltMathRegister,
  sets: exsltSetsRegister,
  functions: exsltFuncRegister,
  "dates-and-times": exsltDateRegister,
  strings: exsltStrRegister,
  // "regular-expressions": Doesn't seem to exist...?
  dynamic: exsltDynRegister,
  // "random"

  /**
   * Registers the SAXON extension module (`expression()`, `eval()`, `evaluate()`,
   * `line-number()`, `systemId()`)
   */
  saxon: exsltSaxonRegister,
};

const registerModule = (module: keyof typeof EXSLT_MODULES_MAP): void => {
  const exsltRegister = EXSLT_MODULES_MAP[module];

  if (exsltRegister === undefined) {
    throw new RangeError(
      `module must be one of ${Object.keys(EXSLT_MODULES_MAP).join(", ")}`,
    );
  }

  exsltRegister();
};

export { registerModule, exsltRegisterAll as registerAll };
