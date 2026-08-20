import {
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useReducedMotion,
} from 'motion/react'
import type { SceneDefinition } from './types'
import { chapters } from './types'

interface PresentationShellProps {
  scenes: SceneDefinition[]
}

interface LocationState {
  index: number
  step: number
}

function readLocation(scenes: SceneDefinition[]): LocationState {
  const [sceneId, rawStep] = window.location.hash.slice(1).split('/')
  const index = Math.max(
    0,
    scenes.findIndex((scene) => scene.id === sceneId),
  )
  const requestedStep = Number.parseInt(rawStep ?? '0', 10)
  const maxStep = scenes[index]?.steps ?? 0

  return {
    index,
    step: Number.isFinite(requestedStep)
      ? Math.min(Math.max(requestedStep, 0), maxStep)
      : 0,
  }
}

function isInteractiveTarget(target: EventTarget | null) {
  return (
    target instanceof HTMLElement &&
    Boolean(target.closest('a, button, input, textarea, select, [contenteditable="true"]'))
  )
}

function formatElapsed(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function trapFocus(event: ReactKeyboardEvent<HTMLElement>) {
  if (event.key !== 'Tab') {
    return
  }

  const focusable = Array.from(
    event.currentTarget.querySelectorAll<HTMLElement>(
      'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])',
    ),
  ).filter((element) => !element.hasAttribute('inert'))

  const first = focusable[0]
  const last = focusable.at(-1)

  if (!first || !last) {
    return
  }

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

export function PresentationShell({ scenes }: PresentationShellProps) {
  const initialLocation = useMemo(() => readLocation(scenes), [scenes])
  const [sceneIndex, setSceneIndex] = useState(initialLocation.index)
  const [step, setStep] = useState(initialLocation.step)
  const [overviewOpen, setOverviewOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [presenterOpen, setPresenterOpen] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const sceneRef = useRef<HTMLElement>(null)
  const overviewCloseRef = useRef<HTMLButtonElement>(null)
  const helpCloseRef = useRef<HTMLButtonElement>(null)
  const reducedMotion = Boolean(useReducedMotion())
  const scene = scenes[sceneIndex]
  const maxStep = scene.steps ?? 0
  const chapter = chapters[scene.chapter]

  const goTo = useCallback(
    (index: number, nextStep = 0) => {
      const boundedIndex = Math.min(Math.max(index, 0), scenes.length - 1)
      const boundedStep = Math.min(
        Math.max(nextStep, 0),
        scenes[boundedIndex].steps ?? 0,
      )
      setSceneIndex(boundedIndex)
      setStep(boundedStep)
      setOverviewOpen(false)
    },
    [scenes],
  )

  const goNext = useCallback(() => {
    if (step < maxStep) {
      setStep((current) => current + 1)
      return
    }
    goTo(sceneIndex + 1)
  }, [goTo, maxStep, sceneIndex, step])

  const goPrevious = useCallback(() => {
    if (step > 0) {
      setStep((current) => current - 1)
      return
    }
    const previousIndex = Math.max(sceneIndex - 1, 0)
    goTo(previousIndex, scenes[previousIndex].steps ?? 0)
  }, [goTo, sceneIndex, scenes, step])

  const toggleFullscreen = useCallback(async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }
    await document.documentElement.requestFullscreen()
  }, [])

  const openOverview = useCallback(() => {
    setPresenterOpen(false)
    setHelpOpen(false)
    setOverviewOpen(true)
  }, [])

  const openHelp = useCallback(() => {
    setPresenterOpen(false)
    setOverviewOpen(false)
    setHelpOpen(true)
  }, [])

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)
    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    window.history.replaceState(null, '', `#${scene.id}/${step}`)
    document.title = `${scene.title} · GitHub Agentic Workflows`
  }, [scene.id, scene.title, step])

  useEffect(() => {
    if (overviewOpen) {
      overviewCloseRef.current?.focus()
      return
    }
    if (helpOpen) {
      helpCloseRef.current?.focus()
      return
    }
    sceneRef.current?.focus({ preventScroll: true })
  }, [helpOpen, overviewOpen, scene.id, step])

  useEffect(() => {
    function handleHashChange() {
      const location = readLocation(scenes)
      setSceneIndex(location.index)
      setStep(location.step)
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [scenes])

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (isInteractiveTarget(event.target) && event.key !== 'Escape') {
        return
      }

      if (event.key === 'Escape') {
        setOverviewOpen(false)
        setHelpOpen(false)
        setPresenterOpen(false)
        return
      }

      if (helpOpen || overviewOpen) {
        return
      }

      switch (event.key) {
        case 'ArrowRight':
        case 'ArrowDown':
        case 'PageDown':
        case 'Enter':
        case ' ':
          event.preventDefault()
          goNext()
          break
        case 'ArrowLeft':
        case 'ArrowUp':
        case 'PageUp':
        case 'Backspace':
          event.preventDefault()
          goPrevious()
          break
        case 'Home':
          event.preventDefault()
          goTo(0)
          break
        case 'End':
          event.preventDefault()
          goTo(scenes.length - 1)
          break
        case 'o':
        case 'O':
          openOverview()
          break
        case 'p':
        case 'P':
          setPresenterOpen((current) => !current)
          break
        case 'f':
        case 'F':
          void toggleFullscreen()
          break
        case '?':
        case 'h':
        case 'H':
          openHelp()
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [
    goNext,
    goPrevious,
    goTo,
    helpOpen,
    overviewOpen,
    openHelp,
    openOverview,
    scenes.length,
    toggleFullscreen,
  ])

  const progress =
    (sceneIndex + (step + 1) / (maxStep + 1)) / Math.max(scenes.length, 1)

  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="presentation-shell">
        <img
          className="github-mark"
          src={`${import.meta.env.BASE_URL}github-mark.svg`}
          alt=""
          aria-hidden="true"
        />
        <main
          className="scene-viewport"
          ref={sceneRef}
          tabIndex={-1}
          inert={overviewOpen || helpOpen}
          aria-hidden={overviewOpen || helpOpen}
          aria-label={`Scene ${sceneIndex + 1} of ${scenes.length}: ${scene.title}`}
          onKeyDown={(event: ReactKeyboardEvent) => {
            if (event.key === 'Tab') {
              document.body.dataset.keyboardNavigation = 'true'
            }
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              className="scene-motion-layer"
              key={scene.id}
              initial={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, clipPath: 'inset(0 0 8% 0)', y: 18 }
              }
              animate={{ opacity: 1, clipPath: 'inset(0 0 0% 0)', y: 0 }}
              exit={
                reducedMotion
                  ? { opacity: 0 }
                  : { opacity: 0, clipPath: 'inset(8% 0 0 0)', y: -12 }
              }
            >
              {scene.render({ step, reducedMotion })}
            </motion.div>
          </AnimatePresence>
        </main>

        <div className="scene-status" aria-hidden="true">
          <span style={{ color: chapter.accent }}>{chapter.label}</span>
          <span>
            {String(sceneIndex + 1).padStart(2, '0')} /{' '}
            {String(scenes.length).padStart(2, '0')}
          </span>
        </div>

        <nav
          className="presentation-controls"
          aria-label="Presentation controls"
          inert={overviewOpen || helpOpen}
          aria-hidden={overviewOpen || helpOpen}
        >
          <button
            type="button"
            onClick={goPrevious}
            disabled={sceneIndex === 0 && step === 0}
            aria-label="Previous scene or reveal"
          >
            ←
          </button>
          <button type="button" onClick={openOverview}>
            Overview
          </button>
          <button type="button" onClick={openHelp} aria-label="Keyboard help">
            ?
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={sceneIndex === scenes.length - 1 && step === maxStep}
            aria-label="Next scene or reveal"
          >
            →
          </button>
        </nav>

        <div className="progress-track" aria-hidden="true">
          <motion.span
            style={{ background: chapter.accent, transformOrigin: 'left' }}
            animate={{ scaleX: progress }}
          />
        </div>

        <p className="sr-only" aria-live="polite">
          {scene.title}. Reveal {step + 1} of {maxStep + 1}.
        </p>

        <AnimatePresence>
          {overviewOpen ? (
            <motion.section
              className="overview-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="overview-title"
              onKeyDown={trapFocus}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="overlay-header">
                <div>
                  <span>Presentation map</span>
                  <h2 id="overview-title">Choose a scene</h2>
                </div>
                <button
                  type="button"
                  ref={overviewCloseRef}
                  onClick={() => setOverviewOpen(false)}
                  aria-label="Close scene overview"
                >
                  Close
                </button>
              </div>
              <div className="overview-grid">
                {scenes.map((overviewScene, index) => {
                  const overviewChapter = chapters[overviewScene.chapter]
                  return (
                    <button
                      type="button"
                      key={overviewScene.id}
                      onClick={() => goTo(index)}
                      className={index === sceneIndex ? 'overview-item--active' : ''}
                      style={
                        {
                          '--overview-accent': overviewChapter.accent,
                        } as CSSProperties
                      }
                    >
                      <span>{String(index + 1).padStart(2, '0')}</span>
                      <strong>{overviewScene.shortTitle ?? overviewScene.title}</strong>
                      <small>{overviewChapter.label}</small>
                    </button>
                  )
                })}
              </div>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {helpOpen ? (
            <motion.section
              className="help-panel"
              role="dialog"
              aria-modal="true"
              aria-labelledby="help-title"
              onKeyDown={trapFocus}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <div className="overlay-header">
                <div>
                  <span>Presenter controls</span>
                  <h2 id="help-title">Keyboard shortcuts</h2>
                </div>
                <button
                  type="button"
                  ref={helpCloseRef}
                  onClick={() => setHelpOpen(false)}
                  aria-label="Close keyboard help"
                >
                  Close
                </button>
              </div>
              <dl className="shortcut-list">
                <div><dt>→ / Space</dt><dd>Next reveal or scene</dd></div>
                <div><dt>←</dt><dd>Previous reveal or scene</dd></div>
                <div><dt>O</dt><dd>Scene overview</dd></div>
                <div><dt>P</dt><dd>Presenter notes and timer</dd></div>
                <div><dt>F</dt><dd>Fullscreen</dd></div>
                <div><dt>Home / End</dt><dd>First or last scene</dd></div>
                <div><dt>Esc</dt><dd>Close overlays</dd></div>
              </dl>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <AnimatePresence>
          {presenterOpen && !overviewOpen && !helpOpen ? (
            <motion.aside
              className="presenter-panel"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              aria-label="Presenter notes"
            >
              <div>
                <span>Elapsed</span>
                <strong>{formatElapsed(elapsedSeconds)}</strong>
              </div>
              <div>
                <span>Scene guidance · {scene.minutes ?? 1} min</span>
                <p>{scene.notes}</p>
              </div>
              <div className="presenter-actions">
                <button type="button" onClick={() => setElapsedSeconds(0)}>
                  Reset timer
                </button>
                <button type="button" onClick={() => setPresenterOpen(false)}>
                  Hide
                </button>
              </div>
            </motion.aside>
          ) : null}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
