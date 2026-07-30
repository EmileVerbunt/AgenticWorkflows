<!-- workshop-assignment:api-reference-generator -->
# Assignment: Build an API reference generator

**Level:** Advanced  
**Suggested workflow ID:** `api-reference-generator`

## Goal

Create an on-demand agentic workflow that derives an API reference from the actual endpoint and model definitions, then opens a draft pull request containing the documentation.

## Workflow contract

- Trigger: `workflow_dispatch`
- Read: `Program.cs`, request/response models, service behavior, and `README.md`
- Permissions: read-only repository access plus `copilot-requests: write`
- Tools: repository reads and file editing inside the sandbox
- Safe output: `create-pull-request`
- Allowed file: `API_REFERENCE.md` only

## Agent instructions

Ask the agent to:

1. Derive routes, methods, request fields, response behavior, validation, and representative examples from code.
2. Create or update `API_REFERENCE.md`.
3. Keep generated content concise and avoid undocumented assumptions.
4. Open a draft pull request restricted to the allowed documentation file.
5. Use `noop` if the file is already accurate and no change is needed.

## Acceptance criteria

- [ ] `.github/workflows/api-reference-generator.md` exists.
- [ ] The workflow is manually triggered.
- [ ] The agent job has no direct contents write permission.
- [ ] `create-pull-request.allowed-files` permits only `API_REFERENCE.md`.
- [ ] The prompt requires code-derived documentation and `noop`.
- [ ] `gh aw compile api-reference-generator --validate` succeeds.
- [ ] The generated `.lock.yml` is committed.
- [ ] After the participant PR is merged, a run creates a draft documentation PR or explicitly no-ops.

## Run and submit

<details>
<summary>Commands</summary>

```bash
gh aw compile api-reference-generator --validate
git add .github/workflows/api-reference-generator.md \
  .github/workflows/api-reference-generator.lock.yml
git commit -m "Add API reference generator"
git push -u origin HEAD
gh pr create --fill
```

Review and merge the participant pull request, then run:

```bash
git switch main
git pull --ff-only
gh aw run api-reference-generator
```

</details>

Add the run link and generated documentation PR or no-op as a comment on the merged participant pull request.
