import { lazy, Suspense, useEffect, useState } from 'react'
import { STAGE_ZONE } from '../../constants/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useFortuneStore } from '../../store/useFortuneStore'
import { createStageVariants } from '../../utils/variantMachine'

const TransitionCanvas = lazy(() => import('./TransitionCanvas'))
const BACKGROUNDS = { market: '#b74b3e', street: '#176f76', ghat: '#245a70' }

export default function StageTransition({ stage }) {
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)
  const reduced = useReducedMotion()
  const [visible, setVisible] = useState(true)
  const zone = STAGE_ZONE[stage]
  const mode = stage === 'welcome' && revision > 0 ? 'rewind' : 'forward'
  const duration = reduced ? 180 : mode === 'rewind' ? 520 : 760
  const { transitionAccent } = createStageVariants({ seed, resetRevision: revision, stage })

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), duration + 40)
    return () => window.clearTimeout(timer)
  }, [duration])

  if (!visible) return null

  return (
    <div className={`stage-transition${reduced ? ' stage-transition--reduced' : ''}`}
      data-mode={mode} data-zone={zone} aria-hidden="true"
      style={{ '--transition-ms': `${duration}ms`, '--transition-bg': BACKGROUNDS[zone] }}>
      <div className="stage-transition__veil" />
      {!reduced && (
        <Suspense fallback={null}>
          <TransitionCanvas zone={zone} accent={transitionAccent} mode={mode} duration={duration} />
        </Suspense>
      )}
    </div>
  )
}
