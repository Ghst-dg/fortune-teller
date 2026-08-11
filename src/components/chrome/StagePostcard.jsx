import { useMemo } from 'react'
import { useFortuneStore } from '../../store/useFortuneStore'
import { getStageArt } from '../../utils/stageArt'

const SIDES = { welcome: 'left', identity: 'left', palm: 'left', scanning: 'left', tarot: 'right' }

export default function StagePostcard({ stage }) {
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)
  const images = useMemo(() => SIDES[stage] ? getStageArt(stage, seed, revision) : [], [revision, seed, stage])
  if (!SIDES[stage]) return null

  return (
    <aside className={`stage-collage stage-collage--${stage} stage-collage--${SIDES[stage]}`}
      data-count={images.length} aria-hidden="true">
      {images.map(({ src, fastener, edge, accent, style }, index) => (
        <span className={`stage-collage__card stage-collage__card--${index + 1}`} style={style} key={src}>
          <img src={src} alt="" draggable="false" />
          <i className={`stage-collage__fastener stage-collage__fastener--${fastener} stage-collage__fastener--${edge}`} data-accent={accent} />
        </span>
      ))}
    </aside>
  )
}
