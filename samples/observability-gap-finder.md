<!-- workshop-assignment:observability-gap-finder -->
# Assignment: Build an observability gap finder

**Level:** Beginner  
**Suggested workflow ID:** `observability-gap-finder`

## Goal

Create an on-demand agentic workflow that reviews mutation and failure paths in the API and opens one focused issue when important logging or diagnostics are missing.

## Workflow contract

- Trigger: `workflow_dispatch`
- Read: `src/AgenticWorkflows.Api/Program.cs` and `src/AgenticWorkflows.Api/Services/`
- Permissions: read-only repository access plus `copilot-requests: write`
- GitHub tool: read issues so the workflow can avoid duplicate reports
- Safe output: `create-issue`
- Do not edit source files or open a pull request.

## Agent instructions

Ask the agent to:

1. Inspect create validation failures, not-found responses, and unexpected failure boundaries.
2. Separate actionable observability gaps from routine requests that should not be noisy.
3. Search open issues for an equivalent finding.
4. Create at most one issue containing file references, impact, a practical recommendation, and a validation approach.
5. Use `noop` when no high-value gap exists or an equivalent issue is already open.

## Acceptance criteria

- [ ] `.github/workflows/observability-gap-finder.md` exists.
- [ ] The workflow is manually triggered.
- [ ] The agent job has no direct write permission to repository contents or issues.
- [ ] Visible writes use `safe-outputs: create-issue`.
- [ ] The prompt requires duplicate detection and `noop`.
- [ ] `gh aw compile observability-gap-finder --validate` succeeds.
- [ ] The generated `.lock.yml` is committed.
- [ ] After the participant PR is merged, a run produces either one useful issue or an explicit no-op.

## Run and submit

<details>
<summary>Commands</summary>

```bash
gh aw compile observability-gap-finder --validate
git add .github/workflows/observability-gap-finder.md \
  .github/workflows/observability-gap-finder.lock.yml
git commit -m "Add observability gap finder workflow"
git push -u origin HEAD
gh pr create --fill
```

Review and merge the participant pull request, then run from `main`:

```bash
git switch main
git pull --ff-only
gh aw run observability-gap-finder
```

</details>

Add the run link and result as a comment on the merged participant pull request.
