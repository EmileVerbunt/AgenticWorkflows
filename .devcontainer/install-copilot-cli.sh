#!/usr/bin/env bash
set -euo pipefail

if command -v copilot >/dev/null 2>&1; then
  echo "[copilot-cli] $(copilot --version 2>&1 | head -n 1)"
  exit 0
fi

echo "[copilot-cli] Installing GitHub Copilot CLI..."
curl -fsSL https://gh.io/copilot-install | sudo bash

copilot --version
