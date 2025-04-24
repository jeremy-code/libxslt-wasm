import { libxslt } from "./module.ts";

export const {
  // <libxml/HTMLtree.h>
  _htmlDocContentDumpFormatOutput: htmlDocContentDumpFormatOutput,

  // <libxml/encoding.h>
  _xmlDetectCharEncoding: xmlDetectCharEncoding,

  // <libxml/parser.h>
  _xmlCleanupParser: xmlCleanupParser,
  _xmlGetExternalEntityLoader: xmlGetExternalEntityLoader,
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
  _xmlReadDoc: xmlReadDoc,
  _xmlReadFd: xmlReadFd,
  _xmlReadFile: xmlReadFile,
  _xmlReadIO: xmlReadIO,
  _xmlReadMemory: xmlReadMemory,

  // <libxml/tree.h>
  _xmlDocDump: xmlDocDump,
  _xmlDocFormatDump: xmlDocFormatDump,
  _xmlNodeDumpOutput: xmlNodeDumpOutput,
  _xmlFreeDoc: xmlFreeDoc,

  // <libxml/io.h>
  _xmlAllocOutputBuffer: xmlAllocOutputBuffer,
  _xmlOutputBufferClose: xmlOutputBufferClose,
  _xmlOutputBufferCreateFd: xmlOutputBufferCreateFd,
  _xmlOutputBufferCreateFile: xmlOutputBufferCreateFile,
  _xmlOutputBufferCreateFilename: xmlOutputBufferCreateFilename,
  _xmlOutputBufferGetContent: xmlOutputBufferGetContent,
  _xmlOutputBufferGetSize: xmlOutputBufferGetSize,
  _xmlOutputBufferWrite: xmlOutputBufferWrite,

  // <libxml/string.h>
  _xmlCharStrdup: xmlCharStrdup,
} = libxslt;

export const { xmlCharEncoding } = libxslt;
