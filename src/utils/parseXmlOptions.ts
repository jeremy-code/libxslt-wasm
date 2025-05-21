import { xmlParserOption } from "../internal/libxml2.ts";

const xmlOptionsMap = {
  recover: xmlParserOption.RECOVER.value,
  noEnt: xmlParserOption.NOENT.value,
  dtdLoad: xmlParserOption.DTDLOAD.value,
  dtdAttr: xmlParserOption.DTDATTR.value,
  dtdValid: xmlParserOption.DTDVALID.value,
  noError: xmlParserOption.NOERROR.value,
  noWarning: xmlParserOption.NOWARNING.value,
  pedantic: xmlParserOption.PEDANTIC.value,
  noBlanks: xmlParserOption.NOBLANKS.value,
  sax1: xmlParserOption.SAX1.value,
  xInclude: xmlParserOption.XINCLUDE.value,
  noNet: xmlParserOption.NONET.value,
  noDict: xmlParserOption.NODICT.value,
  nsClean: xmlParserOption.NSCLEAN.value,
  noCData: xmlParserOption.NOCDATA.value,
  noXIncNode: xmlParserOption.NOXINCNODE.value,
  compact: xmlParserOption.COMPACT.value,
  old10: xmlParserOption.OLD10.value,
  noBaseFix: xmlParserOption.NOBASEFIX.value,
  huge: xmlParserOption.HUGE.value,
  oldSax: xmlParserOption.OLDSAX.value,
  ignoreEnc: xmlParserOption.IGNORE_ENC.value,
  bigLines: xmlParserOption.BIG_LINES.value,
  noXxe: xmlParserOption.NO_XXE.value,
  unzip: xmlParserOption.UNZIP.value,
  noSysCatalog: xmlParserOption.NO_SYS_CATALOG.value,
  catalogPi: xmlParserOption.CATALOG_PI.value,
};

type XmlOption = keyof typeof xmlOptionsMap;

const isXmlOption = (key: string): key is XmlOption => key in xmlOptionsMap;

const parseXmlOptions = (
  xmlOptions: Partial<Record<XmlOption, boolean>>,
): number => {
  return Object.entries(xmlOptions).reduce(
    (acc, [key, value]) =>
      value && isXmlOption(key) ? acc | xmlOptionsMap[key] : acc,
    0,
  );
};

export { xmlOptionsMap, type XmlOption, isXmlOption, parseXmlOptions };
