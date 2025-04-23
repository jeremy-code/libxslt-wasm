FROM emscripten/emsdk:4.0.7-arm64

RUN apt-get update \
  && apt-get install --assume-yes \
    autoconf \
    automake \
    libtool \
    pkg-config \
  && npm install --global typescript

# By default, the emscripten (1000:1000) user is installed in the image
USER emscripten

WORKDIR /home/emscripten
COPY --chown=emscripten:emscripten . .

RUN cd libxml2 \
  && autoreconf --force --install --warnings=all \
  && emconfigure ./configure \
    --prefix="${HOME}/local" \
    --enable-static \
    --disable-shared \
    --without-push \
    --without-reader \
    --without-python \
    --with-threads \
  && emmake make \
  && emmake make install \
  && cd ..

RUN cd libxslt \
  && autoreconf --force --install --warnings=all \
  && emconfigure ./configure \
    --prefix="${HOME}/local" \
    --enable-static \
    --disable-shared \
    --without-python \
    --with-libxml-prefix="${HOME}/local" \
  && emmake make \
  && emmake make install \
  && cd ..

ENTRYPOINT ["/bin/bash"]
