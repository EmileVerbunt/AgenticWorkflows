import type { ReactNode } from 'react'

export type ChapterId =
  | 'problem'
  | 'reveal'
  | 'decision'
  | 'architecture'
  | 'demos'
  | 'setup'
  | 'recap'

export interface Chapter {
  id: ChapterId
  label: string
  accent: string
}

export interface SourceLink {
  label: string
  url: string
}

export interface SceneContext {
  step: number
  reducedMotion: boolean
}

export interface SceneDefinition {
  id: string
  chapter: ChapterId
  title: string
  shortTitle?: string
  steps?: number
  minutes?: number
  notes: string
  sources?: SourceLink[]
  render: (context: SceneContext) => ReactNode
}

export const chapters: Record<ChapterId, Chapter> = {
  problem: {
    id: 'problem',
    label: 'The maintenance gap',
    accent: 'var(--accent-problem)',
  },
  reveal: {
    id: 'reveal',
    label: 'Built-in GitHub agents',
    accent: 'var(--accent-reveal)',
  },
  decision: {
    id: 'decision',
    label: 'Choose the workflow',
    accent: 'var(--accent-decision)',
  },
  architecture: {
    id: 'architecture',
    label: 'Create your own',
    accent: 'var(--accent-architecture)',
  },
  demos: {
    id: 'demos',
    label: 'Where custom workflows fit',
    accent: 'var(--accent-demos)',
  },
  setup: {
    id: 'setup',
    label: 'Your first workflow',
    accent: 'var(--accent-setup)',
  },
  recap: {
    id: 'recap',
    label: 'Guided demonstration',
    accent: 'var(--accent-recap)',
  },
}
