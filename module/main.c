#include <string.h>
#include <emscripten.h>
#include <emscripten/emscripten.h>
#include <emscripten/fetch.h>
#include <emscripten/proxying.h>
#include <emscripten/threading.h>
#include <libxml/parser.h>
#include <libxml/uri.h>
#include <libxslt/xsltutils.h>
#include <pthread.h>

// `emscripten_fetch` must be called in a pthread to be synchronous
pthread_t fetchThread;
em_proxying_queue *proxyQueue = NULL;

/**
 * Since `xmlDefaultExternalEntityLoader` is not exported in
 * <libxml/parserInternals.h>, the default external entity loader is stored in a
 * global variable after running `xmlGetExternalEntityLoader()`
 *
 * @see <a href="https://gitlab.gnome.org/GNOME/libxml2/-/blob/master/parserInternals.c#L2569">parserInternals.c</a>
 */
static xmlExternalEntityLoader defaultExternalEntityLoader = NULL;

typedef struct _fetchArgs {
  const char *URL;          /* The system ID of the resource requested */
  const char *ID;           /* The public ID of the resource requested */
  xmlParserCtxtPtr context; /* the XML parser context */
  xmlParserInputPtr out;    /* the entity input parser */
} fetchArgs;

void EMSCRIPTEN_KEEPALIVE fetchExternalEntity(void *arg) {
  fetchArgs *args = (fetchArgs *)arg;
  const char *URL = args->URL;
  xmlParserCtxtPtr context = args->context;

  // Prioritize XML documents (including application/*+xml) based on MIME type
  const char *requestHeaders[] = {
      "Accept",
      "application/xslt+xml, application/xml, text/xml, application/xhtml+xml;q=0.8, application/*; q=0.6, */*;q=0.5",
      NULL};
  emscripten_fetch_attr_t attr;
  emscripten_fetch_attr_init(&attr);
  strcpy(attr.requestMethod, "GET");
  attr.attributes =
      EMSCRIPTEN_FETCH_LOAD_TO_MEMORY | EMSCRIPTEN_FETCH_SYNCHRONOUS;
  attr.requestHeaders = requestHeaders;

  emscripten_fetch_t *fetch = emscripten_fetch(&attr, URL);

  if (fetch->status != 200) {
    args->out = NULL;
    emscripten_fetch_close(fetch);
    xmlParserError(context, "%s: emscripten_fetch() failed with status %hu: %s",
                   fetch->url, fetch->status, fetch->statusText);
  } else {
    args->out = xmlNewInputFromMemory(URL, fetch->data, fetch->numBytes,
                                      XML_INPUT_BUF_ZERO_TERMINATED);
    xmlCharEncodingHandlerPtr out = xmlGetCharEncodingHandler(
        xmlDetectCharEncoding(xmlCharStrdup(fetch->data), fetch->numBytes));
    xmlInputSetEncodingHandler(args->out, out);
    emscripten_fetch_close(fetch);
  }
}

xmlParserInputPtr EMSCRIPTEN_KEEPALIVE libxsltWasmExternalEntityLoader(const char *URL,
                                                  const char *ID,
                                                  xmlParserCtxtPtr context) {
  xmlParserInputPtr result = NULL;
  xmlURIPtr uri = xmlParseURI(URL);

  if (uri != NULL) {
    xmlFreeURI(uri);

    // Since `emscripten_fetch` is based on XHR rather than Fetch, the `file://`
    // protocol is not supported.
    if (strcmp(uri->scheme, "file") != 0) {
      fetchArgs *args = malloc(sizeof(fetchArgs));
      *args = (fetchArgs){URL, ID, context, NULL};
      if ((emscripten_proxy_sync(proxyQueue, fetchThread, fetchExternalEntity,
                                 args)) == 1) {
        result = args->out;
      } else {
        xmlParserError(
            context,
            "fetchExternalEntity() failed on %s, id %s. fetchThread may have "
            "exited or was canceled before work was complete\n",
            URL, ID);
        result = NULL;
      }
      free(args);
    }
  }

  return (result == NULL && defaultExternalEntityLoader != NULL)
             ? defaultExternalEntityLoader(URL, ID, context)
             : result;
}

void *exit_with_live_runtime(void *arg) {
  (void)arg;
  emscripten_exit_with_live_runtime();
  __builtin_unreachable();
}

void EMSCRIPTEN_KEEPALIVE cleanup() {
  emscripten_proxy_execute_queue(proxyQueue);
  if (proxyQueue != NULL) {
    em_proxying_queue_destroy(proxyQueue);
  }
  xsltCleanupGlobals();
  xmlCleanupParser();
}

void EMSCRIPTEN_KEEPALIVE init() {
  xmlInitParser();
  proxyQueue = em_proxying_queue_create();

  if (pthread_create(&fetchThread, /* attr */ NULL, exit_with_live_runtime,
                     /* arg */ NULL) == 0) {
    defaultExternalEntityLoader = xmlGetExternalEntityLoader();
    xmlSetExternalEntityLoader(libxsltWasmExternalEntityLoader);
  }
  xsltInit();
}
