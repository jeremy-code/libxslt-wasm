# syntax=docker/dockerfile:1
FROM emscripten/emsdk:4.0.9-arm64

RUN apt-get update \
  && apt-get install --assume-yes \
    autoconf \
    automake \
    libtool \
    pkg-config \
  && emsdk update \
  && npm install --global typescript

# By default, the emscripten (1000:1000) user is installed in the image
USER emscripten

ENTRYPOINT ["/bin/bash"]
