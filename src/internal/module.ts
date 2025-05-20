import libxsltFactory from "libxslt-wasm/output/libxslt";

const libxslt = await libxsltFactory();

export { libxsltFactory, libxslt };
