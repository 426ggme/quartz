#!/usr/bin/env bash
set -euo pipefail

VAULT_PUBLIC="${VAULT_PUBLIC:-$HOME/obsidiannotes/Public}"
QUARTZ_ROOT="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -d "$VAULT_PUBLIC" ]; then
  echo "ERROR: Vault公開フォルダが見つかりません: $VAULT_PUBLIC" >&2
  exit 1
fi

node "$QUARTZ_ROOT/scripts/sync-content.mjs" "$VAULT_PUBLIC" "$QUARTZ_ROOT/content"
