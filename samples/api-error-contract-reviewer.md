<!-- workshop-assignment:api-error-contract-reviewer -->
# Assignment: Build an API error contract reviewer

**Level:** Beginner  
**Suggested workflow ID:** `api-error-contract-reviewer`

## Goal

Create an on-demand agentic workflow that evaluates whether validation, not-found, and unexpected-error responses form a consistent public API contract.

## Workflow contract

- Trigger: `workflow_dispatch`
- Read: API routes, request models, service validation, tests, and current documentation
- Permissions: read-only repository access plus `copilot-requests: write`
- GitHub tool: read issues so the workflow can avoid duplicate reports
- Safe output: `create-issue`
- Do not change API behavior.

## Agent instructions

Ask the agent to:

1. Map each public route to its failure responses.
2. Compare status codes, payload shapes, field names, and documented behavior.
3. Distinguish concrete inconsistencies from optional design improvements.
4. Search open issues for the same contract gap.
5. Create at most one issue with a small endpoint table, recommended contract, affected files, and test cases.
6. Use `noop` if the contract is sufficiently consistent or already reported.

## Acceptance criteria

- [ ] `.github/workflows/api-error-contract-reviewer.md` exists.
- [ ] The workflow is manually triggered.
- [ ] Direct permissions remain read-only.
- [ ] Visible writes use `safe-outputs: create-issue`.
- [ ] The prompt requires evidence, duplicate detection, and `noop`.
- [ ] `gh aw compile api-error-contract-reviewer --validate` succeeds.
- [ ] The generated `.lock.yml` is committed.
- [ ] After the participant PR is merged, a run produces either one actionable contract issue or an explicit no-op.

## Run and submit

<details>
<summary>Commands</summary>

```bash
gh aw compile api-error-contract-reviewer --validate
git add .github/workflows/api-error-contract-reviewer.md \
  .github/workflows/api-error-contract-reviewer.lock.yml
git commit -m "Add API error contract reviewer"
git push -u origin HEAD
gh pr create --fill
```

Review and merge the participant pull request, then run:

```bash
git switch main
git pull --ff-only
gh aw run api-error-contract-reviewer
```

</details>

Add the run link and result as a comment on the merged participant pull request.
