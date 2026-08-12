import { STAGE_ZONE } from '../../constants/experience'
import { useFortuneStore } from '../../store/useFortuneStore'
import { createStageVariants } from '../../utils/variantMachine'

const ACCENT_COLORS = {
  brocade: 'var(--coral)',
  ganga: 'var(--aqua)',
  gulabi: '#f27f98',
  marigold: 'var(--sun)',
  ink: 'var(--ink)',
}

export default function StageTransition({ stage }) {
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)
  const mode = stage === 'welcome' && revision > 0 ? 'rewind' : 'forward'
  const { transitionAccent } = createStageVariants({ seed, resetRevision: revision, stage })

  return (
    <div
      key={`${revision}:${stage}`}
      className="stage-transition"
      data-mode={mode}
      data-zone={STAGE_ZONE[stage]}
      data-accent={transitionAccent}
      style={{ '--spark': ACCENT_COLORS[transitionAccent] }}
      aria-hidden="true"
    >
      <div className="stage-transition__paper" />
      <div className="stage-transition__brocade" />
      <span className="stage-transition__ripples"><i /><i /><i /></span>
    </div>
  )
}
