# Agentic Workflows Workshop

Build and run a GitHub Agentic Workflow in less than 45 minutes.

This template repository contains a small .NET 10 API, three working agentic workflow demonstrations, and four unimplemented assignments. Participants create their own repository from the template and work entirely in GitHub Codespaces.

## Who this is for

Developers who are new to GitHub Actions and GitHub Agentic Workflows. Basic familiarity with repositories, branches, and pull requests is helpful.

## What you will learn

- Author an agentic workflow in Markdown.
- Configure a trigger, read-only permissions, tools, and safe outputs.
- Compile the Markdown into a hardened GitHub Actions workflow.
- Run the workflow and review its issue, comment, pull request, or no-op.
- Submit the workflow source and generated lock file in a pull request.

## Start the workshop

1. Create a repository from this template in the workshop organization.
2. Select **Code > Codespaces > Create codespace on main**.
3. The Codespace automatically starts **Seed Workshop**.
4. When that run finishes, open the generated **Start here: Build your first agentic workflow** issue.

No local installation or repository secret is required. The Codespace installs the pinned gh-aw CLI and validates the solution. Copilot inference uses the managed organization's GitHub Actions token through `copilot-requests: write`.

## Existing demonstrations

| Workflow | What it demonstrates |
| --- | --- |
| `.github/workflows/docs-updater.md` | Compares code and documentation, then creates a focused issue. |
| `.github/workflows/test-quality-checker.md` | Distinguishes meaningful unhappy-flow tests from superficial coverage. |
| `.github/workflows/duplicate-code-detector.md` | Uses contextual judgment to report worthwhile duplication. |

All three workflows are manually triggered, keep the agent job read-only, avoid duplicate issues, and use explicit no-op behavior.

## Participant assignments

The seed workflow creates four assignment issues:

| Level | Assignment | Safe output |
| --- | --- | --- |
| Beginner | Observability gap finder | Create an issue |
| Beginner | API error contract reviewer | Create an issue |
| Advanced | Pull request test-plan reviewer | Add a PR comment |
| Advanced | API reference generator | Create a draft PR |

Assignment workflow files are deliberately not included. Each participant implements one.

## Repository commands

```bash
dotnet restore AgenticWorkflows.slnx
dotnet build AgenticWorkflows.slnx
dotnet test AgenticWorkflows.slnx
gh aw compile --validate
```

Run the API with the **Workshop: Run API** VS Code task or:

```bash
dotnet run --project src/AgenticWorkflows.Api/AgenticWorkflows.Api.csproj --urls http://localhost:5154
```

## Guides

- [Participant workshop guide](docs/workshop-guide.md)
- [Facilitator demo guide](docs/demo-guide.md)
- [Agentic workflow design notes](docs/agentic-workflows.md)
- [Facilitator preflight](docs/facilitator-preflight.md)
