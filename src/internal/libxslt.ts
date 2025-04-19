import { libxslt } from "./module";

// Libxslt
export const xsltInitGlobals = libxslt._xsltInitGlobals;
export const xsltRegisterAllExtras = libxslt._xsltRegisterAllExtras;
export const xsltApplyStylesheet = libxslt._xsltApplyStylesheet;
export const xsltCleanupGlobals = libxslt._xsltCleanupGlobals;
export const xsltInit = libxslt._xsltInit;
export const xsltLoadStylesheetPI = libxslt._xsltLoadStylesheetPI;
export const xsltFreeStylesheet = libxslt._xsltFreeStylesheet;
export const xsltSaveResultToFile = libxslt._xsltSaveResultToFile;

// Libxslt - EXSLT
export const exsltRegisterAll = libxslt._exsltRegisterAll;

export const xsltParseStylesheetDoc = libxslt._xsltParseStylesheetDoc;
