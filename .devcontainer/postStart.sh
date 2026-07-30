#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

cd "${ROOT_DIR}"
bash .devcontainer/install-gh-aw.sh
bash .devcontainer/install-copilot-cli.sh

echo
echo "Agentic Workflows workshop ready"
echo "---------------------------------"
echo "gh-aw: $(gh aw version 2>&1 | head -n 1)"
echo "Copilot CLI: $(copilot --version 2>&1 | head -n 1)"
echo ".NET:  $(dotnet --version)"
echo "Copilot auth: managed organization token; no repository secret required"

if gh auth status >/dev/null 2>&1; then
  echo "GitHub CLI: authenticated"
  bash .devcontainer/configure-repository.sh
else
  echo "GitHub CLI: authentication required before pushing or running workflows"
fi

echo
echo "Open README.md and begin with Step 1."
echo "Useful VS Code tasks:"
echo "  Workshop: Test solution"
echo "  Workshop: Run API"
