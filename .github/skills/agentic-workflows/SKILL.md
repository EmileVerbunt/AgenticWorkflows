---
name: agentic-workflows
description: Route gh-aw workflow create/debug/upgrade requests to the right prompts.
---

# Agentic Workflows Router

Use this skill when a user asks to create, update, debug, or upgrade GitHub Agentic Workflows in this repository.

This skill is a dispatcher: identify the task type, load the matching `.github/aw/*.md` file from `github/gh-aw`, and follow it directly. Keep responses concise and ask a clarifying question if the correct prompt is unclear.

Common prompt routes:

- Create new workflows: `.github/aw/create-agentic-workflow.md`
- Update existing workflows: `.github/aw/update-agentic-workflow.md`
- Debug, audit, or investigate workflows: `.github/aw/debug-agentic-workflow.md`
- Upgrade workflows and fix deprecations: `.github/aw/upgrade-agentic-workflows.md`
- Create shared components or MCP wrappers: `.github/aw/create-shared-agentic-workflow.md`
- Map CLI commands to MCP usage: `.github/aw/cli-commands.md`

After loading the matching workflow prompt, follow it directly.
