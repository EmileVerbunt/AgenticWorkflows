# Build Your First Agentic Workflow

In this workshop you will compile and run a prebuilt GitHub Agentic Workflow, create a small workflow, and make the first workflow review test changes automatically on pull requests.

The workshop takes about **45 minutes**. No previous GitHub Actions or agentic-workflow experience is required.

## Workshop flow

1. Verify the prerequisites.
2. Learn what an agentic workflow and a safe output are.
3. Compile, merge, and manually run the prebuilt Test Quality Checker.
4. Complete one starter or create your own workflow, then compile, merge, and run it.
5. Update the Test Quality Checker to review pull requests changing `tests/**`.
6. Merge that workflow update before creating a separate test-change pull request.
7. Watch the workflow run automatically and post its findings as a PR comment.

## 45-minute plan

| Time | Activity |
| --- | --- |
| 0-5 minutes | Start Codespaces and verify the setup. |
| 5-10 minutes | Learn frontmatter, instructions, compilation, and safe outputs. |
| 10-16 minutes | Compile and merge the prebuilt workflow; start its manual run. |
| 16-27 minutes | Complete, compile, and merge another workflow; start its run. |
| 27-35 minutes | Refine and merge the test-only PR behavior. |
| 35-40 minutes | Weaken the sample test and open a pull request. |
| 40-45 minutes | Inspect the automatic comment and explore next ideas. |

**Fast path:** choose the duplicate-code starter, keep one trigger and one safe output, and continue to the next step while workflow runs complete in the background.

## Step 1: Verify the prerequisites

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

It also creates a repository ruleset that requires all changes to `main` to use pull requests. No approving review is required, so you can merge your own workshop PRs.

You need a GitHub Copilot seat and GitHub Actions enabled under **Settings > Actions**.

<details>
<summary>Verify the Codespace and repository rules</summary>

```bash
gh auth status
gh aw version
copilot --version
dotnet --version
dotnet test AgenticWorkflows.slnx
gh api "repos/{owner}/{repo}/rulesets?includes_parents=true" --jq '.[].name'
```

Replace `{owner}/{repo}` with your participant repository. The output should include:

```text
Workshop: Require pull requests
```

Expected gh-aw version:

```text
gh aw version v0.83.1
```

</details>

<details>
<summary>If the ruleset could not be created automatically</summary>

Open **Settings > Rules > Rulesets > New branch ruleset**:

1. Name it `Workshop: Require pull requests`.
2. Target the default branch.
3. Enable **Require a pull request before merging**.
4. Set required approvals to `0`.
5. Enable the ruleset.

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

## Step 2: Understand agentic workflows and safe outputs

An agentic workflow is a Markdown file in `.github/workflows/`.

It has two parts:

1. **YAML frontmatter** between `---` markers. This defines when the workflow runs, what it may read, which tools it can use, and which safe outputs it may request.
2. **Natural-language instructions** after the frontmatter. These explain what the agent should investigate, what a useful result looks like, and when it should use `noop`.

`gh aw compile` validates the Markdown and creates a hardened `.lock.yml` file that GitHub Actions can run.

### What is a safe output?

A safe output is a controlled GitHub write operation declared under `safe-outputs:`.

The agent itself remains read-only. It requests an operation using structured output, and a separate permission-controlled job validates and performs that operation. This limits what can be changed, how many changes can be made, and where they can be applied.

Examples include:

| Safe output | What it can do | Example use |
| --- | --- | --- |
| `create-issue` | Open a new issue | Report a test-quality gap |
| `add-comment` | Comment on an issue or PR | Review changed tests |
| `create-pull-request` | Propose file changes in a PR | Update stale documentation |
| `add-labels` | Add allowed labels | Triage incoming issues |
| `update-issue` | Update selected issue fields | Maintain a generated status section |

`noop` is always available. It is the correct result when the workflow succeeds but finds nothing useful to change.

<details>
<summary>Five safe-output configuration examples</summary>

Create one focused issue:

```yaml
safe-outputs:
  create-issue:
    title-prefix: "[quality] "
    max: 1
```

Comment once on the triggering pull request and hide the workflow's older comment:

```yaml
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
```

Create a draft documentation PR restricted to Markdown files:

```yaml
safe-outputs:
  create-pull-request:
    draft: true
    allowed-files:
      - "**/*.md"
    max: 1
```

Add only approved triage labels:

```yaml
safe-outputs:
  add-labels:
    allowed: [bug, documentation, enhancement]
    max: 2
```

Allow a workflow to update the triggering issue body:

```yaml
safe-outputs:
  update-issue:
    body: true
    target: "triggering"
    max: 1
```

</details>

See the [complete safe-output reference](https://github.github.com/gh-aw/reference/safe-outputs/) for many more output types and configuration options.

Open `.github/workflows/test-quality-checker.md` and find:

- `workflow_dispatch` and `pull_request` on newly opened PRs
- read-only permissions plus `copilot-requests: write`
- `safe-outputs: create-issue`
- the instructions describing useful and weak tests
- the explicit `noop` behavior

## Step 3: Compile and merge the prebuilt workflow

The Test Quality Checker source is complete, but its generated lock file is intentionally absent.

Create a branch and compile:

```bash
git switch -c workshop/compile-test-quality
gh aw compile test-quality-checker --validate
```

The command creates `.github/workflows/test-quality-checker.lock.yml`.

<details>
<summary>Commit, open, and merge the pull request</summary>

```bash
git add .github/workflows/test-quality-checker.lock.yml \
  .github/aw/actions-lock.json
git commit -m "Compile test quality checker"
git push -u origin HEAD
gh pr create --fill
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only
```

If `.github/aw/actions-lock.json` did not change, Git ignores it.

</details>

**Checkpoint:** the generated lock file now exists on `main`.

Run the workflow:

```bash
gh aw run test-quality-checker
gh aw status
```

The run should create a test-quality issue or explicitly report a no-op. You can continue to Step 4 while it runs.

The workflow also runs automatically when later pull requests are opened. Until Step 5, those automatic runs use the same issue output as manual runs.

## Step 4: Create another workflow

Choose one small workflow.

### Option A: Documentation updater

Complete `.github/workflows/docs-updater.md`. Its frontmatter is present, but its instruction body is empty.

It should run daily and manually, identify stale documentation, open a documentation-only PR, and use `noop` when everything is current.

### Option B: Duplicate-code detector

Complete `.github/workflows/duplicate-code-detector.md`. Its frontmatter is present, but its instruction body is empty.

It should run manually, ignore trivial similarities, avoid duplicate reports, and open focused refactoring issues or use `noop`.

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

**Recommended:** use Copilot Chat in VS Code Agent mode.

Alternatively, run `copilot` from the repository root, confirm that you trust the folder, use `/login` if prompted, and use `/diff` to review changes.

<details>
<summary>Prompt: Documentation updater</summary>

```text
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

Do not install, upgrade, or downgrade gh-aw. Use the installed v0.83.1 CLI.

Complete .github/workflows/docs-updater.md.

The workflow should run daily and keep repository documentation up to date. Identify documentation files that are out of sync with recent code changes and open a pull request with only the necessary documentation updates.

Also support workflow_dispatch so we can test it during the workshop. Keep repository access read-only, restrict the pull request to Markdown files, and use noop when no update is needed.
```

</details>

<details>
<summary>Prompt: Duplicate-code detector</summary>

```text
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

Do not install, upgrade, or downgrade gh-aw. Use the installed v0.83.1 CLI.

Complete .github/workflows/duplicate-code-detector.md.

The workflow should run on demand and detect meaningful duplicate or near-duplicate production code. Ignore tests, generated files, build artifacts, boilerplate, and trivial similarities. Avoid reporting an equivalent open issue. Open focused issues with file references, impact, refactoring guidance, and validation steps. Use noop when there is no actionable duplication.
```

</details>

<details>
<summary>Prompt template: Your own workflow</summary>

```text
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md

Do not install, upgrade, or downgrade gh-aw. Use the installed v0.83.1 CLI.

Create .github/workflows/<workflow-id>.md.

The workflow should <describe the small task>.
Run it <manually, daily, or for a pull request>.
It should inspect <repository content>.
It should create <one safe output>.
Use noop when <nothing useful needs to be created>.

Keep repository access read-only and support workflow_dispatch so we can test it during the workshop.
```

</details>

Create a branch, compile, and merge:

<details>
<summary>Commands</summary>

```bash
git switch -c workshop/<workflow-id>
gh aw compile <workflow-id> --validate
git add .github/workflows/<workflow-id>.md \
  .github/workflows/<workflow-id>.lock.yml \
  .github/aw/actions-lock.json
git commit -m "Add <workflow-id> agentic workflow"
git push -u origin HEAD
gh pr create --fill
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only
gh aw run <workflow-id>
gh aw status
```

</details>

Fix every compile warning in the Markdown source. Never edit a generated `.lock.yml` by hand.

**Checkpoint:** your workflow is merged and its manual run has started. Continue while it runs.

## Step 5: Refine pull-request review for test changes

The prebuilt workflow already runs manually and when a pull request is opened. Now refine its PR behavior so it runs only for test changes, reruns when the PR changes, and comments directly on the PR.

The refinement must be merged to `main` **before** opening the test-change PR so that PR uses the new path filter and comment output.

Create a branch:

```bash
git switch -c workshop/test-quality-trigger
```

<details>
<summary>Copy-paste update prompt</summary>

```text
Update .github/workflows/test-quality-checker.md using https://raw.githubusercontent.com/github/gh-aw/main/create.md.

Do not install, upgrade, or downgrade gh-aw. Use the installed v0.83.1 CLI.

Keep the existing workflow_dispatch trigger, pull_request opened trigger, and create-issue behavior for manual runs.

Refine pull_request to run for opened, synchronize, and reopened, but only when files under tests/** change. Keep the agent job read-only. Add the add-comment safe output for the triggering pull request.

For pull-request runs, review the changed test files and relevant production behavior. Post one concise pull-request comment with:
- what the changed tests cover well
- concrete weak or missing assertions
- suggested unhappy-flow tests
- validation commands

Do not create an issue during a pull-request run. Avoid duplicate comments and use noop when the changed tests provide sufficient meaningful coverage.
```

</details>

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
    max: 3
  add-comment:
    max: 1
    hide-older-comments: true
```

</details>

Compile, open a PR, and merge the trigger before continuing:

<details>
<summary>Commands</summary>

```bash
gh aw compile test-quality-checker --validate
git add .github/workflows/test-quality-checker.md \
  .github/workflows/test-quality-checker.lock.yml \
  .github/aw/actions-lock.json
git commit -m "Review test changes on pull requests"
git push -u origin HEAD
gh pr create --fill
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only
```

</details>

**Checkpoint:** the test-only PR trigger and comment output are now present on `main`.

## Step 6: Create the test-change pull request

Create a separate branch:

```bash
git switch -c workshop/weaken-test
```

Open `tests/AgenticWorkflows.Api.Tests/WeakCoverageTests.cs`.

Replace:

```csharp
Assert.False(string.IsNullOrWhiteSpace(summary.Health));
```

with:

```csharp
Assert.NotNull(summary.Health);
```

The test still passes, but it provides less confidence. That gives the workflow something useful to review.

```bash
dotnet test AgenticWorkflows.slnx
```

<details>
<summary>Commit and create the pull request</summary>

```bash
git add tests/AgenticWorkflows.Api.Tests/WeakCoverageTests.cs
git commit -m "Weaken summary health assertion"
git push -u origin HEAD
gh pr create --fill
```

</details>

Do not merge this pull request yet.

## Step 7: Watch the automatic review

Watch the pull-request checks:

```bash
gh pr checks --watch
```

You can also open the **Actions** tab or run:

```bash
gh aw status
```

When the workflow completes, refresh the pull request. The Test Quality Checker should post its findings as a PR comment, or explicitly no-op if it finds no actionable problem.

## You are done when

- [ ] You compiled and manually ran the prebuilt Test Quality Checker.
- [ ] You completed a starter workflow or created a small workflow of your own.
- [ ] You compiled and manually ran your workflow.
- [ ] The refined test-only PR trigger and comment output are merged to `main`.
- [ ] You opened a separate pull request changing a file under `tests/**`.
- [ ] The workflow ran automatically.
- [ ] The pull request contains the workflow's comment or an explicit no-op result.

## The art of the possible

The same pattern can automate much more:

| Trigger | Agent judgment | Safe output |
| --- | --- | --- |
| Every morning | Summarize repository activity and risks | `create-issue` |
| Pull request opened | Review tests, docs, security, or architecture | `add-comment` |
| Documentation drift found | Prepare the smallest useful update | `create-pull-request` |
| New issue opened | Classify intent and ownership | `add-labels` |
| Milestone review | Refresh a generated status section | `update-issue` |

Start with a narrow question, one safe output, and a clear `noop`. Expand only after the small workflow is useful and trustworthy.

More guided workflow ideas are available in [`samples/`](samples/):

- [API error contract reviewer](samples/api-error-contract-reviewer.md)
- [API reference generator](samples/api-reference-generator.md)
- [Observability gap finder](samples/observability-gap-finder.md)
- [Pull-request test-plan reviewer](samples/pull-request-test-plan-reviewer.md)

## Troubleshooting

<details>
<summary>A push to <code>main</code> is rejected</summary>

That is expected. Create a branch, push it, open a pull request, and merge the PR.

</details>

<details>
<summary>The workflow does not appear in GitHub Actions</summary>

Confirm its generated `.lock.yml` is merged to `main`. Manual workflows must exist on the default branch before they can be dispatched.

</details>

<details>
<summary>The test pull-request workflow did not start</summary>

Confirm the trigger refinement was merged before the test PR was created, the test PR changes a file under `tests/**`, and the generated lock file contains the path-filtered `pull_request` trigger.

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

## Further reading

- [Safe outputs](https://github.github.com/gh-aw/reference/safe-outputs/)
- [GitHub Agentic Workflows quick start](https://github.github.com/gh-aw/setup/quick-start/)
- [GitHub Agentic Workflows documentation](https://github.github.com/gh-aw/)
