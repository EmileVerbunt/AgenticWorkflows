# AgenticWorkflows

AgenticWorkflows is a small .NET demo repository for showing how GitHub Agentic Workflows can apply continuous AI to everyday engineering work.

The app is intentionally simple: an ASP.NET Core Web API manages demo work items, an xUnit test project verifies the service layer, and the repository includes three agentic workflow examples:

| Demo | Workflow source | What it shows |
| --- | --- | --- |
| Documentation updater/checker | `.github\workflows\docs-updater.md` | Finds documentation drift after code changes and opens a draft docs PR. |
| Test quality checker | `.github\workflows\test-quality-checker.md` | Reviews whether tests are valuable, not just whether they increase coverage. |
| Duplicate code detector | `.github\workflows\duplicate-code-detector.md` | Finds repeated source-code patterns and creates focused refactoring issues. |

## Prerequisites

- .NET 10 SDK
- Optional: GitHub CLI plus the Agentic Workflows extension for running workflows locally:

```powershell
gh extension install github/gh-aw
```

## Run the app

```powershell
dotnet restore .\AgenticWorkflows.slnx
dotnet run --project .\src\AgenticWorkflows.Api\AgenticWorkflows.Api.csproj --urls http://localhost:5000
```

The API exposes:

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/work-items` | List seeded and created work items. |
| `POST` | `/work-items` | Create a new work item with validation. |
| `GET` | `/work-items/summary` | Return open/done/priority summary information. |
| `GET` | `/work-items/{id}/notifications` | Return demo notification text for a work item. |

Example create request:

```powershell
curl -Method Post http://localhost:5000/work-items `
  -ContentType 'application/json' `
  -Body '{"title":"Update the demo guide","description":"Add the new endpoint.","priority":3,"dueDate":"2026-06-05"}'
```

## Run tests

```powershell
dotnet test .\AgenticWorkflows.slnx
```

The test project intentionally contains both meaningful tests and a couple of low-value tests in `WeakCoverageTests.cs`. That gives the test-quality workflow something concrete to critique during a demo while keeping the suite green.

## Agentic workflow demo flow

If the workflows do not appear in the GitHub Actions tab yet, compile the lock files manually. You can run `gh aw compile --validate --purge` locally, or run **Compile Agentic Workflows** from the Actions tab and download the generated artifact. Commit the generated `.lock.yml` files yourself so the demos remain manually controlled.

1. **Documentation updater**: change an endpoint, model, or command in the app without updating docs, then run `gh aw run docs-updater`.
2. **Test quality checker**: inspect the existing tests or add a superficial test, then run `gh aw run test-quality-checker`.
3. **Duplicate code detector**: review `NotificationComposer`, which intentionally contains similar formatting logic, then run `gh aw run duplicate-code-detector`.

Compile workflow lock files after editing workflow frontmatter:

```powershell
gh aw compile
```

The markdown workflow files are the source of truth. The generated `.lock.yml` files should be committed when `gh aw` is available. The demo workflows are intentionally `workflow_dispatch` only; they do not run on push, pull request, schedule, or slash command triggers.

For the first repository setup, also configure the Copilot engine secret before running an agentic workflow:

1. Create a fine-grained PAT with Copilot Requests read permission.
2. Add it as the repository Actions secret `COPILOT_GITHUB_TOKEN`.

See `docs\demo-guide.md` for a presenter-oriented walkthrough and `docs\agentic-workflows.md` for workflow design notes.