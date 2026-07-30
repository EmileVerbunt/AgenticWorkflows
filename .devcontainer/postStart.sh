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

  repository="$(gh repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null || true)"
  if [ -n "${repository}" ] && [ "${repository}" != "EmileVerbunt/AgenticWorkflows" ]; then
    start_issue_count="$(
      gh api -X GET search/issues \
        -f q="repo:${repository} \"workshop:start-here\" in:body" \
        --jq .total_count 2>/dev/null || echo 0
    )"
    assignment_count="$(
      gh api -X GET search/issues \
        -f q="repo:${repository} label:assignment is:issue" \
        --jq .total_count 2>/dev/null || echo 0
    )"
    sample_pr_count="$(
      gh api -X GET search/issues \
        -f q="repo:${repository} label:sample-pr is:pr is:open" \
        --jq .total_count 2>/dev/null || echo 0
    )"
    latest_seed_status="$(
      gh run list \
        --workflow seed-workshop.yml \
        --limit 1 \
        --json status \
        --jq '.[0].status // ""' 2>/dev/null || true
    )"

    if {
      [ "${start_issue_count}" = "0" ] ||
        [ "${assignment_count}" -lt 4 ] ||
        [ "${sample_pr_count}" = "0" ]
    } &&
      [ "${latest_seed_status}" != "queued" ] &&
      [ "${latest_seed_status}" != "in_progress" ]; then
      if gh workflow run seed-workshop.yml >/dev/null; then
        echo "Workshop seed: started"
      else
        echo "Workshop seed: could not start; use the 'Workshop: Seed repository' task"
      fi
    else
      echo "Workshop seed: ready or already running"
    fi
  fi
else
  echo "GitHub CLI: authentication required before pushing or running workflows"
fi

echo
echo "Open the repository's 'Start here' issue when seeding finishes."
echo "Useful VS Code tasks:"
echo "  Workshop: Seed repository"
echo "  Workshop: Test solution"
echo "  Workshop: Run API"
