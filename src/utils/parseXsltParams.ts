import { StringPtrArray } from "../common/StringPtrArray.ts";

// If you see errors when passing params, considering double quoting params so
// they are considered literals rather than XPath expressions
const parseXsltParams = (
  params: Record<string, string> | undefined,
): StringPtrArray | null => {
  if (params === undefined) {
    return null;
  }

  const entries = Object.entries(params);
  if (entries.length === 0) {
    return null;
  }

  const paramArray = entries
    .map(([key, value]) => [key, String(value)])
    .flat(1);
  return StringPtrArray.fromStringArray(paramArray, true);
};

export { parseXsltParams };
