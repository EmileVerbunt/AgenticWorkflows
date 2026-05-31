# Demo guide

This guide gives a short presenter flow for using this repository to demonstrate GitHub Agentic Workflows.

## Storyline

Traditional automation is good at repeatable if/then checks. Agentic workflows are useful when the repository needs contextual judgment: deciding whether docs are stale, whether tests are meaningful, or whether similar code should be refactored.

This repository keeps the code intentionally small so the workflow outputs are easy to review during a live demo.

## Demo 1: documentation updater/checker

1. Change the API surface, for example by adding a field to `WorkItemSummary` or renaming an endpoint.
2. Do not update README or `docs\agentic-workflows.md`.
3. Run:

   ```powershell
   gh aw run docs-updater
   ```

Expected outcome: the workflow reads the code and docs, identifies drift, and creates an issue with clear documentation update steps.

## Demo 2: test quality checker

1. Open `tests\AgenticWorkflows.Api.Tests\WeakCoverageTests.cs`.
2. Point out that these tests pass but provide limited confidence.
3. Run:

   ```powershell
   gh aw run test-quality-checker
   ```

Expected outcome: the workflow focuses on unhappy flows, then creates an issue with a markdown table that lists missing or weak coverage, why each gap matters, suggested tests, assertions, and validation commands.

## Demo 3: duplicate-code detector

1. Open `src\AgenticWorkflows.Api\Services\NotificationComposer.cs`.
2. Point out the repeated formatting logic in the notification builders.
3. Run:

   ```powershell
   gh aw run duplicate-code-detector
   ```

Expected outcome: the workflow creates a focused issue describing the duplicated pattern, impact, concrete refactoring steps, and validation commands.

## Local validation commands

```powershell
dotnet restore .\AgenticWorkflows.slnx
dotnet build .\AgenticWorkflows.slnx
dotnet test .\AgenticWorkflows.slnx
```

## Workflow compilation

The workflows only show up as runnable GitHub Actions after `.lock.yml` files exist. For the first setup, run `gh aw compile --validate --purge` locally and commit the generated lock files.

If local `gh-aw` is unavailable, run **Compile Agentic Workflows** from the GitHub Actions tab, download the `compiled-agentic-workflows` artifact, and commit the generated files manually. This repository keeps demo workflows manual-only, so the compiler workflow does not push changes itself.

For local compilation, run this after changing workflow frontmatter:

```powershell
gh aw compile
```

The generated `.lock.yml` files are not hand-authored. Commit them together with the markdown workflow source files.
