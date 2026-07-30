<!-- workshop-assignment:pull-request-test-plan-reviewer -->
# Assignment: Build a pull request test-plan reviewer

**Level:** Advanced  
**Suggested workflow ID:** `pull-request-test-plan-reviewer`

## Goal

Create an agentic workflow that reviews pull requests for behavioral risk, missing tests, and missing documentation, then leaves one concise review comment.

Use the seeded open pull request labeled `sample-pr` as the workshop target.

## Workflow contract

- Trigger: `pull_request` for opened, synchronized, and reopened pull requests
- Optional workshop trigger: `workflow_dispatch` with a pull-request number input
- Scope: production, test, and documentation changes
- Permissions: `contents: read`, `pull-requests: read`, and `copilot-requests: write`
- GitHub tool: read pull-request files, details, and existing comments
- Safe output: `add-comment`
- Do not approve, request changes, edit code, or create another pull request.

## Agent instructions

Ask the agent to:

1. Read the pull-request intent, diff, existing tests, and relevant documentation.
2. Identify only concrete behavioral risks introduced by the change.
3. Check whether an equivalent workflow comment is already present.
4. Add one comment with sections for risk, missing coverage, documentation impact, and suggested validation.
5. Use `noop` when the change is adequately covered, irrelevant, or already reviewed.

Keep the comment short enough for a developer to act on during review.

## Acceptance criteria

- [ ] `.github/workflows/pull-request-test-plan-reviewer.md` exists.
- [ ] Pull-request events are scoped to useful activity types.
- [ ] The agent job has read-only permissions.
- [ ] The only visible write uses `safe-outputs: add-comment`.
- [ ] The prompt requires duplicate-comment detection and `noop`.
- [ ] `gh aw compile pull-request-test-plan-reviewer --validate` succeeds.
- [ ] The generated `.lock.yml` is committed.
- [ ] After the participant PR is merged, a run against the seeded sample PR adds one useful comment or explicitly no-ops.

## Run and submit

<details>
<summary>Commands</summary>

```bash
gh aw compile pull-request-test-plan-reviewer --validate
git add .github/workflows/pull-request-test-plan-reviewer.md \
  .github/workflows/pull-request-test-plan-reviewer.lock.yml
git commit -m "Add pull request test-plan reviewer"
git push -u origin HEAD
gh pr create --fill
```

Review and merge the participant pull request. Then update `main` and run the workflow, providing the open `sample-pr` pull-request number when prompted:

```bash
git switch main
git pull --ff-only
gh aw run pull-request-test-plan-reviewer
```

</details>

Add the run link and result as a comment on the merged participant pull request.
