---
description: |
  Compares the current .NET app behavior with repository documentation.
  Creates issues with clear documentation fix guidance when undocumented behavior is found.

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
    title-prefix: "[docs] "
    max: 3

tools:
  github:
    mode: gh-proxy
    toolsets: [default]
  web-fetch:

timeout-minutes: 15
---
