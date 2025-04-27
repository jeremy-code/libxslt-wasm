import { libxslt } from "./module.ts";

export const {
  // <libxslt/attributes.h>
  _xsltFreeAttributeSetsHashes: xsltFreeAttributeSetsHashes,
  _xsltResolveStylesheetAttributeSet: xsltResolveStylesheetAttributeSet,

  // <libxslt/extensions.h>
  _xsltInitGlobals: xsltInitGlobals,

  // <libxslt/extra.h>
  _xsltRegisterAllExtras: xsltRegisterAllExtras,

  // <libxslt/imports.h>
  _xsltNextImport: xsltNextImport,

  // <libxslt/transform.h>
  _xsltApplyStylesheet: xsltApplyStylesheet,
  _xsltGetXIncludeDefault: xsltGetXIncludeDefault,
  _xsltSetXIncludeDefault: xsltSetXIncludeDefault,

  // <libxslt/xslt.h>
  _xsltCleanupGlobals: xsltCleanupGlobals,
  _xsltInit: xsltInit,

  // <libxslt/xsltInternals.h>
  _xsltFreeStylesheet: xsltFreeStylesheet,
  _xsltLoadStylesheetPI: xsltLoadStylesheetPI,
  _xsltParseStylesheetDoc: xsltParseStylesheetDoc,
  _xsltParseStylesheetImportedDoc: xsltParseStylesheetImportedDoc,
  _xsltParseStylesheetProcess: xsltParseStylesheetProcess,
  _xsltUninit: xsltUninit,

  // <libxslt/xsltutils.h>
  _xsltSaveResultTo: xsltSaveResultTo,
  _xsltSaveResultToFile: xsltSaveResultToFile,
  _xsltXPathCompile: xsltXPathCompile,
  _xsltXPathCompileFlags: xsltXPathCompileFlags,
} = libxslt;
