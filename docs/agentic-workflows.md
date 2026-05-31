# Agentic workflow design notes

GitHub Agentic Workflows use markdown files with YAML frontmatter. The frontmatter defines triggers, permissions, tools, network access, and safe outputs. The markdown body contains the natural-language task instructions for the coding agent.

In this repo, workflow source files live in `.github\workflows`:

| Workflow | Trigger | Main safe output | Purpose |
| --- | --- | --- | --- |
| `docs-updater.md` | Push to `main`, manual dispatch | Draft pull request | Keep README and docs synchronized with the API. |
| `test-quality-checker.md` | Manual dispatch, scheduled run, `/test-quality` command | Issue, comment, or draft pull request | Improve test value and maintainability. |
| `duplicate-code-detector.md` | Manual dispatch, scheduled run | Issue | Report meaningful duplicate code patterns. |

## Safety posture

The workflows are designed for demos and use conservative defaults:

- Read-only repository permissions for the agentic portion.
- `safe-outputs` for writes such as issues, comments, and draft pull requests.
- Human review before merging AI-generated changes.
- Small maximum output counts to avoid noisy runs.

## Compile model

The markdown files are the editable source of truth. `gh aw compile` generates `.lock.yml` GitHub Actions workflow files with hardened execution details.

```powershell
gh aw compile
```

Commit both the source `.md` files and generated `.lock.yml` files when the Agentic Workflows CLI is available.

## Demo-specific code hooks

- `WorkItemService` has validation and summary behavior that documentation and tests can reason about.
- `WeakCoverageTests` contains intentionally weak tests to demonstrate that test quality is more important than line coverage alone.
- `NotificationComposer` contains a bounded duplicated pattern for the duplicate-code detector demo.
