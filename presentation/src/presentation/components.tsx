import { type CSSProperties, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import type { ChapterId, SourceLink } from './types'
import { chapters } from './types'

interface SceneFrameProps {
  chapter: ChapterId
  children: ReactNode
  sources?: SourceLink[]
  sectionIntro?: boolean
  className?: string
}

export function SceneFrame({
  chapter,
  children,
  sources,
  sectionIntro = false,
  className = '',
}: SceneFrameProps) {
  const chapterInfo = chapters[chapter]
  const style = {
    '--scene-accent': chapterInfo.accent,
  } as CSSProperties

  return (
    <article
      className={`scene-frame ${sectionIntro ? 'scene-frame--intro' : ''} ${className}`}
      style={style}
      data-chapter={chapter}
    >
      <div className="scene-atmosphere" aria-hidden="true" />
      <div className="scene-content">
        {sectionIntro ? (
          <p className="chapter-marker">{chapterInfo.label}</p>
        ) : null}
        {children}
      </div>
      <SourceFooter sources={sources} />
    </article>
  )
}

function SourceFooter({ sources }: { sources?: SourceLink[] }) {
  if (!sources?.length) {
    return null
  }

  return (
    <footer className="source-footer" aria-label="Sources">
      {sources.map((source) => (
        <a
          href={source.url}
          key={source.url}
          target="_blank"
          rel="noreferrer"
        >
          {source.label}
          <span aria-hidden="true"> ↗</span>
        </a>
      ))}
    </footer>
  )
}

interface RevealProps {
  show: boolean
  children: ReactNode
  className?: string
}

export function Reveal({ show, children, className = '' }: RevealProps) {
  const reducedMotion = Boolean(useReducedMotion())

  return (
    <motion.div
      className={`reveal ${show ? 'reveal--visible' : ''} ${className}`}
      initial={false}
      animate={{
        opacity: show ? 1 : 0,
        filter: reducedMotion ? 'none' : show ? 'blur(0px)' : 'blur(4px)',
        y: reducedMotion ? 0 : show ? 0 : 8,
      }}
      transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      aria-hidden={!show}
    >
      {children}
    </motion.div>
  )
}

export function Statement({
  eyebrow,
  children,
  supporting,
  align = 'left',
}: {
  eyebrow?: string
  children: ReactNode
  supporting?: ReactNode
  align?: 'left' | 'center'
}) {
  return (
    <div className={`statement statement--${align}`}>
      {eyebrow ? <p className="statement-context">{eyebrow}</p> : null}
      <h1>{children}</h1>
      {supporting ? <div className="statement-supporting">{supporting}</div> : null}
    </div>
  )
}

export function CapabilitySpectrum({ step }: { step: number }) {
  const capabilities = [
    {
      label: 'Implement',
      title: 'Coding Agent',
      detail: 'Delegate a bounded task and review the pull request.',
      output: 'Draft pull request',
    },
    {
      label: 'Review',
      title: 'Code Review',
      detail: 'Request a contextual first pass on a pull request diff.',
      output: 'Review comments',
    },
    {
      label: 'Automate',
      title: 'Agentic Workflow',
      detail: 'Define recurring repository work in natural language.',
      output: 'Controlled output',
    },
  ]

  return (
    <div className="capability-spectrum" aria-label="GitHub agentic workflow spectrum">
      {capabilities.map((capability, index) => (
        <motion.section
          key={capability.title}
          initial={false}
          animate={{
            opacity: step >= index ? 1 : 0.14,
            y: step >= index ? 0 : 12,
          }}
        >
          <span>{capability.label}</span>
          <strong>{capability.title}</strong>
          <p>{capability.detail}</p>
          <small>{capability.output}</small>
        </motion.section>
      ))}
    </div>
  )
}

export function CodingAgentFlow({ step }: { step: number }) {
  const stages = [
    ['Task', 'Assign an issue or describe a bounded change'],
    ['Agent', 'Works in an isolated GitHub Actions environment'],
    ['Pull request', 'Commits changes and opens a draft for review'],
    ['Developer', 'Checks, changes, and approves before merge'],
  ]

  return (
    <div className="agent-flow" aria-label="GitHub Copilot coding agent flow">
      {stages.map(([title, detail], index) => (
        <motion.div
          key={title}
          initial={false}
          animate={{
            opacity: step >= index ? 1 : 0.14,
            x: step >= index ? 0 : 12,
          }}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{title}</strong>
          <p>{detail}</p>
        </motion.div>
      ))}
      <p className="visual-takeaway">The pull request is the handoff, not the finish line.</p>
    </div>
  )
}

export function CodeReviewFlow({ step }: { step: number }) {
  const reviewSignals = [
    ['Diff', 'Changed lines and surrounding code'],
    ['Context', 'Repository instructions and related files'],
    ['Feedback', 'Inline comments and suggested fixes'],
  ]

  return (
    <div className="review-flow">
      <div className="review-input">
        <span>Pull request</span>
        <strong>Request Copilot review</strong>
        <p>Manually or automatically when the pull request changes.</p>
      </div>
      <div className="review-signals">
        {reviewSignals.map(([title, detail], index) => (
          <motion.div
            key={title}
            initial={false}
            animate={{
              opacity: step >= index + 1 ? 1 : 0.14,
              x: step >= index + 1 ? 0 : 12,
            }}
          >
            <strong>{title}</strong>
            <span>{detail}</span>
          </motion.div>
        ))}
      </div>
      <div className="review-boundary">
        <span>Review boundary</span>
        <strong>Comments, not approval</strong>
        <p>Human reviewers still own design judgment and the merge decision.</p>
      </div>
    </div>
  )
}

export function WorkflowChoice({ step }: { step: number }) {
  const rows = [
    ['Primary need', 'Implement a task', 'Review a pull request', 'Repeat contextual work'],
    ['Starts from', 'Issue or prompt', 'Pull request diff', 'Event, schedule, or manual run'],
    ['Produces', 'Draft pull request', 'Review comments', 'Configured safe output'],
    ['You define', 'The task', 'Review instructions', 'Trigger, tools, limits, and outcome'],
  ]

  return (
    <div className="decision-matrix" role="table" aria-label="Choosing a GitHub agent workflow">
      <div className="matrix-head" role="row">
        <span role="columnheader">Choose by</span>
        <strong role="columnheader">Coding Agent</strong>
        <strong role="columnheader">Code Review</strong>
        <strong role="columnheader">Custom workflow</strong>
      </div>
      {rows.map((row, rowIndex) => (
        <motion.div
          className="matrix-row"
          role="row"
          key={row[0]}
          initial={false}
          animate={{ opacity: step >= Math.min(rowIndex, 3) ? 1 : 0.16 }}
        >
          {row.map((cell, index) =>
            index === 0 ? (
              <strong role="rowheader" key={cell}>{cell}</strong>
            ) : (
              <span role="cell" key={cell}>{cell}</span>
            ),
          )}
        </motion.div>
      ))}
    </div>
  )
}

export function MaintenanceGapChart({ step }: { step: number }) {
  return (
    <div className="gap-chart">
      <svg
        viewBox="0 0 820 360"
        role="img"
        aria-labelledby="gap-title gap-description"
      >
        <title id="gap-title">Code creation and maintenance capacity diverge</title>
        <desc id="gap-description">
          Code creation rises rapidly while maintenance attention remains nearly
          flat, creating a widening gap.
        </desc>
        <g className="chart-grid">
          {[70, 140, 210, 280].map((y) => (
            <line x1="72" x2="780" y1={y} y2={y} key={y} />
          ))}
        </g>
        <text x="72" y="332" className="chart-axis-label">
          Time →
        </text>
        <motion.path
          className="chart-line chart-line--velocity"
          d="M72 280 C220 272 300 234 420 184 C560 124 650 72 780 42"
          pathLength="1"
          initial={false}
          animate={{ pathLength: step >= 1 ? 1 : 0.18 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
        <motion.path
          className="chart-line chart-line--attention"
          d="M72 278 C250 270 470 264 780 252"
          pathLength="1"
          initial={false}
          animate={{ pathLength: step >= 1 ? 1 : 0.18 }}
          transition={{ duration: 1.1, delay: 0.08 }}
        />
        <motion.g
          initial={false}
          animate={{ opacity: step >= 2 ? 1 : 0 }}
        >
          <path
            className="chart-gap"
            d="M320 226 C450 174 600 103 750 52 L750 252 C600 258 450 262 320 266 Z"
          />
          <text x="500" y="204" className="chart-gap-label">
            maintenance gap
          </text>
        </motion.g>
        <text x="620" y="68" className="chart-label chart-label--velocity">
          code creation
        </text>
        <text x="608" y="278" className="chart-label chart-label--attention">
          maintenance attention
        </text>
      </svg>
    </div>
  )
}

export function MachineVsReasoning({ step }: { step: number }) {
  const deterministic = ['Build', 'Lint', 'Test', 'Deploy']
  const contextual = ['Review intent', 'Find drift', 'Explain impact', 'Propose fix']

  return (
    <div className="machine-reasoning">
      <div className="machine-column">
        <p className="column-label">Deterministic automation</p>
        <div className="machine-track">
          {deterministic.map((item, index) => (
            <div className="machine-node" key={item}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{item}</strong>
            </div>
          ))}
        </div>
        <p>Exact inputs. Exact checks. Repeatable output.</p>
      </div>
      <motion.div
        className="reasoning-column"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0.18, x: step >= 1 ? 0 : 30 }}
      >
        <p className="column-label">Contextual work</p>
        <div className="context-cloud">
          {contextual.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p>Different context. Different judgment. Reviewable outcome.</p>
      </motion.div>
    </div>
  )
}

export function BoundedReasoningLoop({ step }: { step: number }) {
  const stages = [
    ['Trigger', 'Issue, pull request, schedule'],
    ['Understand', 'Read bounded repository context'],
    ['Decide', 'Interpret the task and trade-offs'],
    ['Request', 'Produce a controlled output'],
  ]

  return (
    <div className="reasoning-loop" aria-label="Bounded agentic workflow loop">
      <div className="reasoning-flow">
        {stages.map(([title, detail], index) => (
          <motion.div
            className="reasoning-stage"
            key={title}
            initial={false}
            animate={{
              opacity: step >= index ? 1 : 0.16,
              y: step >= index ? 0 : 12,
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </motion.div>
        ))}
      </div>
      <p className="reasoning-loop-note">
        Each loop has its own trigger, context, tools, budget, output, and review
        path.
      </p>
    </div>
  )
}

export function DecisionMatrix({ step }: { step: number }) {
  const rows = [
    ['Task shape', 'Known and exact', 'Contextual and variable', 'Reason, then verify'],
    ['Best at', 'Builds, policy, checks', 'Analysis and proposals', 'Guarded change'],
    ['Output', 'Pass or fail', 'Reviewable result', 'Validated result'],
    ['Example', 'Run unit tests', 'Find a missing edge case', 'Propose a test, then run it'],
  ]

  return (
    <div className="decision-matrix" role="table" aria-label="Automation decision framework">
      <div className="matrix-head" role="row">
        <span role="columnheader">Dimension</span>
        <strong role="columnheader">Deterministic</strong>
        <strong role="columnheader">Agentic</strong>
        <strong role="columnheader">Hybrid</strong>
      </div>
      {rows.map((row, rowIndex) => (
        <motion.div
          className="matrix-row"
          role="row"
          key={row[0]}
          initial={false}
          animate={{ opacity: step >= Math.min(rowIndex, 2) ? 1 : 0.16 }}
        >
          {row.map((cell, index) =>
            index === 0 ? (
              <strong role="rowheader" key={cell}>{cell}</strong>
            ) : (
              <span role="cell" key={cell}>{cell}</span>
            ),
          )}
        </motion.div>
      ))}
    </div>
  )
}

export function AgenticWorkflowStack({ step }: { step: number }) {
  const layers = [
    ['GitHub Actions', 'Starts on events and runs the job'],
    ['AI agent', 'Reads repository context and decides what to request'],
    ['Workflow limits', 'Defines tools, permissions, and allowed outputs'],
  ]

  return (
    <div className="agentic-stack">
      <div className="workflow-file" aria-label="Agentic workflow Markdown file">
        <span>Source</span>
        <strong>workflow.md</strong>
        <p>Plain-language job description</p>
      </div>
      <div className="agentic-layers">
        {layers.map(([title, detail], index) => (
          <motion.div
            key={title}
            initial={false}
            animate={{
              opacity: step >= index ? 1 : 0.15,
              x: step >= index ? 0 : 14,
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </motion.div>
        ))}
      </div>
      <p className="visual-takeaway">
        Describe the job in Markdown. GitHub Actions runs the agent.
      </p>
    </div>
  )
}

export function WorkflowLifecycle({ step }: { step: number }) {
  const stages = [
    ['Describe', 'Write the job and guardrails in Markdown'],
    ['Compile', 'Generate the GitHub Actions workflow'],
    ['Run', 'An event or schedule starts the agent'],
    ['Review', 'A person checks the controlled outcome'],
  ]

  return (
    <div className="workflow-lifecycle">
      <div className="trigger-examples" aria-label="Workflow trigger examples">
        {['workflow.md', 'GitHub Actions', 'MCP tools', 'Safe output'].map((trigger) => (
          <span key={trigger}>{trigger}</span>
        ))}
      </div>
      <div className="lifecycle-flow">
        {stages.map(([title, detail], index) => (
          <motion.div
            className="lifecycle-stage"
            key={title}
            initial={false}
            animate={{
              opacity: step >= index ? 1 : 0.15,
              y: step >= index ? 0 : 10,
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </motion.div>
        ))}
      </div>
      <p className="visual-takeaway">
        Describe the outcome. Compile the workflow. Run it with guardrails.
      </p>
    </div>
  )
}

export function GuardrailMap({ step }: { step: number }) {
  const stages = [
    ['Runner boundary', 'The agent runs in an isolated Actions job'],
    ['Approved tools', 'MCP exposes only configured capabilities'],
    ['Read-only agent', 'The reasoning job cannot write directly'],
    ['Scoped output job', 'A separate job applies an approved result'],
  ]

  return (
    <div className="guardrail-map" aria-label="Custom workflow guardrails">
      {stages.map(([title, detail], index) => (
        <motion.div
          key={title}
          initial={false}
          animate={{
            opacity: step >= index ? 1 : 0.14,
            y: step >= index ? 0 : 10,
          }}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{title}</strong>
          <p>{detail}</p>
        </motion.div>
      ))}
      <div className="guardrail-outputs">
        {['Issue', 'Comment', 'Label', 'Draft PR'].map((output) => (
          <span key={output}>{output}</span>
        ))}
      </div>
    </div>
  )
}

export function CapabilityRecap({ step }: { step: number }) {
  const items = [
    ['Delegate implementation', 'Coding Agent'],
    ['Add a contextual first pass', 'Code Review'],
    ['Automate recurring judgment', 'Agentic Workflow'],
  ]

  return (
    <div className="capability-recap">
      {items.map(([detail, title], index) => (
        <motion.div
          key={title}
          initial={false}
          animate={{
            opacity: step >= index ? 1 : 0.14,
            x: step >= index ? 0 : 14,
          }}
        >
          <span>{String(index + 1).padStart(2, '0')}</span>
          <strong>{title}</strong>
          <p>{detail}</p>
        </motion.div>
      ))}
      <p className="visual-takeaway">
        Use the right agent for the work, then build the workflow your repository needs.
      </p>
    </div>
  )
}

export function ActionsRunnerMap({ step }: { step: number }) {
  return (
    <div className="actions-graph">
      <motion.div
        className="actions-graph-node actions-graph-trigger"
        initial={false}
        animate={{ opacity: step >= 0 ? 1 : 0.14 }}
      >
        <span>Repository</span>
        <strong>GitHub event</strong>
        <small>Issue · PR · schedule</small>
      </motion.div>

      <div className="actions-graph-arrow" aria-hidden="true">→</div>

      <motion.section
        className="actions-workflow-run"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0.14, scale: step >= 1 ? 1 : 0.98 }}
      >
        <header>
          <span>GitHub Actions</span>
          <strong>Workflow run</strong>
        </header>
        <div className="actions-job">
          <div className="actions-job-label">
            <span>Job</span>
            <strong>Agent job</strong>
          </div>
          <motion.div
            className="actions-runner"
            initial={false}
            animate={{ opacity: step >= 2 ? 1 : 0.14, y: step >= 2 ? 0 : 8 }}
          >
            <span>GitHub-hosted runner</span>
            <div>
              <strong>Checked-out repository</strong>
              <strong>AI agent process</strong>
            </div>
            <small>Read-only by default</small>
          </motion.div>
        </div>
        <motion.div
          className="actions-tool-connection"
          initial={false}
          animate={{ opacity: step >= 3 ? 1 : 0.14 }}
        >
          <span>Controlled connection</span>
          <strong>Approved APIs + MCP tools</strong>
        </motion.div>
      </motion.section>

      <div className="actions-graph-arrow" aria-hidden="true">→</div>

      <motion.div
        className="actions-graph-node actions-graph-history"
        initial={false}
        animate={{ opacity: step >= 3 ? 1 : 0.14 }}
      >
        <span>Actions tab</span>
        <strong>Run history</strong>
        <small>Status · logs · result</small>
      </motion.div>
    </div>
  )
}

export function MCPToolMap({ step }: { step: number }) {
  const toolGroups = [
    ['GitHub', 'Read an issue · search code'],
    ['Web + browser', 'Read docs · inspect a page'],
    ['Company tools', 'Query an approved service'],
  ]

  return (
    <div className="mcp-map">
      <div className="mcp-agent">
        <span>AI agent</span>
        <strong>Needs a tool</strong>
      </div>
      <motion.div
        className="mcp-gateway"
        initial={false}
        animate={{ opacity: step >= 1 ? 1 : 0.15, scale: step >= 1 ? 1 : 0.94 }}
      >
        <span>Model Context Protocol</span>
        <strong>MCP gateway</strong>
      </motion.div>
      <div className="mcp-tools">
        {toolGroups.map(([title, detail], index) => (
          <motion.div
            key={title}
            initial={false}
            animate={{
              opacity: step >= index + 2 ? 1 : 0.14,
              x: step >= index + 2 ? 0 : 12,
            }}
          >
            <strong>{title}</strong>
            <span>{detail}</span>
          </motion.div>
        ))}
      </div>
      <div className="mcp-rules">
        <span>Only allowed tools are visible</span>
        <span>Only selected secrets are passed</span>
      </div>
    </div>
  )
}

export function SafeOutputFlow({ step }: { step: number }) {
  const stages = [
    ['Read-only agent', 'Requests an action'],
    ['Safety checks', 'Check content and limits'],
    ['Scoped job', 'Gets only needed write access'],
    ['GitHub', 'Creates the approved output'],
  ]

  return (
    <div className="safe-output-flow">
      <div className="safe-output-stages">
        {stages.map(([title, detail], index) => (
          <motion.div
            key={title}
            initial={false}
            animate={{
              opacity: step >= index ? 1 : 0.14,
              x: step >= index ? 0 : 12,
            }}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </motion.div>
        ))}
      </div>
      <div className="safe-output-types" aria-label="Safe output examples">
        {['Issue', 'Comment', 'Label', 'Draft PR'].map((output) => (
          <span key={output}>{output}</span>
        ))}
      </div>
      <p className="visual-takeaway">
        The agent has no direct write access.
      </p>
    </div>
  )
}

export function UseCaseMap({ step }: { step: number }) {
  const groups = [
    {
      icon: '📚',
      title: 'Knowledge',
      items: [
        ['Documentation update', 'Draft PR'],
        ['Release notes', 'Draft text'],
      ],
    },
    {
      icon: '🧪',
      title: 'Quality',
      items: [
        ['Test quality', 'Focused test PR'],
        ['Duplicate code', 'Improvement issue'],
      ],
    },
    {
      icon: '🔗',
      title: 'Coordination',
      items: [
        ['Cross-repo check', 'Compatibility report'],
        ['Issue or PR triage', 'Label or comment'],
      ],
    },
    {
      icon: '🔭',
      title: 'Observability',
      items: [
        ['Observability checker', 'Missing or incorrect logging'],
      ],
    },
  ]

  return (
    <div className="use-case-map">
      <div className="use-case-groups">
        {groups.map((group, index) => (
          <motion.section
            key={group.title}
            initial={false}
            animate={{
              opacity: step >= index ? 1 : 0.14,
              y: step >= index ? 0 : 10,
            }}
          >
            <h3>
              <span aria-hidden="true">{group.icon}</span>
              {group.title}
            </h3>
            {group.items.map(([task, output]) => (
              <div key={task}>
                <strong>{task}</strong>
                <span>→ {output}</span>
              </div>
            ))}
          </motion.section>
        ))}
      </div>
      <p className="first-workflow-rule">
        <span>Good first workflow</span>
        Recurring + context-heavy + reviewable output
      </p>
    </div>
  )
}
