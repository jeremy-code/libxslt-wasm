import { libxslt } from "./module.ts";

export const {
  // <libxslt/transform.h>
  _xsltApplyStylesheet: xsltApplyStylesheet,

  // <libxslt/xsltInternals.h>
  _xsltFreeStylesheet: xsltFreeStylesheet,
  _xsltLoadStylesheetPI: xsltLoadStylesheetPI,
  _xsltParseStylesheetDoc: xsltParseStylesheetDoc,

  // <libxslt/xsltutils.h>
  _xsltSaveResultTo: xsltSaveResultTo,
} = libxslt;
