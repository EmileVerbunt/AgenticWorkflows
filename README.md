# Build Your First Agentic Workflow

In this workshop you will delegate a code change to the GitHub Copilot coding agent, make a separate code change yourself, request a Copilot code review, and then create and run a GitHub Agentic Workflow.

The workshop takes about **45 minutes**. No previous GitHub Actions or agentic-workflow experience is required.

## Workshop flow

1. Verify the prerequisites.
2. Delegate a focused test improvement to the GitHub Copilot coding agent.
3. Make a separate code change manually and open a pull request.
4. Request a GitHub Copilot code review on your manual pull request.
5. Learn the agentic-workflow concepts while creating and running a custom workflow.
6. Manually run the prebuilt Test Quality Checker.
7. Update the Test Quality Checker to review pull requests changing `tests/**`.
8. Open a test-change pull request.
9. Watch the workflow review it and inspect the coding agent's pull request.

## 45-minute plan

| Order | Activity |
| --- | --- |
| 1 | Start Codespaces and verify the setup. |
| 2 | Start a coding-agent task. |
| 3 | Make a manual code change and open a pull request. |
| 4 | Request a Copilot code review and merge the manual change. |
| 5 | Learn the agentic-workflow concepts, then create and run one. |
| 6 | Run and refine the Test Quality Checker. |
| 7 | Open a test PR and inspect both agent-generated reviews. |

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

You need a GitHub Copilot seat, GitHub Actions enabled under **Settings > Actions**, and organization access to Copilot coding agent and Copilot code review.

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
<summary>Use macOS locally</summary>

Codespaces is the recommended path. For native macOS development, install [Homebrew](https://brew.sh/) first if it is not already available, then run:

```bash
brew install git gh
brew install --cask dotnet-sdk visual-studio-code

curl -fsSL https://gh.io/copilot-install | bash

echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
export PATH="$HOME/.local/bin:$PATH"

gh auth login
gh extension install github/gh-aw --pin v0.83.1

code --install-extension GitHub.copilot
code --install-extension ms-dotnettools.csharp
```

Clone your participant repository, open it in VS Code, and verify the setup:

```bash
git clone https://github.com/<owner>/<repository>.git
cd <repository>
code .

gh auth status
gh aw version
copilot --version
dotnet --version
dotnet test AgenticWorkflows.slnx
```

Replace `<owner>/<repository>` with your participant repository. Restart the terminal if `copilot` or `code` is not immediately available.

</details>

<details>
<summary>Use Windows locally</summary>

Open PowerShell and install the prerequisites with Windows Package Manager:

```powershell
winget install --id Git.Git --exact
winget install --id GitHub.cli --exact
winget install --id Microsoft.DotNet.SDK.10 --exact
winget install --id GitHub.Copilot --exact
winget install --id Microsoft.VisualStudioCode --exact
```

Restart PowerShell so the new commands are on `PATH`, then authenticate and install the pinned Agentic Workflows extension:

```powershell
gh auth login
gh extension install github/gh-aw --pin v0.83.1

code --install-extension GitHub.copilot
code --install-extension ms-dotnettools.csharp
```

Clone your participant repository, open it in VS Code, and verify the setup:

```powershell
git clone https://github.com/<owner>/<repository>.git
Set-Location <repository>
code .

gh auth status
gh aw version
copilot --version
dotnet --version
dotnet test AgenticWorkflows.slnx
```

Replace `<owner>/<repository>` with your participant repository. If `winget` is unavailable, install or update **App Installer** from the Microsoft Store.

</details>

## Step 2: Delegate a change to the GitHub Copilot coding agent

Start a separate cloud coding-agent task. The agent will work in the background and open its own pull request, so you can continue with the code-review exercise immediately.

1. Open the **Issues** tab on GitHub and create a new issue.
2. Use the sample instructions below as the issue body.
3. In the issue sidebar, assign the issue to **Copilot**.
4. If GitHub asks for an optional prompt, tell Copilot to follow the issue instructions and run the tests.

<details>
<summary>Sample coding-agent instructions</summary>

```text
Add focused unit tests for NotificationComposer.

Create a new test file under tests/AgenticWorkflows.Api.Tests that verifies:
- descriptions longer than 90 characters are truncated with an ellipsis
- notifications omit the due-date line when DueDate is null
- created and due-soon notifications contain their expected next-step text

Do not change production behavior unless a test exposes a real defect. Follow the existing xUnit style and run:

dotnet test AgenticWorkflows.slnx
```

</details>

Assigning the issue to Copilot starts a cloud agent session. Copilot creates a linked pull request and requests your review when the task is complete.

**Checkpoint:** the issue shows that Copilot is working. Continue without waiting.

## Step 3: Make a manual code change

While the coding agent works, add a separate API change yourself. The first version intentionally contains a missing-resource bug so the code-review agent has something meaningful to find.

> **Exercise intent:** implement and push the flawed version exactly as shown. Do not fix the bug before requesting Copilot code review. The existing tests still pass, so the review agent must identify the behavioral problem.

Create a branch:

```bash
git switch -c workshop/get-work-item-endpoint
```

Open `src/AgenticWorkflows.Api/Program.cs` and add this endpoint after the summary endpoint:

```csharp
workItems.MapGet("/{id:guid}", (Guid id, WorkItemService service) =>
        Results.Ok(service.Find(id)))
    .WithName("GetWorkItem");
```

This implementation returns `200 OK` with a `null` body when the ID does not exist instead of returning `404 Not Found`. Commit and push this known bug so Copilot can catch it in the pull request.

The repository's `.github/copilot-instructions.md` asks Copilot reviewers to verify missing-resource status codes, making this a reliable review signal.

Run the tests, commit, and open a pull request:

```bash
dotnet test AgenticWorkflows.slnx
git add src/AgenticWorkflows.Api/Program.cs
git commit -m "Add work item lookup endpoint"
git push -u origin HEAD
gh pr create --fill
```

Do not merge the pull request yet.

**Checkpoint:** your manual code-change pull request is open.

## Step 4: Request a GitHub Copilot code review

Open the manual code-change pull request you created in Step 3.

1. In the pull request sidebar, find **Reviewers**.
2. Next to **Copilot**, select **Request**.
3. Wait for the review to appear, then read any summary and inline comments.
4. Look for feedback about the endpoint returning a successful response when the work item is missing.

Copilot code review comments are advisory. They do not count as an approving review and do not block merging.

**Expected finding:** `service.Find(id)` can return `null`, but wrapping that result in `Results.Ok(...)` still produces a successful response. The endpoint should return `404 Not Found` for an unknown ID.

Before merging, fix the endpoint:

```csharp
workItems.MapGet("/{id:guid}", (Guid id, WorkItemService service) =>
    {
        var item = service.Find(id);

        if (item is null)
        {
            return Results.NotFound();
        }

        return Results.Ok(item);
    })
    .WithName("GetWorkItem");
```

Run the tests and push the correction:

```bash
dotnet test AgenticWorkflows.slnx
git add src/AgenticWorkflows.Api/Program.cs
git commit -m "Return not found for missing work items"
git push
```

Optionally request another Copilot review to confirm the issue is resolved. Then merge the pull request:

```bash
gh pr merge --squash --delete-branch
git switch main
git pull --ff-only
```

**Checkpoint:** the manual change is merged and you have seen a Copilot code review.

## Step 5: Create a custom agentic workflow

Now that you have used the coding and code-review agents, learn the agentic-workflow concepts while building one yourself.

An agentic workflow is a Markdown file in `.github/workflows/` with two parts:

1. **YAML frontmatter** between `---` markers defines when the workflow runs, what it may read, which tools it can use, and which safe outputs it may request.
2. **Natural-language instructions** explain what the agent should investigate, what a useful result looks like, and when it should use `noop`.

`gh aw compile` validates the Markdown and creates a hardened `.lock.yml` file that GitHub Actions can run.

### What is a safe output?

A safe output is a controlled GitHub write operation declared under `safe-outputs:`. The agent remains read-only and requests a narrowly configured operation that a separate permission-controlled job validates and performs.

| Safe output | What it can do | Example use |
| --- | --- | --- |
| `create-issue` | Open a new issue | Report a test-quality gap |
| `add-comment` | Comment on an issue or PR | Review changed tests |
| `create-pull-request` | Propose file changes in a PR | Update stale documentation |
| `add-labels` | Add allowed labels | Triage incoming issues |

`noop` is always available. It is the correct result when the workflow succeeds but finds nothing useful to change.

<details>
<summary>Safe-output configuration examples</summary>

```yaml
safe-outputs:
  create-issue:
    title-prefix: "[quality] "
    max: 1
```

```yaml
safe-outputs:
  add-comment:
    max: 1
    hide-older-comments: true
```

```yaml
safe-outputs:
  create-pull-request:
    draft: true
    allowed-files:
      - "**/*.md"
    max: 1
```

</details>

Open `.github/workflows/test-quality-checker.md` and identify:

- `workflow_dispatch` for an intentional manual run
- read-only permissions plus `copilot-requests: write`
- `safe-outputs: create-issue`
- the instructions describing useful and weak tests
- the explicit `noop` behavior

See the [complete safe-output reference](https://github.github.com/gh-aw/reference/safe-outputs/) when designing your own workflow.

### Build the workflow

Choose one small workflow:

- Complete `.github/workflows/docs-updater.md` to find stale documentation and open a documentation-only pull request.
- Complete `.github/workflows/duplicate-code-detector.md` to report meaningful duplicate production code.
- Create your own workflow for a repetitive repository task that still needs judgment.

Decide when it runs, what it inspects, which one safe output it creates, and when it should use `noop`.

Use Copilot Chat in VS Code Agent mode or run `copilot` from the repository root.

<details>
<summary>Copy-paste workflow prompt</summary>

```text
Create a workflow for GitHub Agentic Workflows using https://raw.githubusercontent.com/github/gh-aw/main/create.md.

Do not install, upgrade, or downgrade gh-aw. Use the installed v0.83.1 CLI.

Create or complete .github/workflows/<workflow-id>.md.

The workflow should <describe the small task>.
Run it <manually, daily, or for a pull request>.
It should inspect <repository content>.
It should create <one safe output>.
Use noop when <nothing useful needs to be created>.

Keep repository access read-only and support workflow_dispatch so we can test it during the workshop. Compile the workflow and fix every validation error.
```

</details>

Create a branch, compile, merge, and run the workflow:

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

Fix every compile warning in the Markdown source. Never edit a generated `.lock.yml` by hand.

**Checkpoint:** your custom workflow is merged and its manual run has started.

## Step 6: Run the Test Quality Checker manually

The prebuilt Test Quality Checker is manual-only at this point. Run it once to establish the baseline behavior:

```bash
gh aw run test-quality-checker
gh aw status
```

The run should create a test-quality issue or explicitly report a no-op.

**Checkpoint:** the manual Test Quality Checker run has started.

## Step 7: Refine pull-request review for test changes

The prebuilt workflow currently runs only when manually dispatched. Now add pull-request behavior so it runs only for test changes, reruns when the PR changes, and comments directly on the PR.

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

Keep the existing workflow_dispatch trigger and create-issue behavior for manual runs.

Add pull_request for opened, synchronize, and reopened, but only when files under tests/** change. Keep the agent job read-only. Add the add-comment safe output for the triggering pull request.

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

## Step 8: Create the test-change pull request

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

## Step 9: Watch the automatic review

Watch the pull-request checks:

```bash
gh pr checks --watch
```

You can also open the **Actions** tab or run:

```bash
gh aw status
```

When the workflow completes, refresh the pull request. The Test Quality Checker should post its findings as a PR comment, or explicitly no-op if it finds no actionable problem.

Return to the issue assigned to Copilot. Open the linked coding-agent pull request, inspect the changes and test results, and leave feedback or merge it when you are satisfied.

## You are done when

- [ ] You assigned a focused code change to the GitHub Copilot coding agent.
- [ ] You made a separate code change and opened a pull request.
- [ ] You requested and inspected a GitHub Copilot code review on the manual pull request.
- [ ] You fixed the missing-resource response and merged the manual code change.
- [ ] You completed, compiled, and manually ran a custom agentic workflow.
- [ ] You manually ran the prebuilt Test Quality Checker.
- [ ] The refined test-only PR trigger and comment output are merged to `main`.
- [ ] You opened a separate pull request changing a file under `tests/**`.
- [ ] The workflow ran automatically.
- [ ] The pull request contains the workflow's comment or an explicit no-op result.
- [ ] You inspected the coding agent's linked pull request.

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
<summary>Copilot is not available as an assignee or reviewer</summary>

Ask the organization owner to enable Copilot coding agent and Copilot code review. Also confirm that you have access to the repository and a GitHub Copilot seat.

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
- [Kick off a task with Copilot agents](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/kick-off-a-task)
- [Use GitHub Copilot code review](https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/copilot-code-review)
