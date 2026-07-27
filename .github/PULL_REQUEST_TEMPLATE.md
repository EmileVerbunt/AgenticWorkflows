## Workflow

- Assignment issue:
- Workflow ID:
- Goal:

## Design

- Trigger:
- Read tools:
- Safe output:
- No-op condition:

## Evidence

- [ ] I committed both the workflow `.md` source and generated `.lock.yml`.
- [ ] `gh aw compile <workflow-id> --validate` succeeds.
- [ ] The agent job uses read-only repository permissions.
- [ ] Visible writes go through the configured safe output.
- [ ] The prompt tells the agent when to use `noop`.

## After merge

Manual workflows can only be dispatched after this pull request is merged to `main`. After merging:

1. Run the workflow.
2. Add a comment to this pull request with the run URL.
3. Link the observed issue, comment, pull request, or explicit no-op.
