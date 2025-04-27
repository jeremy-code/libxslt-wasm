import { libxslt } from "./module.ts";

export const {
  // <libexslt/exslt.h>
  _exsltCommonRegister: exsltCommonRegister,
  // exsltCryptoRegister exists but `EXSLT_CRYPTO_ENABLED` is not defined
  _exsltDateRegister: exsltDateRegister,
  _exsltDynRegister: exsltDynRegister,
  _exsltFuncRegister: exsltFuncRegister,
  _exsltMathRegister: exsltMathRegister,
  _exsltRegisterAll: exsltRegisterAll,
  _exsltSaxonRegister: exsltSaxonRegister,
  _exsltSetsRegister: exsltSetsRegister,
  _exsltStrRegister: exsltStrRegister,
} = libxslt;
