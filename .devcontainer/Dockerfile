# syntax=docker/dockerfile:1
FROM emscripten/emsdk:6.0.0

# https://gitlab.gnome.org/GNOME/libxml2/-/releases
# https://gitlab.gnome.org/GNOME/libxslt/-/releases
ENV \
  LIBXML2_VERSION=2.15.3 \
  LIBXSLT_VERSION=1.1.45

# nvm is incompatible with PREFIX environment variable
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

# Note: libxml2 is already installed by default on the Emscripten docker image
# https://github.com/emscripten-core/emsdk/blob/e7479a395086caebaf4e8d9d974858241c4442d7/docker/Dockerfile#L77
RUN set -o errexit -o nounset -o xtrace; \
  LIBXML2_ARCHIVE_FILE="libxml2-v${LIBXML2_VERSION}.tar.gz" \
  LIBXML2_SOURCE_URL="https://gitlab.gnome.org/GNOME/libxml2/-/archive/v$LIBXML2_VERSION/$LIBXML2_ARCHIVE_FILE"; \
  LIBXML2_PATH="/usr/local/src/libxml2-v$LIBXML2_VERSION"; \
  \
  wget --directory-prefix $LIBXML2_PATH "$LIBXML2_SOURCE_URL"; \
  cd "$LIBXML2_PATH"; \
  tar --extract --file "$LIBXML2_ARCHIVE_FILE" --one-top-level=$LIBXML2_PATH --strip-components 1; \
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
  emmake make install; \
  cd /; \
  rm -rf "$LIBXML2_PATH"

  RUN set -o errexit -o nounset -o xtrace; \
  LIBXSLT_ARCHIVE_FILE="libxslt-v$LIBXSLT_VERSION.tar.gz"; \
  LIBXSLT_SOURCE_URL="https://gitlab.gnome.org/GNOME/libxslt/-/archive/v$LIBXSLT_VERSION/$LIBXSLT_ARCHIVE_FILE"; \
  LIBXSLT_PATH="/usr/local/src/libxslt-v$LIBXSLT_VERSION"; \
  \
  wget --directory-prefix $LIBXSLT_PATH "$LIBXSLT_SOURCE_URL"; \
  cd "$LIBXSLT_PATH"; \
  tar --extract --file "$LIBXSLT_ARCHIVE_FILE" --one-top-level=$LIBXSLT_PATH --strip-components 1; \
  autoreconf --force --install --warnings=all; \
  emconfigure ./configure \
    --prefix=${INSTALL_DIR} \
    --host=wasm32-unknown-emscripten \
    --enable-static \
    --disable-shared \
    --without-python \
    --with-libxml-prefix=${INSTALL_DIR} \
  ; \
  emmake make --jobs="$(getconf _NPROCESSORS_ONLN)"; \
  emmake make install; \
  cd /; \
  rm -rf "$LIBXSLT_PATH"


# Since emconfigure and emmake have run previously, the emscripten symbol_lists
# cache and its files will be owned by root. Therefore, when running the
# `compile.sh` script with the ubuntu user, `emscripten.py` will throw a
# PermissionError attempting to read /emsdk/upstream/emscripten/cache/
RUN set -o errexit -o nounset -o xtrace; \
  chmod -R 777 /emsdk/upstream/emscripten/cache/symbol_lists

USER ubuntu

ENTRYPOINT ["/emsdk/docker/entrypoint.sh"]
