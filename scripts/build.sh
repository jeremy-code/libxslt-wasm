#!/usr/bin/env bash

SCRIPT_DIR="$(dirname "$0")"
SOURCE_DIR=$(realpath "${SCRIPT_DIR}/..")

mkdir -p "${SOURCE_DIR}/output"

docker buildx build --file "${SOURCE_DIR}/Dockerfile" --tag libxslt-wasm "${SOURCE_DIR}"
