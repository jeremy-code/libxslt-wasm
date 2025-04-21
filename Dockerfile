FROM emscripten/emsdk:4.0.7-arm64

RUN apt-get update \
  && apt-get install --assume-yes \
    autoconf \
    automake \
    libtool \
    pkg-config

WORKDIR /src

COPY . .

# TODO: Find better way to remove package.json since Node.js errors when it
# attempts to require() packages
RUN \
  . /emsdk/emsdk_env.sh \
  && rm -f ./package.json \
  && npm install -g typescript

RUN cd libxml2 \
  && autoreconf --force --install --warnings=all \
  && emconfigure ./configure \
    --disable-shared \
    --enable-static \
    --without-push \
    --without-reader \
    --without-python \
  && emmake make install \
  && cd ..

RUN cd libxslt \
  && autoreconf --force --install --warnings=all \
  && emconfigure ./configure \
    --disable-shared \
    --enable-static \
    --without-python \
    XML_CONFIG=/src/libxml2/xml2-config \
    CFLAGS="$(pkg-config --cflags libxml-2.0)" \
    LDFLAGS="$(pkg-config --libs  libxml-2.0)" \
  && emmake make install \
  && cd ..
