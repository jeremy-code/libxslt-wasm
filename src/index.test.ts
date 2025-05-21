import { expect, test } from "@jest/globals";

import { XmlDocument, XsltStylesheet } from "libxslt-wasm";
import { registerModule } from "libxslt-wasm/exslt";

// Temporary test to verify that the library is working while the test suite
// is being developed. This test will be removed once the test suite is
// complete.
// eslint-disable-next-line jest/no-disabled-tests
test.skip("dummy test", async () => {
  registerModule("common"); // Register EXSLT common module

  using doc: XmlDocument = await XmlDocument.fromUrl(
    "https://dailymed.nlm.nih.gov/dailymed/services/v2/spls/2b4255a7-f9f5-4235-8dbb-b0f03acbd624.xml",
  );
  // Equivalent to `await XsltStylesheet.fromUrl("https://www.accessdata.fda.gov/spl/stylesheet/spl.xsl");`
  using xsltStylesheet: XsltStylesheet | null =
    await XsltStylesheet.fromEmbeddedXmlDocument(doc); // From <?xml-stylesheet?> processing instruction

  if (xsltStylesheet === null) {
    throw new Error("Invalid XSLT stylesheet");
  }

  using result: XmlDocument = await xsltStylesheet.apply(doc, {
    // Set <xsl:param> values
    "show-data": "/..",
  });

  expect(result.toString()).toHaveLength(139_482);
  expect(result.toHtmlString()).toHaveLength(139_011);
});
