# libxslt-wasm

A WebAssembly port of [libxslt](https://gitlab.gnome.org/GNOME/libxslt) (XSLT 1.0) and [libxml2](https://gitlab.gnome.org/GNOME/libxml2) for Node.js using [Emscripten](https://emscripten.org/).

Some caveats

- Top-level await is required, which is only possible on Node XX and ESM
- [JavaScript Promise Integration (JSPI)](https://github.com/WebAssembly/js-promise-integration/blob/main/proposals/js-promise-integration/Overview.md) must be enabled on Node.js via `--experimental-wasm-jspi`
- Currently, since [`NODERAWFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#noderawfs) is enabled, this build only works on Node.js. It can be modified for work on browsers but why would you?
- Promise-based since any URL must be fetched

Here are some well-maintained JavaScript XML/XSLT libraries:

XML:

- [htmlparser2](https://www.npmjs.com/package/htmlparser2) (and its complements [cheerio](https://www.npmjs.com/package/cheerio), [domutils](https://www.npmjs.com/package/domutils), etc. ) - Fast & forgiving HTML/XML parser
- [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser) - Validate XML, Parse XML, Build XML without C/C++ based libraries
- [@xmldom/xmldom](https://www.npmjs.com/package/@xmldom/xmldom) - A pure JavaScript W3C standard-based (XML DOM Level 2 Core) DOMParser and XMLSerializer module
- [libxml2-wasm](https://www.npmjs.com/package/libxml2-wasm) - WebAssembly-based libxml2 JavaScript wrapper

XSLT:

- [xslt-processor](https://www.npmjs.com/package/xslt-processor) - A JavaScript XSLT processor without native library dependencies with Fetch `<xsl:include>` support
- [saxon-js](https://www.npmjs.com/package/saxon-js) - A XSLT 3.0 processor for Node.js created by the [editor of the W3C XSLT 2.0/3.0 language specification](https://www.w3.org/TR/xslt20/)
- [xsltjs](https://www.npmjs.com/package/xsltjs) - An XSLT 1.0+ implementation written entirely in JavaScript

## Installation

```console
npm install libxslt-wasm
node --experimental-wasm-jspi index.js # Enable JSPI
```

## Usage

This library is fairly niche and is not intended to be a drop-in replacement for other libraries. Its purpose is:

- Solely concerned with applying XSLT to XML documents and not for general-purpose XML parsing (e.g. XPath, DOM, etc.)
- Applying XSLT 1.0 and not XSLT 2.0/3.0 and replicating the behavior of browsers (specifically WebKit and Blink which use `libxslt`) in Node.js
- Parsing an XSLT stylesheet that includes a number of external files (e.g. `xsl:include`, `xsl:import`) that would be infeasible to download beforehand with relative or irregular URLs
- Capable of using [EXSLT](https://exslt.github.io/) extensions and their functions

i.e. if all the aforementioned libraries can't transform your XML but the `xsltproc` CLI tool can do so easily without any issues, you might consider using this library.

```ts
import { writeFile } from "fs/promises";
import { XmlDocument, XsltStylesheet } from "libxslt-wasm";
import { exsltRegisterAll, xsltRegisterAllExtras } from "libxslt-wasm/internal";

xsltRegisterAllExtras();
exsltRegisterAll();

using doc: XmlDocument = await XmlDocument.fromFileOrUrl(
  "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/2b4255a7-f9f5-4235-8dbb-b0f03acbd624.xml",
);
// Equivalent to `await XsltStylesheet.fromFileOrUrl("https://www.accessdata.fda.gov/spl/stylesheet/spl.xsl");`
using xsltStylesheet: XsltStylesheet | null =
  await XsltStylesheet.fromEmbeddedXmlDocument(doc); // From <?xml-stylesheet> processing instruction

if (xsltStylesheet === null) {
  throw new Error("Invalid XSLT stylesheet");
}

using result: XmlDocument = await xsltStylesheet.apply(doc, {
  // Set <xsl:param> values
  "show-data": "/..",
});

await writeFile("output.xml", result.toString({ format: true })); // As XML
await writeFile("output.html", result.toHtmlString({ format: true })); // As HTML
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. It makes use of the following libraries:

- [libxml2](http://xmlsoft.org) which is licensed under the MIT License ([libxml2/Copyright](libxml2/Copyright))
- [libxslt](http://xmlsoft.org/libxslt/) which is licensed under the MIT License ([libxslt/Copyright](libxslt/Copyright))
- [Emscripten](https://emscripten.org/) which is available under 2 licenses, the MIT license and the University of Illinois/NCSA Open Source License ([emscripten-core/emscripten](https://github.com/emscripten-core/emscripten/blob/main/LICENSE))
