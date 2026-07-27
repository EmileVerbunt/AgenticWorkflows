#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

bash "${ROOT_DIR}/.devcontainer/install-gh-aw.sh"

echo "[postCreate] Restoring and validating the workshop solution..."
cd "${ROOT_DIR}"
gh aw version
dotnet restore AgenticWorkflows.slnx
dotnet build AgenticWorkflows.slnx --no-restore
dotnet test AgenticWorkflows.slnx --no-build

echo "[postCreate] Workshop environment is ready."
