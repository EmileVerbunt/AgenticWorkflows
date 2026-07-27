# Participant workshop guide

## Workshop outcome

In 45 minutes you will implement one repository automation as an agentic workflow, compile it, run it, and submit it in a pull request.

## Suggested timing

| Time | Activity |
| --- | --- |
| 0-5 minutes | Open the Codespace and then the seeded start issue. |
| 5-12 minutes | Review the three pre-built workflows and the sample outputs shown by the instructor. |
| 12-15 minutes | Choose and assign one workshop issue. |
| 15-32 minutes | Create the workflow Markdown and compile it. |
| 32-40 minutes | Open, review, and merge the participant pull request. |
| 40-45 minutes | Run the workflow from `main` and record its safe output. |

## Theory: Markdown becomes guarded automation

The workflow source is a Markdown file under `.github/workflows/`. YAML frontmatter defines the execution boundary:

- `on` decides when it runs
- `permissions` controls repository reads and Copilot inference
- `tools` controls what the agent can inspect
- `safe-outputs` controls visible writes

The body tells the agent what judgment to apply. `gh aw compile` validates this source and generates a `.lock.yml` file with pinned actions and hardened execution details.

## Activity 1: Inspect a working workflow

The Codespace starts **Seed Workshop** automatically. Wait for it to finish, then open the generated start issue and assignment issues.

Open `.github/workflows/test-quality-checker.md`.

Find:

1. the manual trigger
2. `copilot-requests: write`
3. read-only repository permissions
4. the GitHub tool
5. `safe-outputs: create-issue`
6. the duplicate-issue and no-op instructions

Compare it with its generated `.lock.yml`, but do not edit the lock file.

## Activity 2: Choose an assignment

Open the repository's Issues tab and filter by `label:assignment`. Beginner assignments use issue output. Advanced assignments introduce pull-request context or sandboxed file editing.

Assign one issue to yourself and create a branch:

```bash
git switch -c workshop/<workflow-id>
```

## Activity 3: Create and compile

Create `.github/workflows/<workflow-id>.md` from the contract in your assignment issue. You may use the repository's `agentic-workflows` Copilot agent for help.

Follow [Create your first workflow](first-workflow-quickstart.md) for a copy-pasteable Copilot prompt and commands.

Compile:

```bash
gh aw compile <workflow-id> --validate
```

Fix every error and warning. Commit the Markdown source and generated lock file together.

## Activity 4: Submit and merge

Push your branch and open a pull request:

```bash
git push -u origin HEAD
gh pr create --fill
```

Review the workflow source and generated lock file, then merge the pull request in your participant repository.

## Activity 5: Run and review

Manual workflows must exist on the default branch before GitHub can dispatch them:

```bash
git switch main
git pull --ff-only
gh aw run <workflow-id>
```

Inspect the run in GitHub Actions. A successful result is either:

- the configured safe output, or
- an explicit no-op explaining why no write was required.

Add the workflow run URL and observed result as a comment on the merged participant pull request.

## Troubleshooting

### `gh aw` is missing

Rebuild the Codespace container. The pinned CLI is installed by `.devcontainer/postCreate.sh`.

### Compilation reports a permission warning

Add the requested read permission or reduce the GitHub toolsets. Do not solve the warning by granting broad write access.

### The workflow cannot use Copilot

Confirm the repository is in the workshop organization and the compiled workflow contains `copilot-requests: write`. Participants should not create a PAT or repository secret.

### The workflow runs but produces nothing

Read the logs for a `noop`. If neither a safe output nor a no-op is present, make the prompt's result contract explicit.

### Workshop issues or sample PR are missing

Run **Seed Workshop** manually from the Actions tab. The workflow is idempotent and will restore missing starter artifacts without duplicating existing ones.
