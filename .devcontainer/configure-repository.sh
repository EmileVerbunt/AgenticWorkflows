#!/usr/bin/env bash
set -euo pipefail

RULESET_NAME="Workshop: Require pull requests"
TEMPLATE_REPOSITORY="EmileVerbunt/AgenticWorkflows"

repository="$(gh repo view --json nameWithOwner --jq .nameWithOwner 2>/dev/null || true)"
if [ -z "${repository}" ] || [ "${repository}" = "${TEMPLATE_REPOSITORY}" ]; then
  exit 0
fi

existing_ruleset="$(
  {
    gh api "repos/${repository}/rulesets?includes_parents=true" \
      --paginate \
      --jq ".[] | select(.name == \"${RULESET_NAME}\") | .id" 2>/dev/null ||
      true
  } |
    head -n 1
)"

if [ -n "${existing_ruleset}" ]; then
  echo "[repository] Pull requests are required for main"
  exit 0
fi

if gh api --method POST "repos/${repository}/rulesets" --input - >/dev/null <<'JSON'
{
  "name": "Workshop: Require pull requests",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["~DEFAULT_BRANCH"],
      "exclude": []
    }
  },
  "rules": [
    {
      "type": "deletion"
    },
    {
      "type": "non_fast_forward"
    },
    {
      "type": "pull_request",
      "parameters": {
        "allowed_merge_methods": ["merge", "squash", "rebase"],
        "dismiss_stale_reviews_on_push": false,
        "require_code_owner_review": false,
        "require_last_push_approval": false,
        "required_approving_review_count": 0,
        "required_review_thread_resolution": false
      }
    }
  ]
}
JSON
then
  echo "[repository] Configured main to require pull requests"
else
  echo "[repository] Could not configure the main-branch ruleset automatically." >&2
  echo "[repository] Create a branch ruleset in Settings > Rules > Rulesets that requires pull requests for the default branch." >&2
fi
