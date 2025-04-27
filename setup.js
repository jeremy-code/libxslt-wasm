import v8 from "node:v8";

// Unfortunately, `--experimental-wasm-jspi` cannot be set in the `NODE_OPTIONS`
// environment variable nor the config file, which makes it somewhat
// inconvenient to run `jest`, which cannot directly be passed Node.js flags.
v8.setFlagsFromString("--experimental-wasm-jspi");
