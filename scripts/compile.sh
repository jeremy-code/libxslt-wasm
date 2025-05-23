#!/usr/bin/env bash
#
# Run with DEBUG=1 or SANITIZE=1 to enable debugging or sanitizers.
# This script can be ran locally or in a Docker container.

readonly SCRIPT_DIR="$(dirname "$0")"
readonly SOURCE_DIR=$(realpath "${SCRIPT_DIR}/..")

# https://emscripten.org/docs/tools_reference/settings_reference.html
DEBUG_FLAGS=(
  -sVERBOSE=0         # generate more verbose output during compilation
  -sEXCEPTION_DEBUG=1 # print out exceptions in emscriptened code
  -sLIBRARY_DEBUG=0   # print out when we enter a library call (library*.js)
  -sSYSCALL_DEBUG=0   # print out all musl syscalls
  -sSOCKET_DEBUG=1    # log out socket/network data transfer
  -sDYLINK_DEBUG=1    # log dynamic linker information
  -sOPENAL_DEBUG=0    # print out debugging information from our OpenAL implementation
  -sWEBSOCKET_DEBUG=1 # prints out debugging related to calls from emscripten_web_socket_* functions in emscripten/websocket.h
  -sGL_DEBUG=0        # enables more verbose debug printing of WebGL related operations
  -sWEBAUDIO_DEBUG=0  # enables deep debugging of Web Audio backend
  -sPTHREADS_DEBUG=1  # add in debug traces for diagnosing pthreads related issues
  -sRUNTIME_DEBUG=1   # if non-zero, add tracing to core runtime functions
)

# https://emscripten.org/docs/debugging/Sanitizers.html
SANITIZE_FLAGS=(
  -fsanitize=address
  -fno-omit-frame-pointer     # Omit the frame pointer in functions that don’t need one
  -fno-optimize-sibling-calls # Do not optimize sibling and tail recursive calls
  -sALLOW_MEMORY_GROWTH=1     # Grow the memory arrays at runtime, seamlessly and dynamically
  -g2                         # When linking, preserve function names in compiled code
)

PKG_CONFIG_PC_FILES=(
  "${SOURCE_DIR}/libxml2/libxml-2.0.pc"
  "${SOURCE_DIR}/libxslt/libxslt.pc"
  "${SOURCE_DIR}/libxslt/libexslt.pc"
)

emcc \
  $(pkg-config --cflags --libs ${PKG_CONFIG_PC_FILES[@]}) \
  ${DEBUG:+${DEBUG_FLAGS[@]}} \
  ${SANITIZE:+${SANITIZE_FLAGS[@]}} \
  -O0 \
  -g2 \
  -pthread \
  -lembind \
  --emit-tsd ${SOURCE_DIR}/dist/output/libxslt.d.ts \
  -sINVOKE_RUN=1 \
  -sEXIT_RUNTIME=0 \
  -sALLOW_MEMORY_GROWTH=1 \
  -sJSPI=1 \
  -sJSPI_EXPORTS=@${SOURCE_DIR}/scripts/exports/jspi.txt \
  -sEXPORTED_RUNTIME_METHODS=@${SOURCE_DIR}/scripts/exports/runtime_methods.txt \
  -sFORCE_FILESYSTEM=1 \
  -sEXPORTED_FUNCTIONS=@${SOURCE_DIR}/scripts/exports/functions.txt \
  -sMODULARIZE=1 \
  -sEXPORT_ES6=1 \
  -sEXPORT_NAME="LibxsltModule" \
  -sMIN_NODE_VERSION="190200" \
  -o ${SOURCE_DIR}/dist/output/libxslt.js \
  "${SOURCE_DIR}/module/"* \
  ${SOURCE_DIR}/libxml2/.libs/libxml2.a \
  ${SOURCE_DIR}/libxslt/libxslt/.libs/libxslt.a \
  ${SOURCE_DIR}/libxslt/libexslt/.libs/libexslt.a
