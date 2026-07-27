# Facilitator demo guide

Use this guide for the 7-minute demonstration before participants begin their assignments.

## Storyline

Traditional automation evaluates deterministic rules. Agentic workflows are useful when a repository needs contextual judgment and a guarded handoff to a human.

Show the workflow Markdown first, then its issue output. Emphasize that the agent receives read-only permissions and writes through a safe output.

## Demo 1: Test quality checker

Open:

- `.github/workflows/test-quality-checker.md`
- `tests/AgenticWorkflows.Api.Tests/WeakCoverageTests.cs`
- one generated `[test-quality]` issue

Explain that passing tests and line coverage are not the same as confidence. The workflow maps important failure behavior to meaningful assertions and no-ops if an equivalent issue already exists.

Run when needed:

```bash
gh aw run test-quality-checker
```

## Demo 2: Duplicate code detector

Open `src/AgenticWorkflows.Api/Services/NotificationComposer.cs` and point out the repeated description and due-date formatting.

The workflow must decide whether the repetition crosses a reporting threshold rather than flagging every similar line.

```bash
gh aw run duplicate-code-detector
```

## Demo 3: Documentation updater

Show how `Program.cs`, models, and README form a public contract. The workflow compares current behavior with documentation and creates a bounded issue instead of directly changing the repository.

```bash
gh aw run docs-updater
```

## Handoff to participants

Open the seeded sample pull request and the four assignment issues. Tell participants:

1. Choose one assignment.
2. Keep agent permissions read-only.
3. Use the required safe output.
4. Define when the workflow should no-op.
5. Commit the source and generated lock file.
6. Merge the participant pull request before manually running the new workflow.

Avoid running all three demonstrations live; one live run plus existing issue examples fits the 45-minute schedule.
