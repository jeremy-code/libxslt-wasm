#!/usr/bin/env bash

npm install --global corepack@latest
corepack enable
pnpm install
pnpm compile
pnpm build
