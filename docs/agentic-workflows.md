# Agentic workflow design notes

GitHub Agentic Workflows use markdown files with YAML frontmatter. The frontmatter defines triggers, permissions, tools, network access, and safe outputs. The markdown body contains the natural-language task instructions for the coding agent.

In this repo, workflow source files live in `.github\workflows`:

| Workflow | Trigger | Main safe output | Purpose |
| --- | --- | --- | --- |
| `docs-updater.md` | Manual dispatch only | Draft pull request or issue | Compare current code behavior with docs and open a PR or issue for missing documentation updates. |
| `test-quality-checker.md` | Manual dispatch only | Issue, comment, or draft pull request | Improve test value and maintainability. |
| `duplicate-code-detector.md` | Manual dispatch only | Issue | Report meaningful duplicate code patterns. |

## Safety posture

The workflows are designed for demos and use conservative defaults:

- Read-only repository permissions for the agentic portion.
- `safe-outputs` for writes such as issues, comments, and draft pull requests.
- Human review before merging AI-generated changes.
- Small maximum output counts to avoid noisy runs.
- Manual `workflow_dispatch` triggers only, so demos run when a presenter starts them.

## Compile model

The markdown files are the editable source of truth. `gh aw compile` generates `.lock.yml` GitHub Actions workflow files with hardened execution details.

```powershell
gh aw compile
```

Commit both the source `.md` files and generated `.lock.yml` files when the Agentic Workflows CLI is available.

If the workflows do not appear in the GitHub Actions tab, generate lock files first. The preferred local command is:

```bash
gh aw compile --validate --purge
```

If local `gh-aw` is unavailable, run **Compile Agentic Workflows** from the Actions tab, download the `compiled-agentic-workflows` artifact, and commit the generated files manually. The compiler workflow does not push changes itself because demo workflows should remain manually controlled and GitHub's default Actions token cannot update workflow files in this scenario.

After the generated lock files are present on the default branch, the individual agentic workflows appear as manually runnable GitHub Actions.

The default engine is Copilot. Before running the compiled workflows, add the repository Actions secret `COPILOT_GITHUB_TOKEN` as described in the gh-aw authentication docs.

## Demo-specific code hooks

- `WorkItemService` has validation and summary behavior that documentation and tests can reason about.
- `WeakCoverageTests` contains intentionally weak tests to demonstrate that test quality is more important than line coverage alone.
- `NotificationComposer` contains a bounded duplicated pattern for the duplicate-code detector demo.
