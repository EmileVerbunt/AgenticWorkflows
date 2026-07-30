## Workflow

- Workshop step:
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

For a manual workflow, merge it to `main` before dispatching it. For a pull-request workflow:

1. Confirm the pull request matches its configured event and path filters.
2. Wait for the workflow check to complete.
3. Link the observed issue, comment, pull request, or explicit no-op.
