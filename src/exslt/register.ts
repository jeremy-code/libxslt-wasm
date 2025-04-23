import {
  exsltCommonRegister,
  exsltDateRegister,
  exsltDynRegister,
  exsltFuncRegister,
  exsltMathRegister,
  exsltSetsRegister,
  exsltStrRegister,
  exsltRegisterAll,
} from "../internal/libxslt.ts";

// Corresponds to namespace "http://exslt.org/*"
const EXSLT_MODULES_MAP = {
  "dates-and-times": exsltDateRegister,
  dynamic: exsltDynRegister,
  common: exsltCommonRegister,
  functions: exsltFuncRegister,
  math: exsltMathRegister,
  // "regular-expressions": Doesn't seem to exist...?
  sets: exsltSetsRegister,
  strings: exsltStrRegister,
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
