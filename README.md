# libxslt-wasm

A WebAssembly port of [libxslt](https://gitlab.gnome.org/GNOME/libxslt) (XSLT 1.0) and [libxml2](https://gitlab.gnome.org/GNOME/libxml2) for Node.js using [Emscripten](https://emscripten.org/).

If you're looking for a well-maintained JavaScript XML/XSLT library, you should consider using one of the following libraries instead:

XML:

- [htmlparser2](https://www.npmjs.com/package/htmlparser2) (and its complements [cheerio](https://www.npmjs.com/package/cheerio), [domutils](https://www.npmjs.com/package/domutils), etc.) - Fast & forgiving HTML/XML parser
- [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser) - Validate XML, Parse XML, Build XML without C/C++ based libraries
- [@xmldom/xmldom](https://www.npmjs.com/package/@xmldom/xmldom) - A pure JavaScript W3C standard-based (XML DOM Level 2 Core) DOMParser and XMLSerializer module
- [libxml2-wasm](https://www.npmjs.com/package/libxml2-wasm) - WebAssembly-based libxml2 JavaScript wrapper

XSLT:

- [xslt-processor](https://www.npmjs.com/package/xslt-processor) - A JavaScript XSLT processor without native library dependencies with Fetch `<xsl:include>` support
- [saxon-js](https://www.npmjs.com/package/saxon-js) - A XSLT 3.0 processor for Node.js created by the [editor of the W3C XSLT 2.0/3.0 language specification](https://www.w3.org/TR/xslt20/)
- [xsltjs](https://www.npmjs.com/package/xsltjs) - An XSLT 1.0+ implementation written entirely in JavaScript

## Installation

```shell
npm install libxslt-wasm # npm
yarn add libxslt-wasm    # yarn
pnpm add libxslt-wasm    # pnpm
```

## Usage

This library is fairly niche and is not intended to be a drop-in replacement for other libraries. Its intended use cases are:

- Applying XSLT to XML documents and NOT for general-purpose XML parsing or querying (e.g. XPath, DOM, etc.)
- Applying XSLT 1.0 and not XSLT 2.0/3.0
- Replicating the behavior of browsers (specifically WebKit and Blink which use `libxslt`) in Node.js
- Parsing an XSLT stylesheet that includes a number of external files (via `xsl:include`, `xsl:import`) that would be infeasible to download beforehand with relative URLs
- Capable of enabling [EXSLT](https://exslt.github.io/) modules and their functions

i.e. if all the aforementioned libraries can't transform your XML document but the `xsltproc` CLI tool can do so easily without any issues, you might consider using this library.

```ts
import { writeFile } from "fs/promises";

import { XmlDocument, XsltStylesheet } from "libxslt-wasm";
import { registerModule } from "libxslt-wasm/exslt";

registerModule("common"); // Register EXSLT common module

using doc: XmlDocument = await XmlDocument.fromFileOrUrl(
  "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/2b4255a7-f9f5-4235-8dbb-b0f03acbd624.xml",
);
// Equivalent to `await XsltStylesheet.fromFileOrUrl("https://www.accessdata.fda.gov/spl/stylesheet/spl.xsl");`
using xsltStylesheet: XsltStylesheet | null =
  await XsltStylesheet.fromEmbeddedXmlDocument(doc); // From <?xml-stylesheet?> processing instruction

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

However, there are some caveats:

- Top-level await is required (see [src/internal/module.ts](src/internal/module.ts)) which is only avaliable in Node.js 14.8+ and in [ECMAScript modules](https://nodejs.org/api/packages.html#modules-packages) (ESM)
- [JavaScript Promise Integration (JSPI)](https://github.com/WebAssembly/js-promise-integration/blob/main/proposals/js-promise-integration/Overview.md) must be enabled on Node.js via `--experimental-wasm-jspi` (v22+) or `--experiment-wasm-stack-switching` (v19.2+).
  - Furthermore, since this library operates by using JSPI to intercept any HTTP requests with [Node.js fetch](https://nodejs.org/api/globals.html#fetch) (v18+), some functions in this library return a [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- Currently, since [`NODERAWFS`](https://emscripten.org/docs/api_reference/Filesystem-API.html#noderawfs) is enabled to intercept file system calls with Node.js functions, this library currently only works on Node.js. While it could be modified to work on browsers, that would be a niche use case since all mainstream browsers already have both XSLT transformation and the [XSLTProcessor API](https://developer.mozilla.org/en-US/docs/Web/API/XSLTProcessor#browser_compatibility) built-in
- Since this library is a WebAssembly port of `libxslt`, it does not support the [XSLT 2.0](https://www.w3.org/TR/xslt20)/[3.0](https://www.w3.org/TR/xslt30) or [XQuery](https://www.w3.org/TR/xquery/) specifications
- To interact with the compiled WebAssembly memory, wrapper classes are provided (`XmlDocument`, `XsltStylesheet`, etc.) that must be disposed of after use (either declaratively with the `using` statement or imperatively with the `.close()` method) to prevent memory leaks

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. It makes use of the following libraries:

- [libxml2](https://gitlab.gnome.org/GNOME/libxml2) which is licensed under the MIT License ([libxml2/Copyright](libxml2/Copyright))
- [libxslt](https://gitlab.gnome.org/GNOME/libxslt) which is licensed under the MIT License ([libxslt/Copyright](libxslt/Copyright))
- [Emscripten](https://emscripten.org/) which is available under 2 licenses, the MIT license and the University of Illinois/NCSA Open Source License ([emscripten-core/emscripten](https://github.com/emscripten-core/emscripten/blob/main/LICENSE))
