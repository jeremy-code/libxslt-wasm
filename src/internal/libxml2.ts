import { libxslt } from "./module.ts";

export const {
  // <libxml/HTMLtree.h>
  _htmlDocContentDumpFormatOutput: htmlDocContentDumpFormatOutput,

  // <libxml/encoding.h>
  _xmlDetectCharEncoding: xmlDetectCharEncoding,
  _xmlLookupCharEncodingHandler: xmlLookupCharEncodingHandler,
  _xmlParseCharEncoding: xmlParseCharEncoding,

  // <libxml/parser.h>
  _xmlCleanupParser: xmlCleanupParser,
  _xmlGetExternalEntityLoader: xmlGetExternalEntityLoader,
  _xmlHasFeature: xmlHasFeature,
  _xmlInitParser: xmlInitParser,
  _xmlInputSetEncodingHandler: xmlInputSetEncodingHandler,
  _xmlLoadExternalEntity: xmlLoadExternalEntity,
  _xmlNewInputFromFd: xmlNewInputFromFd,
  _xmlNewInputFromIO: xmlNewInputFromIO,
  _xmlNewInputFromMemory: xmlNewInputFromMemory,
  _xmlNewInputFromString: xmlNewInputFromString,
  _xmlNewInputFromUrl: xmlNewInputFromUrl,
  _xmlParseDTD: xmlParseDTD,
  _xmlParseEntity: xmlParseEntity,
  _xmlParseFile: xmlParseFile,
  _xmlParseMemory: xmlParseMemory,
  _xmlReadDoc: xmlReadDoc,
  _xmlReadFd: xmlReadFd,
  _xmlReadFile: xmlReadFile,
  _xmlReadIO: xmlReadIO,
  _xmlReadMemory: xmlReadMemory,
  _xmlSetExternalEntityLoader: xmlSetExternalEntityLoader,

  // <libxml/tree.h>
  _xmlDocDump: xmlDocDump,
  _xmlDocDumpFormatMemory: xmlDocDumpFormatMemory,
  _xmlDocDumpFormatMemoryEnc: xmlDocDumpFormatMemoryEnc,
  _xmlDocDumpMemory: xmlDocDumpMemory,
  _xmlDocDumpMemoryEnc: xmlDocDumpMemoryEnc,
  _xmlDocFormatDump: xmlDocFormatDump,
  _xmlDocGetRootElement: xmlDocGetRootElement,
  _xmlDocSetRootElement: xmlDocSetRootElement,
  _xmlFreeDoc: xmlFreeDoc,
  _xmlFreeDtd: xmlFreeDtd,
  _xmlGetDocCompressMode: xmlGetDocCompressMode,
  _xmlGetIntSubset: xmlGetIntSubset,
  _xmlNodeDump: xmlNodeDump,
  _xmlNodeDumpOutput: xmlNodeDumpOutput,
  _xmlSaveFileTo: xmlSaveFileTo,
  _xmlSaveFormatFile: xmlSaveFormatFile,
  _xmlSaveFormatFileEnc: xmlSaveFormatFileEnc,
  _xmlSaveFormatFileTo: xmlSaveFormatFileTo,

  // <libxml/xinclude.h>
  _xmlXIncludeFreeContext: xmlXIncludeFreeContext,
  _xmlXIncludeGetLastError: xmlXIncludeGetLastError,
  _xmlXIncludeNewContext: xmlXIncludeNewContext,
  _xmlXIncludeProcess: xmlXIncludeProcess,
  _xmlXIncludeProcessFlags: xmlXIncludeProcessFlags,
  _xmlXIncludeProcessFlagsData: xmlXIncludeProcessFlagsData,

  // <libxml/xmlIO.h>
  _xmlAllocOutputBuffer: xmlAllocOutputBuffer,
  _xmlCheckFilename: xmlCheckFilename,
  _xmlOutputBufferClose: xmlOutputBufferClose,
  _xmlOutputBufferCreateFd: xmlOutputBufferCreateFd,
  _xmlOutputBufferCreateFile: xmlOutputBufferCreateFile,
  _xmlOutputBufferCreateFilename: xmlOutputBufferCreateFilename,
  _xmlOutputBufferGetContent: xmlOutputBufferGetContent,
  _xmlOutputBufferGetSize: xmlOutputBufferGetSize,
  _xmlOutputBufferWrite: xmlOutputBufferWrite,
  _xmlOutputBufferWriteString: xmlOutputBufferWriteString,

  // <libxml/xmlerror.h>
  _xmlGetLastError: xmlGetLastError,
  _xmlResetLastError: xmlResetLastError,

  // <libxml/xmlstring.h>
  _xmlCharStrdup: xmlCharStrdup,
  _xmlCheckUTF8: xmlCheckUTF8,

  // <libxml/xpath.h>
  _xmlXPathOrderDocElems: xmlXPathOrderDocElems,
} = libxslt;

export const { xmlCharEncoding } = libxslt;
