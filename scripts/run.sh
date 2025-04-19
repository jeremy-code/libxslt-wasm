#!/usr/bin/env bash

docker run \
  --interactive \
  --name libxslt-wasm \
  --pull never \
  --rm \
  --tty \
  --volume "${SOURCE_DIR:-$(pwd)}/module:/src/module" \
  --volume "${SOURCE_DIR:-$(pwd)}/output:/src/output" \
  --volume "${SOURCE_DIR:-$(pwd)}/scripts:/src/scripts" \
  --workdir /src/scripts \
  libxslt-wasm \
  /bin/bash
