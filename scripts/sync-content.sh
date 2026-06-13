#!/usr/bin/env bash
set -euo pipefail

VAULT_PUBLIC="${VAULT_PUBLIC:-$HOME/obsidiannotes/Public}"
QUARTZ_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
QUARTZ_CONTENT="$QUARTZ_ROOT/content"

if [ ! -d "$VAULT_PUBLIC" ]; then
  echo "ERROR: Vault公開フォルダが見つかりません: $VAULT_PUBLIC" >&2
  exit 1
fi

rm -rf "$QUARTZ_CONTENT"
mkdir -p "$QUARTZ_CONTENT"

rsync -av --delete \
  --exclude ".obsidian/" \
  --exclude ".git/" \
  --exclude ".DS_Store" \
  --exclude ".trash/" \
  --exclude "node_modules/" \
  "$VAULT_PUBLIC/" "$QUARTZ_CONTENT/"