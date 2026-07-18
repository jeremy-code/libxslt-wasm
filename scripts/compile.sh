#!/usr/bin/env bash

set -o errexit -o nounset -o pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SOURCE_DIR="$(dirname "$SCRIPT_DIR")"
OUTPUT_DIR="${SOURCE_DIR}/dist/output"
EXPORTS_DIR="${SCRIPT_DIR}/exports"

if [ ! -d "${OUTPUT_DIR}" ]; then
  mkdir --parents "${OUTPUT_DIR}"
fi

# https://emscripten.org/docs/tools_reference/settings_reference.html
COMPILE_FLAGS=(
  -O3 # https://clang.llvm.org/docs/CommandGuide/clang.html#cmdoption-O0
  -g0 # Do not generate debug information
  -pthread
  -lembind
  --emit-tsd "${OUTPUT_DIR}/libxslt.d.ts"
  -sINVOKE_RUN=1
  -sEXIT_RUNTIME=0
  -sALLOW_MEMORY_GROWTH=1
  -sJSPI=1
  -sJSPI_EXPORTS=@${SOURCE_DIR}/scripts/exports/jspi.txt
  -sSTACK_SIZE=$((2 ** 16))
  -sEXPORTED_RUNTIME_METHODS=@${EXPORTS_DIR}/runtime_methods.txt
  -sINCOMING_MODULE_JS_API="[]"
  -sFILESYSTEM=0
  -sEXPORTED_FUNCTIONS=@${EXPORTS_DIR}/functions.txt
  -sMODULARIZE=1
  -sEXPORT_ES6=1
  -sEXPORT_NAME="LibxsltModule"
  -sMIN_NODE_VERSION="190200"
  -o "${OUTPUT_DIR}/libxslt.js"
)

emcc \
  $(pkg-config --cflags --libs libxml-2.0 libxslt libexslt) \
  "${COMPILE_FLAGS[@]}" \
  "${SOURCE_DIR}/module/"*
