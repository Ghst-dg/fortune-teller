import { useMemo } from 'react'
import { useFortuneStore } from '../../store/useFortuneStore'
import { getStageArt } from '../../utils/stageArt'
import { createStageVariants } from '../../utils/variantMachine'

const SLOTS = ['main', 'boat', 'diya']

export default function ResultVisual({ card }) {
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)
  const art = useMemo(() => getStageArt('result', seed, revision), [revision, seed])
  const variants = createStageVariants({
    seed, resetRevision: revision, stage: 'result', tarotTextureCount: 6,
  })

  return (
    <div className="result-visual" role="img"
      aria-label="Three illustrated glimpses of Varanasi beside the revealed tarot card">
      {art.map(({ src, fastener, edge, accent, style }, index) => (
        <span className={`result-photo result-photo--${SLOTS[index]}`} style={style} key={src}>
          <img src={src} alt="" draggable="false" />
          <i className={`stage-collage__fastener stage-collage__fastener--${fastener} stage-collage__fastener--${edge}`} data-accent={accent} />
        </span>
      ))}
      <div className={`result-card result-card--${card.color} texture-${variants.tarotTextureOffset}`}
        style={{ '--result-tilt': `${variants.tilt.card}deg` }} aria-hidden="true">
        <small>{card.number}</small>
        <b>{card.symbol}</b>
        <strong>{card.name}</strong>
        <em>{card.micro}</em>
      </div>
    </div>
  )
}
