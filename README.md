# libxslt-wasm

## Installation

```console
npm install libxslt-wasm
node --experimental-wasm-jspi index.js # Enable JSPI
```

```ts
import { writeFile } from "fs/promises";
import { XmlDocument, XsltStylesheet } from "libxslt-wasm";
import { exsltRegisterAll, xsltRegisterAllExtras } from "libxslt-wasm/internal";

xsltRegisterAllExtras();
exsltRegisterAll();

using doc = await XmlDocument.fromFileOrUrl(
  "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/2b4255a7-f9f5-4235-8dbb-b0f03acbd624.xml",
);
// Equivalent to `await XsltStylesheet.fromFileOrUrl("https://www.accessdata.fda.gov/spl/stylesheet/spl.xsl");`
using xsltStylesheet = await XsltStylesheet.fromEmbeddedXmlDocument(doc);

if (xsltStylesheet === null) {
  throw new Error("Invalid XSLT stylesheet");
}

using result = await xsltStylesheet.apply(doc, {
  "show-data": "/..",
});

writeFile("output.html", result.toString({ format: true }));
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. It makes use of the following libraries:

- [libxml2](http://xmlsoft.org) which is licensed under the MIT License ([libxml2/Copyright](libxml2/Copyright))
- [libxslt](http://xmlsoft.org/libxslt/) which is licensed under the MIT License ([libxslt/Copyright](libxslt/Copyright))
- [Emscripten](https://emscripten.org/) which is available under 2 licenses, the MIT license and the University of Illinois/NCSA Open Source License ([emscripten-core/emscripten](https://github.com/emscripten-core/emscripten/blob/main/LICENSE))
