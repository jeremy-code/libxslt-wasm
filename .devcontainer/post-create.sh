#!/usr/bin/env bash

corepack enable
# Otherwise, `pnpm store path` returns `/workspaces/libxslt-wasm/.pnpm-store/v10`
pnpm config set storeDir "${XDG_DATA_HOME:="$HOME/.local/share"}/pnpm/store"
pnpm install
pnpm compile
pnpm build
