#!/usr/bin/env bash

SCRIPT_DIR="$(dirname "$0")"
SOURCE_DIR=$(realpath "${SCRIPT_DIR}/..")

docker run \
  --interactive \
  --name libxslt-wasm \
  --pull never \
  --rm \
  --tty \
  --volume "${SOURCE_DIR:-.}/module:/home/emscripten/module" \
  --volume "${SOURCE_DIR:-.}/dist:/home/emscripten/dist" \
  --volume "${SOURCE_DIR:-.}/scripts:/home/emscripten/scripts" \
  libxslt-wasm
