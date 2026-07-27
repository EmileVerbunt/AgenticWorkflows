# Create your first workflow

This is the workshop version of the official [GitHub Agentic Workflows quick start](https://github.github.com/gh-aw/setup/quick-start/). The official guide installs a prebuilt workflow; here you create one small workflow from an assignment issue.

## 1. Check the Codespace

The Codespace installs GitHub CLI, .NET 10, and the pinned gh-aw CLI automatically.

```bash
gh auth status
gh aw version
```

Expected gh-aw version:

```text
gh aw version v0.83.1
```

If `gh aw` is missing, rebuild the Codespace container. Do not install tools manually during the workshop.

## 2. Choose an assignment

Open an issue labeled `assignment`, assign it to yourself, and copy its suggested workflow ID.

```bash
git switch -c workshop/<workflow-id>
```

## 3. Ask Copilot to create the Markdown source

Open Copilot Chat and select the **agentic-workflows** agent. Paste this prompt after replacing the placeholders:

```text
Implement the agentic workflow described in issue #<issue-number>.

- Use workflow ID <workflow-id>.
- Create only .github/workflows/<workflow-id>.md.
- Follow the trigger, permissions, tools, safe output, and acceptance criteria in the issue.
- Keep repository permissions read-only.
- Use copilot-requests: write for Copilot authentication.
- Include an explicit noop condition.
- Do not compile the workflow.
```

Review the generated file. The top of it should contain YAML frontmatter between two `---` lines, followed by concise agent instructions.

> Prefer the Copilot agent during this workshop. The CLI also supports `gh aw new <workflow-id> --engine copilot`, but its general-purpose template contains more options than you need.

## 4. Compile and fix warnings

```bash
gh aw compile <workflow-id> --validate
```

Compilation creates:

- `.github/workflows/<workflow-id>.md` — the editable source
- `.github/workflows/<workflow-id>.lock.yml` — the generated GitHub Actions workflow

Do not edit the lock file. Fix the Markdown source and compile again until there are no errors or warnings.

## 5. Open and merge the participant pull request

```bash
git add .github/workflows/<workflow-id>.md \
  .github/workflows/<workflow-id>.lock.yml \
  .github/aw/actions-lock.json
git commit -m "Add <workflow-id> agentic workflow"
git push -u origin HEAD
gh pr create --fill
```

If `.github/aw/actions-lock.json` did not change, Git will simply ignore it.

Review and merge the pull request in your participant repository. A manually dispatched workflow must exist on `main` before GitHub can run it.

## 6. Run and watch the workflow

```bash
git switch main
git pull --ff-only
gh aw run <workflow-id>
```

Watch the result:

```bash
gh aw status
```

You can also open the repository's **Actions** tab. A successful run produces the configured safe output or an explicit no-op.

## No Copilot token setup

The official quick start includes a `COPILOT_GITHUB_TOKEN` option for repositories that authenticate with a personal access token.

This workshop uses the current recommended managed-organization configuration instead:

```yaml
permissions:
  contents: read
  copilot-requests: write
```

GitHub Actions supplies a short-lived token and bills the request through the organization's Copilot subscription. Template repositories do not inherit repository secrets, and a Codespace cannot safely create a participant's fine-grained PAT, so the workshop does not create or copy `COPILOT_GITHUB_TOKEN`.

If Copilot authentication fails, ask the facilitator to check the organization's Copilot and Actions policies.
