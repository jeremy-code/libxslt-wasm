#!/usr/bin/env bash

corepack enable
# Otherwise, `pnpm store path` returns `/workspaces/libxslt-wasm/.pnpm-store/v10`
pnpm config set store-dir "${XDG_DATA_HOME:="$HOME/.local/share"}/pnpm/store" --global
pnpm install
pnpm compile
pnpm build
