---
name: GitHub Agentic Workflows Presentation
description: A projector-first interactive story about continuous software maintenance.
colors:
  stage-black: "oklch(0.085 0 0)"
  stage-soft: "oklch(0.115 0.008 160)"
  surface: "oklch(0.145 0.008 160)"
  surface-strong: "oklch(0.19 0.012 160)"
  ink: "oklch(0.985 0 0)"
  ink-soft: "oklch(0.83 0.01 160)"
  muted: "oklch(0.68 0.012 160)"
  border: "oklch(0.29 0.015 160)"
  moss-anchor: "oklch(0.72 0.16 158)"
  problem-coral: "oklch(0.72 0.17 25)"
  decision-amber: "oklch(0.82 0.16 83)"
  architecture-blue: "oklch(0.73 0.14 250)"
  demo-violet: "oklch(0.73 0.16 305)"
  setup-green: "oklch(0.77 0.17 145)"
  recap-cyan: "oklch(0.76 0.13 190)"
typography:
  display:
    fontFamily: "Mona Sans Variable, Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "clamp(3.4rem, 8.2cqw, 6rem)"
    fontWeight: 470
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Mona Sans Variable, Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "clamp(2.6rem, 4.6cqw, 4.5rem)"
    fontWeight: 470
    lineHeight: 0.98
    letterSpacing: "-0.04em"
  body:
    fontFamily: "Mona Sans Variable, Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "clamp(1.05rem, 1.7cqw, 1.55rem)"
    fontWeight: 400
    lineHeight: 1.42
  label:
    fontFamily: "Mona Sans Variable, Segoe UI Variable, Segoe UI, sans-serif"
    fontSize: "clamp(0.78rem, 1.2cqw, 1.05rem)"
    fontWeight: 650
    lineHeight: 1.2
    letterSpacing: "0.12em"
  mono:
    fontFamily: "SFMono-Regular, Consolas, Liberation Mono, monospace"
    fontSize: "clamp(0.8rem, 1.25cqw, 1.05rem)"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  code-line: "0.35rem"
  compact: "0.85rem"
  overview-item: "0.9rem"
  control: "999px"
  surface: "1rem"
  feature-surface: "1.1rem"
  overlay: "1.25rem"
spacing:
  stage-inline: "clamp(3rem, 7cqw, 8rem)"
  stage-block: "clamp(3.5rem, 7cqh, 7rem)"
  component-gap: "clamp(0.8rem, 1.7cqw, 1.5rem)"
components:
  presentation-control:
    backgroundColor: "{colors.stage-soft}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.control}"
    padding: "0.45rem 0.8rem"
  code-panel:
    backgroundColor: "{colors.stage-soft}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "clamp(1.1rem, 2cqw, 2rem)"
  scene-surface:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    rounded: "{rounded.surface}"
    padding: "clamp(1rem, 1.8cqw, 1.7rem)"
---

# Design System: GitHub Agentic Workflows Presentation

## Overview

**Creative North Star: "The Illuminated Control Room"**

The presentation behaves like a live system whose moving parts become legible one layer at a time. A near-black projector canvas and GitHub-native Mona Sans create continuity with the subject, while chapter colors, large-scale type, and choreographed system diagrams give the experience its own stage identity.

Every viewport has one dominant idea. Complexity appears progressively through a capability spectrum, focused Coding Agent and Code Review explanations, a workflow-choice matrix, a GitHub Actions creation lifecycle, visible guardrails, and concrete use cases. The system explicitly rejects dense documentation walkthroughs and default Microsoft PowerPoint corporate templates.

**Key Characteristics:**

- Projector-first, dark-only stage with readable contrast at distance
- One chapter accent at a time over stable neutral foundations
- Large light-weight headlines; scale carries authority
- Typed scene layouts that vary composition without losing navigation consistency
- Motion explains sequence, containment, and causality
- Keyboard-first operation with presenter notes, overview, and reduced-motion behavior

## Colors

The neutral stage is nearly chroma-free so chapter accents carry meaning without contaminating body text. Moss is the brand anchor; coral frames the maintenance problem, amber the automation decision, blue the guarded architecture, violet the micro-demos, green the setup path, and cyan the recap.

**The One-Chapter Rule.** One chapter accent owns the active scene. Never combine the complete palette on a single viewport.

**The Projector Rule.** Ink and muted text must remain readable under washed-out room conditions. Decorative atmosphere may fade; information may not.

**The Semantic Accent Rule.** Color organizes chapters and states, but labels, structure, and copy must communicate the same meaning without color.

## Typography

**Display Font:** Mona Sans Variable with Segoe UI and system sans fallbacks  
**Body Font:** Mona Sans Variable with Segoe UI and system sans fallbacks  
**Label/Mono Font:** SFMono-Regular with Consolas and Liberation Mono fallbacks

Mona Sans provides the GitHub-native foundation while remaining highly readable at stage scale. The same family handles display and body roles; contrast comes from scale, spacing, and composition rather than an ornamental second family.

### Hierarchy

- **Display:** Reserved for title and closing statements; usually one to five words per line.
- **Headline:** Used for explanatory scenes and micro-demo problem statements.
- **Body:** Limited to short spoken-support copy and a maximum comfortable line length of 65-75 characters.
- **Label:** Used sparingly for chapter markers, status, and metadata.
- **Mono:** Restricted to commands, workflow syntax, file names, and machine state.

**The Scale-Over-Weight Rule.** Headlines stay below semibold. Authority comes from size and negative space.

**The One-Idea Rule.** If a headline needs a paragraph to become intelligible, split the scene.

## Elevation

The system is flat at rest. Depth is created through tonal surfaces, masks, chapter atmosphere, and containment borders. Shadows and blur appear only on presenter controls, overlays, or active system boundaries where they clarify layering.

**The Earned-Depth Rule.** A surface floats only when it must escape the stage plane: controls, dialogs, presenter notes, or an active focus layer.

**The No-Card-Deck Rule.** Repeated information does not automatically become a grid of identical cards. Use rails, matrices, timelines, code, or spatial diagrams when those structures explain the content better.

## Components

### Presentation Shell

- **Character:** Quiet, persistent, and subordinate to the current scene.
- **Navigation:** Arrow keys and Space move through reveal states before advancing scenes.
- **State:** Hash synchronization preserves the exact scene and reveal position on reload.
- **Accessibility:** The current scene receives focus and announces its title and reveal state.

### Scene Frame

- **Shape:** Full-viewport, edge-to-edge stage.
- **Background:** Stable stage black with restrained chapter-colored radial atmosphere.
- **Spacing:** Fluid container-relative padding protects 16:9 projector edges and narrow rehearsal windows.
- **Footer:** Sources remain visible but never compete with the main idea.

### Presentation Controls

- **Shape:** Compact pill control using the `presentation-control` token.
- **Behavior:** Previous, overview, help, and next remain visible; keyboard use never depends on them.
- **Focus:** Strong moss outline with sufficient offset.
- **Overlay behavior:** Controls become inert while modal overview or help is active.

### Code and Workflow Panels

- **Shape:** Gently curved contained surface using the `code-panel` token.
- **Typography:** Mono only inside the source or terminal region.
- **States:** Active lines gain a chapter-tinted tonal background rather than a colored side stripe.
- **Content:** Examples remain illustrative unless the source slide explicitly promises executable syntax.

### Mermaid Diagram

- **Style:** Locally rendered dark SVG with accessible title and description.
- **Security:** Mermaid runs with strict security mode.
- **Fallback:** Rendering failure produces a visible alert instead of an empty stage.

### Capability Overview

- **Structure:** Maintenance gap, workflow spectrum, Coding Agent, Code Review Agent, selection guidance, custom workflow creation, guardrails, use cases, and demo handoff.
- **Role:** Explain which workflow exists and when it fits; let the guided demo show how the capabilities work together.
- **Boundary:** Keep the manual pull request change, exact commands, source syntax, debugging, logs, and final results in the hands-on demonstration.

### Overview and Presenter Overlay

- **Overview:** Full-stage scene map grouped by chapter color.
- **Presenter panel:** Elapsed timer, reset, scene timing, and speaking guidance.
- **Focus:** Native focus order is trapped inside active modal overlays.

## Do's and Don'ts

### Do:

- **Do** give each scene one dominant statement, visual, or comparison.
- **Do** introduce the maintenance failure before the agentic workflow.
- **Do** pair every capability with its output and human review boundary.
- **Do** distinguish built-in agents from custom Agentic Workflows before showing how they can work together.
- **Do** use the actual chapter token rather than introducing one-off accent colors.
- **Do** keep source links attached to factual claims and public-preview setup guidance.
- **Do** provide reduced-motion and captured-demo paths that preserve the full meaning.

### Don't:

- **Don't** turn the experience into a dense documentation walkthrough.
- **Don't** imitate a default Microsoft PowerPoint corporate template.
- **Don't** use gradient text, decorative glass panels, colored side-stripe callouts, or repeated icon-card grids.
- **Don't** use monospace as a general developer aesthetic.
- **Don't** imply that agentic workflows replace deterministic CI/CD, eliminate maintenance, or remove human accountability.
- **Don't** ship presenter placeholders, remote runtime dependencies, or conceptual slides that imitate a fake terminal demo.
