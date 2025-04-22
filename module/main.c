#include <string.h>
#include <emscripten.h>
#include <libxml/parser.h>
#include <libxml/uri.h>
#include <libxslt/xsltutils.h>

EM_ASYNC_JS(void, fetchBytes, (const char *url, void **pbuffer, int *pnum, int *perror), {
  const response = await fetch(UTF8ToString(url), {
    // Prioritize XML documents (including application/*+xml) based on MIME type
    headers: {
      "Accept": "application/xslt+xml, application/xml, text/xml, application/xhtml+xml;q=0.8, application/*; q=0.6, */*;q=0.5",
    }
  });

  if (!response.ok) {
    setValue(pbuffer, 0, "i32");
    setValue(pnum, 0, "i32");
    setValue(perror, response.status, "i32");
  } else {
    const responseBytes = await response.bytes();
    const bufferToFill =
        _malloc(responseBytes.length * responseBytes.BYTES_PER_ELEMENT);
    // In future (WASM 2.0), use mass memory copy
    HEAPU8.set(responseBytes, bufferToFill);
    setValue(pnum, responseBytes.length, "i32");
    setValue(perror, 0, "i32");
    setValue(pbuffer, bufferToFill, "*");
  }
});

/**
 * Since `xmlDefaultExternalEntityLoader` is not exported in
 * <libxml/parserInternals.h>, the default external entity loader is stored in a
 * global variable after running `xmlGetExternalEntityLoader()`
 *
 * @see <a href="https://gitlab.gnome.org/GNOME/libxml2/-/blob/master/parserInternals.c#L2569">parserInternals.c</a>
 */
static xmlExternalEntityLoader defaultExternalEntityLoader = NULL;

xmlParserInputPtr EMSCRIPTEN_KEEPALIVE libxsltWasmExternalEntityLoader(
    const char *URL, const char *ID, xmlParserCtxtPtr context) {
  xmlParserInputPtr result = NULL;
  xmlURIPtr uri = xmlParseURI(URL);

  if (uri != NULL) {
    // Node.js undici does not support fetching `file://` URLs
    int isFile = (uri->scheme == NULL || (strcmp(uri->scheme, "file") == 0));
    xmlFreeURI(uri);

    if (!isFile) {
      void *fetchBuffer;
      int numBytes, error;

      fetchBytes(URL, &fetchBuffer, &numBytes, &error);

      if (error != 0) {
        xmlParserError(
            context,
            "fetchExternalEntity() failed on %s, id %s with status code %d\n",
            URL, ID, error);
        return NULL;
      } else if (fetchBuffer == NULL) {
        xmlParserError(
            context,
            "memory allocation failed in fetchExternalEntity() on %s, id %s\n",
            URL, ID);
        return NULL;
      } else {
        xmlParserInputPtr input = xmlNewInputFromMemory(
            URL, fetchBuffer, numBytes, XML_INPUT_BUF_ZERO_TERMINATED);
        free(fetchBuffer);
        return input;
      }
    }
  }

  if (defaultExternalEntityLoader != NULL) {
    return defaultExternalEntityLoader(URL, ID, context);
  }

  return NULL;
}

int EMSCRIPTEN_KEEPALIVE main() {
  xmlInitParser();
  defaultExternalEntityLoader = xmlGetExternalEntityLoader();
  xmlSetExternalEntityLoader(libxsltWasmExternalEntityLoader);
  xsltInit();
  return 0;
}
