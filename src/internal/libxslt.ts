import { libxslt } from "./module.ts";

export const {
  // <libxslt/extensions.h>
  _xsltInitGlobals: xsltInitGlobals,
  // <libxslt/extra.h>
  _xsltRegisterAllExtras: xsltRegisterAllExtras,
  // <libxslt/transform.h>
  _xsltApplyStylesheet: xsltApplyStylesheet,
  // <libxslt/xslt.h>
  _xsltCleanupGlobals: xsltCleanupGlobals,
  _xsltInit: xsltInit,
  // <libxslt/xsltInternals.h>
  _xsltFreeStylesheet: xsltFreeStylesheet,
  _xsltLoadStylesheetPI: xsltLoadStylesheetPI,
  _xsltParseStylesheetDoc: xsltParseStylesheetDoc,
  // <libxslt/xsltutils.h>
  _xsltSaveResultToFile: xsltSaveResultToFile,
  _xsltSaveResultTo: xsltSaveResultTo,
  // exslt
  _exsltCommonRegister: exsltCommonRegister,
  _exsltDateRegister: exsltDateRegister,
  _exsltDynRegister: exsltDynRegister,
  _exsltFuncRegister: exsltFuncRegister,
  _exsltMathRegister: exsltMathRegister,
  _exsltRegisterAll: exsltRegisterAll,
  _exsltSaxonRegister: exsltSaxonRegister,
  _exsltSetsRegister: exsltSetsRegister,
  _exsltStrRegister: exsltStrRegister,
} = libxslt;
