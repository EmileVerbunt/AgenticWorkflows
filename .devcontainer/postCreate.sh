#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
GH_AW_VERSION="${GH_AW_VERSION:-v0.83.1}"
GH_AW_INSTALLER_COMMIT="6268b9870d9f3bd9ce7526cb9d9cac988ffcfa35"

echo "[postCreate] Installing GitHub Agentic Workflows CLI ${GH_AW_VERSION}..."
curl -fsSL "https://raw.githubusercontent.com/github/gh-aw/${GH_AW_INSTALLER_COMMIT}/install-gh-aw.sh" |
  bash -s -- "${GH_AW_VERSION}"

echo "[postCreate] Restoring and validating the workshop solution..."
cd "${ROOT_DIR}"
gh aw version
dotnet restore AgenticWorkflows.slnx
dotnet build AgenticWorkflows.slnx --no-restore
dotnet test AgenticWorkflows.slnx --no-build

echo "[postCreate] Workshop environment is ready."
