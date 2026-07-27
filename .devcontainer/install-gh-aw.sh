#!/usr/bin/env bash
set -euo pipefail

GH_AW_VERSION="${GH_AW_VERSION:-v0.83.1}"
GH_AW_INSTALLER_COMMIT="6268b9870d9f3bd9ce7526cb9d9cac988ffcfa35"

installed_version="$(gh aw version 2>&1 || true)"
if [[ "${installed_version}" == *"${GH_AW_VERSION}"* ]]; then
  echo "[gh-aw] ${installed_version}"
  exit 0
fi

echo "[gh-aw] Installing GitHub Agentic Workflows CLI ${GH_AW_VERSION}..."
curl -fsSL "https://raw.githubusercontent.com/github/gh-aw/${GH_AW_INSTALLER_COMMIT}/install-gh-aw.sh" |
  bash -s -- "${GH_AW_VERSION}"

gh aw version
