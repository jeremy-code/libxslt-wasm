# syntax=docker/dockerfile:1
FROM emscripten/emsdk:6.0.0

ENV \
  LIBXML2_VERSION=2.15.3 \
  LIBXSLT_VERSION=1.1.45

ENV INSTALL_DIR=/usr/local

# https://emscripten.org/docs/compiling/Building-Projects.html#pkg-config
ENV EM_PKG_CONFIG_PATH=$EM_PKG_CONFIG_PATH:$INSTALL_DIR/lib/pkgconfig
ENV PKG_CONFIG_PATH=$PKG_CONFIG_PATH:$EM_PKG_CONFIG_PATH

RUN set -o errexit -o nounset -o xtrace; \
	apt-get update; \
	apt-get install --no-install-recommends --assume-yes \
    autoconf \
    automake \
    libtool \
    pkg-config \
    clang-format \
	; \
	rm -rf /var/lib/apt/lists/*

RUN set -o errexit -o nounset -o xtrace; \
  LIBXML2_SOURCE_URL="https://gitlab.gnome.org/GNOME/libxml2/-/archive/v$LIBXML2_VERSION/libxml2-v$LIBXML2_VERSION.tar.gz"; \
  LIBXML2_PATH="/usr/local/src/libxml2-$LIBXML2_VERSION"; \
  \
  wget --output-document "$LIBXML2_PATH.tar.gz" "$LIBXML2_SOURCE_URL"; \
  mkdir --parents "$LIBXML2_PATH"; \
  tar --extract --directory "$LIBXML2_PATH" --file "$LIBXML2_PATH.tar.gz" --strip-components 1; \
  cd "$LIBXML2_PATH"; \
  autoreconf --force --install --warnings=all; \
  emconfigure ./configure \
    --prefix=${INSTALL_DIR} \
    --host=wasm32-unknown-emscripten \
    --enable-static \
    --disable-shared \
    --without-push \
    --without-reader \
    --without-python \
    --with-threads \
  ; \
  emmake make --jobs="$(getconf _NPROCESSORS_ONLN)"; \
  emmake make install

RUN set -o errexit -o nounset -o xtrace; \
  LIBXSLT_SOURCE_URL="https://gitlab.gnome.org/GNOME/libxslt/-/archive/v$LIBXSLT_VERSION/libxslt-v$LIBXSLT_VERSION.tar.gz"; \
  LIBXSLT_PATH="/usr/local/src/libxslt-$LIBXSLT_VERSION"; \
  \
  wget --output-document "$LIBXSLT_PATH.tar.gz" "$LIBXSLT_SOURCE_URL"; \
  mkdir --parents "$LIBXSLT_PATH"; \
  tar --extract --directory "$LIBXSLT_PATH" --file "$LIBXSLT_PATH.tar.gz" --strip-components 1; \
  cd "$LIBXSLT_PATH"; \
  autoreconf --force --install --warnings=all; \
  emconfigure ./configure \
    --prefix=${INSTALL_DIR} \
    --host=wasm32-unknown-emscripten \
    --enable-static \
    --disable-shared \
    --without-python \
    --with-threads \
    --with-libxml-prefix=${INSTALL_DIR} \
  ; \
  emmake make --jobs="$(getconf _NPROCESSORS_ONLN)"; \
  emmake make install

# Since emconfigure and emmake have run previously, the emscripten symbol_lists
# cache and its files will be owned by root. Therefore, when running the
# `compile.sh` script with the ubuntu user, `emscripten.py` will throw a
# PermissionError attempting to read /emsdk/upstream/emscripten/cache/
RUN set -o errexit -o nounset -o xtrace; \
  chmod -R 777 /emsdk/upstream/emscripten/cache/symbol_lists

USER ubuntu

CMD ["/bin/bash"]
