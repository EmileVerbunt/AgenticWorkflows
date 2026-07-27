# Agentic workflow design notes

GitHub Agentic Workflows combine YAML frontmatter with natural-language task instructions. The Markdown file is the editable source; `gh aw compile` generates the hardened `.lock.yml` consumed by GitHub Actions.

## Repository examples

| Workflow | Trigger | Safe output |
| --- | --- | --- |
| `docs-updater.md` | Manual | Create issue |
| `test-quality-checker.md` | Manual | Create issue |
| `duplicate-code-detector.md` | Manual | Create issue |

## Security model

- Repository permissions remain read-only for the agent job.
- `copilot-requests: write` authenticates inference with the short-lived GitHub Actions token and the managed organization's Copilot entitlement.
- Participants do not create or store `COPILOT_GITHUB_TOKEN`.
- GitHub mutations use `safe-outputs`, not direct write scopes or shell commands.
- Every workflow defines when to use `noop`.
- Issue and comment workflows check for equivalent existing output before writing.

## Compilation

The repository pins gh-aw `v0.83.1` in Codespaces and setup workflows.

```bash
gh aw compile --validate --purge
```

Commit the workflow source, generated lock file, and `.github/aw/actions-lock.json` changes together. Never hand-edit a `.lock.yml`.

## Participant design checklist

1. Does the trigger match the assignment?
2. Are repository permissions read-only?
3. Is `copilot-requests: write` present?
4. Are the enabled read tools minimal?
5. Does each visible write use the requested safe output?
6. Is `create-pull-request.allowed-files` restricted?
7. Does the prompt define useful evidence and ignore low-value findings?
8. Does it search for duplicate output where applicable?
9. Does it explicitly use `noop` when no write is needed?
10. Does compilation finish with no warnings?

## Demo hooks in the application

- `WorkItemService` contains validation, ordering, lookup, and summary behavior.
- `WeakCoverageTests` intentionally contains superficial assertions.
- `NotificationComposer` contains bounded duplication.
- The seeded sample PR adds a status and updates only a weak enum-count test, giving the advanced reviewer a concrete risk to analyze.
