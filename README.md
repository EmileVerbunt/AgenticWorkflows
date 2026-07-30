# Build Your First Agentic Workflow

In this workshop you will compile and run a prebuilt GitHub Agentic Workflow, create a small workflow, and then make the first workflow review test changes automatically on pull requests.

The workshop takes about **45 minutes**. No previous GitHub Actions or agentic-workflow experience is required.

## Workshop flow

1. Install and verify the prerequisites.
2. Learn what an agentic workflow is.
3. Compile, commit, and manually run the prebuilt test-quality workflow.
4. Complete one of two starters or create your own workflow, then compile and run it.
5. Update the test-quality workflow to run automatically for pull requests that change `tests/**`.
6. Make a test change and open a pull request.
7. Watch the workflow review the change and post a pull-request comment.

## Step 1: Install and verify the prerequisites

### Recommended: GitHub Codespaces

1. Create your participant repository from this GitHub template.
2. Select **Code > Codespaces > Create codespace on main**.
3. Wait until the terminal says **Workshop environment is ready**.

The Codespace installs:

- .NET 10
- GitHub CLI
- GitHub Copilot CLI
- GitHub Copilot and C# VS Code extensions
- pinned `gh aw` v0.83.1

You also need a GitHub Copilot seat and GitHub Actions enabled under **Settings > Actions**.

<details>
<summary>Verify the Codespace</summary>

```bash
gh auth status
gh aw version
copilot --version
dotnet --version
dotnet test AgenticWorkflows.slnx
```

Expected gh-aw version:

```text
gh aw version v0.83.1
```

</details>

<details>
<summary>Use a local machine instead</summary>

Codespaces is the recommended path. Local use requires Linux, macOS, or Windows with WSL, plus .NET 10 and these tools:

```bash
gh --version
gh auth status
gh extension install github/gh-aw
gh aw version
curl -fsSL https://gh.io/copilot-install | bash
copilot --version
dotnet --version
```

Run `gh auth login` when GitHub CLI reports that authentication is required.

</details>

## Step 2: What is an agentic workflow?

An agentic workflow is a Markdown file in `.github/workflows/`.

It has two parts:

1. **YAML frontmatter** between `---` markers. This defines when the workflow runs, what it may read, which tools it can use, and which safe outputs it may create.
2. **Natural-language instructions** after the frontmatter. These explain what the agent should investigate, what a useful result looks like, and when it should use `noop`.

`gh aw compile` validates the Markdown and creates a hardened `.lock.yml` file that GitHub Actions can run.

The main agent receives read-only repository permissions. Visible changes such as issues, comments, and pull requests are handled by controlled safe outputs.

Open `.github/workflows/test-quality-checker.md` and find:

- `on: workflow_dispatch`
- read-only permissions plus `copilot-requests: write`
- `safe-outputs: create-issue`
- the instructions describing useful and weak tests
- the explicit `noop` behavior

## Step 3: Compile the prebuilt test-quality workflow

The workflow source is complete, but its generated lock file is intentionally absent.

Compile it:

```bash
gh aw compile test-quality-checker --validate
```

The command creates `.github/workflows/test-quality-checker.lock.yml`.

Commit and push the generated workflow to `main`:

<details>
<summary>Commit commands</summary>

```bash
git add .github/workflows/test-quality-checker.lock.yml \
  .github/aw/actions-lock.json
git commit -m "Compile test quality checker"
git push
```

If `.github/aw/actions-lock.json` did not change, Git ignores it.

</details>

## Step 4: Run the prebuilt workflow

The lock file must be on `main` before GitHub can dispatch the workflow.

```bash
gh aw run test-quality-checker
gh aw status
```

Open the run when it completes. The workflow should create a test-quality issue or explicitly report a no-op.

## Step 5: Create another workflow

Choose one small workflow:

### Option A: Documentation updater

Complete `.github/workflows/docs-updater.md`. Its frontmatter is present, but its instruction body is empty.

The finished workflow should:

- run daily and manually
- identify documentation that no longer matches the code
- open a pull request containing only necessary documentation changes
- use `noop` when everything is current

### Option B: Duplicate-code detector

Complete `.github/workflows/duplicate-code-detector.md`. Its frontmatter is present, but its instruction body is empty.

The finished workflow should:

- run manually
- inspect production code
- ignore tests, generated files, boilerplate, and trivial similarities
- avoid reporting an equivalent open issue
- open focused refactoring issues or use `noop`

### Option C: Your own workflow

Choose a repetitive repository task that still needs judgment. Keep it small enough to describe in one or two sentences.

Answer:

1. When should it run?
2. What should it inspect?
3. What one safe output should it create?
4. When should it use `noop`?

<details>
<summary>Ideas if you are stuck</summary>

- Find public API behavior without a meaningful test.
- Find inconsistent API error responses.
- Find missing logs around important failure paths.
- Review a pull request and suggest a test plan.
- Create release notes from recently merged pull requests.

</details>

### Ask Copilot to create it

Use Copilot Chat in VS Code Agent mode, or run `copilot` in the terminal and use `/diff` to review its changes.

<details>
<summary>Prompt: Documentation updater</summary>

```text
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

Complete .github/workflows/docs-updater.md.

The workflow should run daily and keep repository documentation up to date. Identify documentation files that are out of sync with recent code changes and open a pull request with only the necessary documentation updates.

Also support workflow_dispatch so we can test it during the workshop. Keep repository access read-only, restrict the pull request to documentation files, and use noop when no update is needed.
```

</details>

<details>
<summary>Prompt: Duplicate-code detector</summary>

```text
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

Complete .github/workflows/duplicate-code-detector.md.

The workflow should run on demand and detect meaningful duplicate or near-duplicate production code. Ignore tests, generated files, build artifacts, boilerplate, and trivial similarities. Avoid reporting an equivalent open issue. Open focused issues with file references, impact, refactoring guidance, and validation steps. Use noop when there is no actionable duplication.
```

</details>

<details>
<summary>Prompt template: Your own workflow</summary>

```text
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

Create .github/workflows/<workflow-id>.md.

The workflow should <describe the small task>.
Run it <manually, daily, or for a pull request>.
It should inspect <repository content>.
It should create <one safe output>.
Use noop when <nothing useful needs to be created>.

Keep repository access read-only and support workflow_dispatch so we can test it during the workshop.
```

</details>

Compile, commit, push, and run the workflow:

<details>
<summary>Commands</summary>

```bash
gh aw compile <workflow-id> --validate
git add .github/workflows/<workflow-id>.md \
  .github/workflows/<workflow-id>.lock.yml \
  .github/aw/actions-lock.json
git commit -m "Add <workflow-id> agentic workflow"
git push
gh aw run <workflow-id>
gh aw status
```

</details>

Fix every compile warning in the Markdown source. Never edit a generated `.lock.yml` by hand.

## Step 6: Run the test-quality workflow on test pull requests

Now evolve the prebuilt workflow. It should keep its manual trigger and issue output, but also review pull requests whenever a file under `tests/**` changes.

For pull-request runs, it should post one concise comment on the triggering pull request instead of creating an issue.

Create the pull-request branch:

```bash
git switch -c workshop/test-quality-pr
```

Ask Copilot to update the workflow:

<details>
<summary>Copy-paste update prompt</summary>

```text
Update .github/workflows/test-quality-checker.md using https://raw.githubusercontent.com/github/gh-aw/main/create.md.

Keep the existing workflow_dispatch trigger and create-issue behavior for manual runs.

Also run on pull_request events for opened, synchronize, and reopened, but only when files under tests/** change. Keep the agent job read-only. Add the add-comment safe output for the triggering pull request.

For pull-request runs, review the changed test files and relevant production behavior. Post one concise pull-request comment with:
- what the changed tests cover well
- concrete weak or missing assertions
- suggested unhappy-flow tests
- validation commands

Do not create an issue during a pull-request run. Avoid duplicate comments and use noop when the changed tests provide sufficient meaningful coverage.
```

</details>

Review the result. The frontmatter should now include:

- the existing `workflow_dispatch`
- `pull_request` with `types: [opened, synchronize, reopened]`
- `paths` restricted to `tests/**`
- the existing `create-issue` safe output
- an `add-comment` safe output

<details>
<summary>Expected trigger and safe-output shape</summary>

Keep the existing settings around these sections:

```yaml
on:
  workflow_dispatch:
  pull_request:
    types: [opened, synchronize, reopened]
    paths:
      - "tests/**"

safe-outputs:
  create-issue:
    title-prefix: "[test-quality] "
    labels: [automation, testing]
    max: 3
  add-comment:
    max: 1
    hide-older-comments: true
```

</details>

Compile the updated workflow:

```bash
gh aw compile test-quality-checker --validate
```

Do not push this change to `main` yet. It will be part of the pull request in the next step.

## Step 7: Make a test change

Open `tests/AgenticWorkflows.Api.Tests/WeakCoverageTests.cs`.

Make the existing summary-health test deliberately weaker by replacing:

```csharp
Assert.False(string.IsNullOrWhiteSpace(summary.Health));
```

with:

```csharp
Assert.NotNull(summary.Health);
```

This test still passes, but it provides less confidence. That gives the workflow something useful to review.

Run the tests:

```bash
dotnet test AgenticWorkflows.slnx
```

## Step 8: Commit and create the pull request

Commit the workflow update, generated lock file, and test change together:

<details>
<summary>Commit and PR commands</summary>

```bash
git add .github/workflows/test-quality-checker.md \
  .github/workflows/test-quality-checker.lock.yml \
  .github/aw/actions-lock.json \
  tests/AgenticWorkflows.Api.Tests/WeakCoverageTests.cs
git commit -m "Review test changes with test quality checker"
git push -u origin HEAD
gh pr create --fill
```

</details>

The pull request changes a file under `tests/**`, so the updated workflow should start automatically.

## Step 9: Watch the automatic review

Watch the pull-request checks:

```bash
gh pr checks --watch
```

You can also open the **Actions** tab or run:

```bash
gh aw status
```

When the workflow completes, refresh the pull request. The Test Quality Checker should post its findings as a pull-request comment, or explicitly no-op if it finds no actionable problem.

## You are done when

- [ ] You compiled and manually ran the prebuilt test-quality workflow.
- [ ] You completed a starter workflow or created a small workflow of your own.
- [ ] You compiled and manually ran your workflow.
- [ ] The test-quality workflow listens to pull requests changing `tests/**`.
- [ ] You opened a pull request with a test change.
- [ ] The workflow ran automatically.
- [ ] The pull request contains the workflow's comment or an explicit no-op result.

## Troubleshooting

<details>
<summary>The workflow does not appear in GitHub Actions</summary>

Confirm its generated `.lock.yml` is committed and pushed. Manual workflows must exist on `main` before they can be dispatched.

</details>

<details>
<summary>The pull-request workflow did not start</summary>

Confirm the pull request contains a changed file under `tests/**` and the generated lock file includes the `pull_request` trigger.

</details>

<details>
<summary>The workflow ran but did not comment</summary>

Check the run logs for `noop`. Also confirm the workflow has `safe-outputs: add-comment` and its instructions say to comment on the triggering pull request.

</details>

<details>
<summary>Compilation reports a warning</summary>

Ask Copilot to fix the warning in the Markdown source, then compile again. Do not edit the lock file directly.

</details>

<details>
<summary><code>gh aw</code> or <code>copilot</code> is missing</summary>

Rebuild the Codespace container. It installs or repairs both CLIs during creation and restart.

</details>

<details>
<summary>Facilitator preflight</summary>

1. Confirm the repository is configured as a template.
2. Confirm participants can create repositories in the workshop organization.
3. Confirm Copilot, Codespaces, Actions, and Issues are enabled.
4. Enable **Allow GitHub Actions to create and approve pull requests**.
5. Complete the full participant path in a disposable repository.

</details>

## Further reading

- [GitHub Agentic Workflows quick start](https://github.github.com/gh-aw/setup/quick-start/)
- [GitHub Agentic Workflows documentation](https://github.github.com/gh-aw/)
