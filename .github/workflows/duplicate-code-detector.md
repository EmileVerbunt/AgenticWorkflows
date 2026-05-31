---
name: Duplicate Code Detector
description: Identifies duplicate code patterns across the .NET demo app and suggests refactoring opportunities.

on:
  workflow_dispatch:

permissions: read-all

safe-outputs:
  create-issue:
    title-prefix: "[duplicate-code] "
    labels: [automation, code-quality]
    assignees: copilot
    group: true
    max: 3

tools:
  github:
    toolsets: [all]
  bash: true

timeout-minutes: 15
---

# Duplicate Code Detector

Analyze the repository for meaningful duplicate code patterns. Create focused issues with clear refactoring guidance when findings are actionable.

## Scope

Prioritize production code under `src/AgenticWorkflows.Api`. Skip:

- Test files under `tests/`.
- Generated files and build artifacts.
- `.github/workflows/` files.
- Small snippets under five lines.
- Standard language boilerplate.

## Detection workflow

1. Search the current repository state for exact, structural, and functional duplication.
2. Compare suspicious blocks semantically, not just textually.
3. Treat `NotificationComposer` as a useful demo candidate because it intentionally contains repeated formatting logic.
4. If the current code does not contain meaningful duplication above the reporting threshold, produce no write output.
5. If actionable duplication is found, create focused issues using the configured safe output.
6. Do not create branches, commits, pull requests, or file changes.

## Reporting threshold

Create an issue when a pattern has either:

- More than 10 duplicated or near-duplicated lines, or
- Three or more similar implementations of the same behavior.

Create one issue per distinct duplication pattern. Limit each run to the top three findings.

## Issue requirements

When creating a duplicate-code issue:

- Summary of the duplicated pattern.
- Specific file paths and line ranges.
- Why the duplication matters.
- A practical refactoring recommendation.
- Clear, concrete steps for how a future contributor can perform the refactor.
- Any behavior-preservation risks to watch for.
- Suggested validation commands, usually:

  ```bash
  dotnet test AgenticWorkflows.slnx
  ```

Do not modify files directly. Use the configured issue safe output.
