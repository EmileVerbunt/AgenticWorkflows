---
name: Duplicate Code Detector
description: Identifies duplicate code patterns across the .NET demo app and suggests refactoring opportunities.

on:
  workflow_dispatch:

permissions:
  contents: read
  issues: read
  pull-requests: read
  copilot-requests: write

network:
  allowed:
    - defaults
    - dotnet

safe-outputs:
  create-issue:
    title-prefix: "[duplicate-code] "
    group: true
    max: 3

tools:
  github:
    mode: gh-proxy
    toolsets: [default]

timeout-minutes: 15
---
