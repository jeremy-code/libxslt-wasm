#include <libxml/encoding.h>
#include <libxml/parser.h>

#include <emscripten/bind.h>

using namespace emscripten;

class NOOP {}; // See https://github.com/emscripten-core/emscripten/issues/24120

EMSCRIPTEN_BINDINGS(Foo) {
    // <libxml/encoding.h>
    enum_<xmlCharEncoding>("xmlCharEncoding")
        .value("ERROR", XML_CHAR_ENCODING_ERROR)
        .value("NONE", XML_CHAR_ENCODING_NONE)
        .value("UTF8", XML_CHAR_ENCODING_UTF8)
        .value("UTF16LE", XML_CHAR_ENCODING_UTF16LE)
        .value("UTF16BE", XML_CHAR_ENCODING_UTF16BE)
        .value("UCS4LE", XML_CHAR_ENCODING_UCS4LE)
        .value("UCS4BE", XML_CHAR_ENCODING_UCS4BE)
        .value("EBCDIC", XML_CHAR_ENCODING_EBCDIC)
        .value("UCS4_2143", XML_CHAR_ENCODING_UCS4_2143)
        .value("UCS4_3412", XML_CHAR_ENCODING_UCS4_3412)
        .value("UCS2", XML_CHAR_ENCODING_UCS2)
        .value("ISO_8859_1", XML_CHAR_ENCODING_8859_1)
        .value("ISO_8859_2", XML_CHAR_ENCODING_8859_2)
        .value("ISO_8859_3", XML_CHAR_ENCODING_8859_3)
        .value("ISO_8859_4", XML_CHAR_ENCODING_8859_4)
        .value("ISO_8859_5", XML_CHAR_ENCODING_8859_5)
        .value("ISO_8859_6", XML_CHAR_ENCODING_8859_6)
        .value("ISO_8859_7", XML_CHAR_ENCODING_8859_7)
        .value("ISO_8859_8", XML_CHAR_ENCODING_8859_8)
        .value("ISO_8859_9", XML_CHAR_ENCODING_8859_9)
        .value("ISO_2022_JP", XML_CHAR_ENCODING_2022_JP)
        .value("SHIFT_JIS", XML_CHAR_ENCODING_SHIFT_JIS)
        .value("EUC_JP", XML_CHAR_ENCODING_EUC_JP)
        .value("ASCII", XML_CHAR_ENCODING_ASCII)
        .value("UTF16", XML_CHAR_ENCODING_UTF16)
        .value("HTML", XML_CHAR_ENCODING_HTML)
        .value("ISO_8859_10", XML_CHAR_ENCODING_8859_10)
        .value("ISO_8859_11", XML_CHAR_ENCODING_8859_11)
        .value("ISO_8859_13", XML_CHAR_ENCODING_8859_13)
        .value("ISO_8859_14", XML_CHAR_ENCODING_8859_14)
        .value("ISO_8859_15", XML_CHAR_ENCODING_8859_15)
        .value("ISO_8859_16", XML_CHAR_ENCODING_8859_16)
        ;
    // <libxml/parser.h>
    enum_<xmlParserOption>("xmlParserOption")
        .value("RECOVER", XML_PARSE_RECOVER)
        .value("NOENT", XML_PARSE_NOENT)
        .value("DTDLOAD", XML_PARSE_DTDLOAD)
        .value("DTDATTR", XML_PARSE_DTDATTR)
        .value("DTDVALID", XML_PARSE_DTDVALID)
        .value("NOERROR", XML_PARSE_NOERROR)
        .value("NOWARNING", XML_PARSE_NOWARNING)
        .value("PEDANTIC", XML_PARSE_PEDANTIC)
        .value("NOBLANKS", XML_PARSE_NOBLANKS)
        .value("SAX1", XML_PARSE_SAX1)
        .value("XINCLUDE", XML_PARSE_XINCLUDE)
        .value("NONET", XML_PARSE_NONET)
        .value("NODICT", XML_PARSE_NODICT)
        .value("NSCLEAN", XML_PARSE_NSCLEAN)
        .value("NOCDATA", XML_PARSE_NOCDATA)
        .value("NOXINCNODE", XML_PARSE_NOXINCNODE)
        .value("COMPACT", XML_PARSE_COMPACT)
        .value("OLD10", XML_PARSE_OLD10)
        .value("NOBASEFIX", XML_PARSE_NOBASEFIX)
        .value("HUGE", XML_PARSE_HUGE)
        .value("OLDSAX", XML_PARSE_OLDSAX)
        .value("IGNORE_ENC", XML_PARSE_IGNORE_ENC)
        .value("BIG_LINES", XML_PARSE_BIG_LINES)
        .value("NO_XXE", XML_PARSE_NO_XXE)
        .value("UNZIP", XML_PARSE_UNZIP)
        .value("NO_SYS_CATALOG", XML_PARSE_NO_SYS_CATALOG)
        .value("CATALOG_PI", XML_PARSE_CATALOG_PI)
        ;
    enum_<xmlParserStatus>("xmlParserStatus")
        .value("NOT_WELL_FORMED", XML_STATUS_NOT_WELL_FORMED)
        .value("NOT_NS_WELL_FORMED", XML_STATUS_NOT_NS_WELL_FORMED)
        .value("DTD_VALIDATION_FAILED", XML_STATUS_DTD_VALIDATION_FAILED)
        .value("CATASTROPHIC_ERROR", XML_STATUS_CATASTROPHIC_ERROR)
        ;
    class_<NOOP>("NOOP")
        ;
}
