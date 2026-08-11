import { useFortuneStore } from '../../store/useFortuneStore'
import { createStageVariants } from '../../utils/variantMachine'

export default function TarotCard({ card, index, selected, revealed }) {
  const seed = useFortuneStore((state) => state.seed)
  const resetRevision = useFortuneStore((state) => state.resetRevision)
  const stage = useFortuneStore((state) => state.stage)
  const stateClass = revealed
    ? selected ? 'is-chosen' : 'is-muted'
    : selected ? 'is-targeted' : ''
  const { tarotTextureOffset } = createStageVariants({
    seed,
    resetRevision,
    stage,
    tarotTextureCount: 6,
  })
  const texture = (tarotTextureOffset + index) % 6

  return (
    <div
      className={`tarot-card tarot-card--${card.color} texture-${texture} ${stateClass}`}
      style={{
        '--card-index': index,
        '--deal-delay': `${index * 150}ms`,
        '--scan-delay': `${index * 105}ms`,
        '--shuffle-delay': `${index * -45}ms`,
        '--deck-offset': `${index * -1.25}px`,
      }}
      aria-hidden="true"
    >
      <span className="tarot-card-inner">
        <span className="tarot-back">
          <i /><b>G</b><em>THE GHAT<br />ORACLE</em><i />
        </span>
        <span className="tarot-face">
          <small>{card.number}</small>
          <b>{card.symbol}</b>
          <strong>{card.name}</strong>
          <em>{card.micro}</em>
        </span>
      </span>
    </div>
  )
}
