import { libxslt } from "./module.ts";

export const {
  // <libxml/HTMLtree.h>
  _htmlDocContentDumpFormatOutput: htmlDocContentDumpFormatOutput,

  // <libxml/encoding.h>
  xmlCharEncoding,

  // <libxml/parser.h>
  xmlParserOption,
  _xmlReadDoc: xmlReadDoc,
  _xmlReadFile: xmlReadFile,
  _xmlReadMemory: xmlReadMemory,

  // <libxml/tree.h>
  _xmlFreeDoc: xmlFreeDoc,
  _xmlNodeDumpOutput: xmlNodeDumpOutput,

  // <libxml/xmlIO.h>
  _xmlAllocOutputBuffer: xmlAllocOutputBuffer,
  _xmlOutputBufferClose: xmlOutputBufferClose,
  _xmlOutputBufferGetContent: xmlOutputBufferGetContent,
  _xmlOutputBufferGetSize: xmlOutputBufferGetSize,
  _xmlOutputBufferWriteString: xmlOutputBufferWriteString,
} = libxslt;
