#!/usr/bin/env bash

readonly SCRIPT_DIR=$(realpath ${BASH_SOURCE} | xargs dirname)
readonly SOURCE_DIR=$(dirname "${SCRIPT_DIR}")
readonly PREFIX="${SOURCE_DIR}/local"

mkdir -p "${PREFIX}"

cd "${SOURCE_DIR}/libxml2"
autoreconf --force --install --warnings=all

# Enable `EXPORT_ES6` to prevent Node.js errors when running `configure` script
# https://github.com/emscripten-core/emscripten/issues/13551

emconfigure ./configure \
  --prefix="${SOURCE_DIR}/local" \
  --enable-static \
  --disable-shared \
  --without-push \
  --without-reader \
  --without-python \
  --with-threads \
  CFLAGS="-sEXPORT_ES6=1"

emmake make
emmake make install

cd "${SOURCE_DIR}/libxslt"
autoreconf --force --install --warnings=all

emconfigure ./configure \
  --prefix="${SOURCE_DIR}/local" \
  --enable-static \
  --disable-shared \
  --without-python \
  --with-libxml-prefix="${SOURCE_DIR}/local" \
  CFLAGS="-sEXPORT_ES6=1"

emmake make
emmake make install
