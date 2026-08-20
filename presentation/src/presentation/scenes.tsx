import {
  AgenticWorkflowStack,
  CapabilityRecap,
  CapabilitySpectrum,
  CodeReviewFlow,
  CodingAgentFlow,
  GuardrailMap,
  MaintenanceGapChart,
  SceneFrame,
  Statement,
  UseCaseMap,
  WorkflowChoice,
  WorkflowLifecycle,
} from './components'
import type { SceneDefinition, SourceLink } from './types'

const codingAgent =
  'https://docs.github.com/en/copilot/concepts/agents/coding-agent/about-coding-agent'
const codeReview =
  'https://docs.github.com/en/copilot/concepts/agents/code-review'
const useCodeReview =
  'https://docs.github.com/en/copilot/how-tos/copilot-on-github/use-copilot-agents/copilot-code-review'
const overview = 'https://github.github.com/gh-aw/introduction/overview/'
const howItWorks = 'https://github.github.com/gh-aw/introduction/how-they-work/'
const architecture = 'https://github.github.com/gh-aw/introduction/architecture/'
const tools = 'https://github.github.com/gh-aw/reference/tools/'
const safeOutputs = 'https://github.github.com/gh-aw/reference/safe-outputs/'
const crossRepository =
  'https://github.github.com/gh-aw/reference/cross-repository/'
const agentics = 'https://github.com/githubnext/agentics'

const sources = {
  landscape: [
    { label: 'GitHub Copilot coding agent', url: codingAgent },
    { label: 'GitHub Copilot code review', url: codeReview },
    { label: 'GitHub Agentic Workflows', url: overview },
  ],
  codingAgent: [{ label: 'About Copilot coding agent', url: codingAgent }],
  codeReview: [
    { label: 'About Copilot code review', url: codeReview },
    { label: 'Use Copilot code review', url: useCodeReview },
  ],
  overview: [{ label: 'GitHub Agentic Workflows overview', url: overview }],
  mechanics: [{ label: 'How agentic workflows work', url: howItWorks }],
  guardrails: [
    { label: 'Security architecture', url: architecture },
    { label: 'Tools and MCP', url: tools },
    { label: 'Safe outputs', url: safeOutputs },
  ],
  useCases: [
    { label: 'Agentics examples', url: agentics },
    { label: 'Cross-repository operations', url: crossRepository },
  ],
} satisfies Record<string, SourceLink[]>

export const scenes: SceneDefinition[] = [
  {
    id: 'maintenance-gap',
    chapter: 'problem',
    title: 'Code is faster. Quality still needs attention.',
    shortTitle: 'The maintenance gap',
    steps: 2,
    minutes: 0.75,
    notes:
      'Open with the imbalance, but keep it brief. Code creation can scale quickly while review, testing, documentation, and maintenance still compete for human attention. The chart is conceptual, not an industry measurement.',
    render: ({ step }) => (
      <SceneFrame chapter="problem" sectionIntro>
        <div className="compact-heading">
          <h1>Code is faster. Quality still needs attention.</h1>
          <p>Agentic workflows help at different points in the repository lifecycle.</p>
        </div>
        <MaintenanceGapChart step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'workflow-landscape',
    chapter: 'reveal',
    title: 'A spectrum of agentic workflows',
    shortTitle: 'Implement, review, automate',
    steps: 2,
    minutes: 0.75,
    notes:
      'Present these as distinct capabilities, not one required sequence. Coding Agent implements a bounded task, Code Review provides a contextual first pass, and custom Agentic Workflows automate recurring repository-specific judgment.',
    sources: sources.landscape,
    render: ({ step }) => (
      <SceneFrame chapter="reveal" sources={sources.landscape} sectionIntro>
        <div className="compact-heading">
          <h1>Implement. Review. Automate.</h1>
          <p>Choose the workflow that matches the work.</p>
        </div>
        <CapabilitySpectrum step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'coding-agent',
    chapter: 'reveal',
    title: 'GitHub Coding Agent: delegate implementation',
    shortTitle: 'Delegate implementation',
    steps: 3,
    minutes: 1,
    notes:
      'Explain the handoff, not every product entry point. Give Copilot a bounded task or issue; it works in an isolated GitHub Actions environment, commits to its branch, and opens a draft pull request. A developer still reviews and owns the merge.',
    sources: sources.codingAgent,
    render: ({ step }) => (
      <SceneFrame chapter="reveal" sources={sources.codingAgent}>
        <div className="compact-heading">
          <h1>Delegate implementation.</h1>
          <p>Coding Agent turns a bounded task into a pull request for review.</p>
        </div>
        <CodingAgentFlow step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'code-review',
    chapter: 'reveal',
    title: 'GitHub Code Review: review the diff',
    shortTitle: 'Review the diff',
    steps: 3,
    minutes: 1,
    notes:
      'Frame Copilot code review as an additional contextual first pass. It leaves comments and suggestions, not an approval, and it does not replace required human reviewers. In the demo, manually change the Coding Agent pull request before requesting this review.',
    sources: sources.codeReview,
    render: ({ step }) => (
      <SceneFrame chapter="reveal" sources={sources.codeReview}>
        <div className="compact-heading">
          <h1>Review the diff in context.</h1>
          <p>Copilot comments. People still approve and merge.</p>
        </div>
        <CodeReviewFlow step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'choose-workflow',
    chapter: 'decision',
    title: 'Built-in agent or custom workflow?',
    shortTitle: 'Choose by task shape',
    steps: 3,
    minutes: 1,
    notes:
      'Use this as the decision center. Coding Agent is for delegated implementation, Code Review is for pull request feedback, and a custom workflow is for repeatable contextual work with a defined trigger and output.',
    sources: sources.landscape,
    render: ({ step }) => (
      <SceneFrame chapter="decision" sources={sources.landscape} sectionIntro>
        <div className="compact-heading">
          <h1>Built-in agent or custom workflow?</h1>
          <p>Choose by the task, trigger, and outcome you need.</p>
        </div>
        <WorkflowChoice step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'create-your-own',
    chapter: 'architecture',
    title: 'GitHub Agentic Workflows: create your own',
    shortTitle: 'Create your own workflow',
    steps: 2,
    minutes: 0.75,
    notes:
      'Introduce custom workflows as the extension point. Teams describe recurring contextual work in Markdown, then define tools, permissions, limits, and allowed outputs. Avoid implementation syntax until the demo.',
    sources: sources.overview,
    render: ({ step }) => (
      <SceneFrame chapter="architecture" sources={sources.overview} sectionIntro>
        <div className="compact-heading">
          <h1>Create the workflow your repository needs.</h1>
          <p>Natural language describes the job. Guardrails define the boundary.</p>
        </div>
        <AgenticWorkflowStack step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'workflow-lifecycle',
    chapter: 'architecture',
    title: 'From Markdown to a GitHub Actions run',
    shortTitle: 'Describe, compile, run',
    steps: 3,
    minutes: 0.75,
    notes:
      'Walk through the creation model: describe the job in Markdown, compile it to a GitHub Actions workflow, start it from an event, schedule, or manual run, and review its controlled result.',
    sources: sources.mechanics,
    render: ({ step }) => (
      <SceneFrame chapter="architecture" sources={sources.mechanics}>
        <div className="compact-heading">
          <h1>From Markdown to a GitHub Actions run.</h1>
          <p>The workflow becomes repeatable automation without losing review.</p>
        </div>
        <WorkflowLifecycle step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'workflow-guardrails',
    chapter: 'architecture',
    title: 'Tools, permissions, and controlled writes',
    shortTitle: 'Guardrails stay visible',
    steps: 3,
    minutes: 1,
    notes:
      'Consolidate the architecture detail. The agent runs in an isolated Actions job, sees only approved MCP tools and selected secrets, remains read-only, and requests a configured safe output that a separate scoped job applies.',
    sources: sources.guardrails,
    render: ({ step }) => (
      <SceneFrame chapter="architecture" sources={sources.guardrails}>
        <div className="compact-heading">
          <h1>Tools are approved. Writes are controlled.</h1>
          <p>The agent reasons inside a boundary it cannot expand.</p>
        </div>
        <GuardrailMap step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'custom-use-cases',
    chapter: 'demos',
    title: 'Good custom workflows have bounded outcomes',
    shortTitle: 'Where custom workflows fit',
    steps: 3,
    minutes: 1,
    notes:
      'Show examples rather than a long feature list. A good first workflow is recurring, context-heavy, and produces something a person can review. Connect each task to its visible output.',
    sources: sources.useCases,
    render: ({ step }) => (
      <SceneFrame chapter="demos" sources={sources.useCases} sectionIntro>
        <div className="compact-heading">
          <h1>Use custom workflows where context repeats.</h1>
          <p>Start with a bounded task and a reviewable outcome.</p>
        </div>
        <UseCaseMap step={step} />
      </SceneFrame>
    ),
  },
  {
    id: 'demo-handoff',
    chapter: 'recap',
    title: 'Now see the workflows working together',
    shortTitle: 'Guided demo',
    steps: 2,
    minutes: 0.5,
    notes:
      'Hand into the guided story: assign an implementation task to Coding Agent, inspect its pull request, manually change the code, request Copilot code review on the updated diff, and finish with the existing custom workflow. The slides explained the options; the demo connects them.',
    sources: sources.landscape,
    render: ({ step }) => (
      <SceneFrame chapter="recap" sources={sources.landscape} sectionIntro>
        <Statement
          eyebrow="Guided demo"
          supporting={<CapabilityRecap step={step} />}
        >
          Now see them <em>working together.</em>
        </Statement>
      </SceneFrame>
    ),
  },
]
