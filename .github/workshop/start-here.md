<!-- workshop:start-here -->
# Start here: Build your first agentic workflow

Welcome to the **Agentic Workflows workshop**. In about 45 minutes you will inspect working examples, choose an assignment, build a workflow in Markdown, compile it, run it, and open a pull request.

## What you will learn

- How a Markdown workflow combines triggers, permissions, tools, and natural-language instructions.
- Why agent jobs remain read-only and visible writes use safe outputs.
- How `gh aw compile` creates a hardened `.lock.yml`.
- How to run a workflow and review its issue, comment, pull request, or no-op.

## Step 1: Open the Codespace

Use **Code > Codespaces > Create codespace on main**.

The container installs the .NET 10 SDK, GitHub CLI, gh-aw, Copilot extensions, and project dependencies. It also builds and tests the solution.

When VS Code opens, run:

```bash
gh aw version
dotnet test AgenticWorkflows.slnx
```

## Step 2: Read the working examples

Open these workflow source files:

- `.github/workflows/docs-updater.md`
- `.github/workflows/test-quality-checker.md`
- `.github/workflows/duplicate-code-detector.md`

Look for:

1. the trigger under `on`
2. read-only permissions
3. `copilot-requests: write`
4. the GitHub read tool
5. `safe-outputs`
6. the conditions that produce a visible result or `noop`

The instructor may run one of these examples. Their generated issue demonstrates the handoff from AI analysis to human review.

## Step 3: Choose one assignment

Open an issue labeled `assignment` and assign it to yourself:

- **Beginner:** Observability gap finder
- **Beginner:** API error contract reviewer
- **Advanced:** Pull request test-plan reviewer
- **Advanced:** API reference generator

The advanced pull-request reviewer uses the open pull request labeled `sample-pr`.

Open `docs/first-workflow-quickstart.md` for a copy-pasteable Copilot prompt and the shortest implementation path.

## Step 4: Build, compile, and submit

Create a branch:

```bash
git switch -c workshop/<your-workflow-id>
```

Create the workflow source under `.github/workflows/`, then compile it:

```bash
gh aw compile <your-workflow-id> --validate
```

Commit both the `.md` source and generated `.lock.yml`, then open your pull request:

```bash
git push -u origin HEAD
gh pr create --fill
```

Complete the pull request template, review the generated workflow, and merge the pull request.

## Step 5: Run from `main`

GitHub only dispatches a new manual workflow after it exists on the default branch. Update your local branch after the merge:

```bash
git switch main
git pull --ff-only
gh aw run <your-workflow-id>
```

Use the command and inputs in your assignment issue. Add the run link and observed safe output as a comment on your merged participant pull request.

## Finished

You are done when your merged pull request contains:

- the workflow Markdown source
- the generated lock file
- a successful compile
- a follow-up comment with evidence of an issue, comment, pull request, or explicit no-op
