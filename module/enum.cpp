#include <libxml/parser.h>

#include <emscripten/bind.h>

using namespace emscripten;

class NOOP {};

EMSCRIPTEN_BINDINGS(Foo) {
    enum_<xmlParserStatus>("xmlParserStatus")
        .value("NOT_WELL_FORMED", XML_STATUS_NOT_WELL_FORMED)
        .value("NS_WELL_FORMED", XML_STATUS_NOT_NS_WELL_FORMED)
        .value("DTD_VALIDATION_FAILED", XML_STATUS_DTD_VALIDATION_FAILED)
        .value("CATASTROPHIC_ERROR", XML_STATUS_CATASTROPHIC_ERROR)
        ;
    class_<NOOP>("NOOP")
        ;
}
