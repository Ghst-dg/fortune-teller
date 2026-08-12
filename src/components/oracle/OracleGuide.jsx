import { useEffect, useMemo, useRef, useState } from 'react'
import { STAGES } from '../../constants/experience'
import dialogue from '../../data/oracleDialogue.json'
import { useFortuneStore } from '../../store/useFortuneStore'
import { createStageVariants } from '../../utils/variantMachine'

const POSES = [
  ['welcome', .57, .17], ['identity', .45, .17], ['palm', .54, .18],
  ['scanning', .48, .23], ['tarot', .46, .2], ['result', .43, .18],
  ['mischief-card', .4, .13], ['mischief-slip', .44, .16],
  ['mischief-detective', .54, .17], ['sideeye-pin', .53, .17],
  ['laugh-crown', .48, .16], ['mock-gasp', .46, .13],
  ['earring-thief', .47, .16], ['whisper', .45, .14],
  ['receipt-laugh', .44, .15], ['sleepy-scarf', .49, .14],
  ['victory', .47, .21], ['who-me', .56, .14],
  ['fake-meditation', .48, .14], ['twirl-slip', .5, .12],
].map(([id, x, y]) => ({ id, path: `/oracle/${id}.webp`, head: [x, y] }))

function placeHead(image, pose) {
  if (!image?.naturalWidth) return
  const boxWidth = image.clientWidth
  const boxHeight = image.clientHeight
  const imageRatio = image.naturalWidth / image.naturalHeight
  const boxRatio = boxWidth / boxHeight
  const width = imageRatio > boxRatio ? boxWidth : boxHeight * imageRatio
  const height = imageRatio > boxRatio ? boxWidth / imageRatio : boxHeight
  const left = image.offsetLeft + ((boxWidth - width) / 2)
  const top = image.offsetTop + boxHeight - height
  image.parentElement.style.setProperty('--oracle-head-x', `${left + width * pose.head[0]}px`)
  image.parentElement.style.setProperty('--oracle-head-y', `${top + height * pose.head[1]}px`)
}

export default function OracleGuide({ stage }) {
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)
  const artRef = useRef(null)
  const stageIndex = Math.max(0, STAGES.indexOf(stage))
  const lines = dialogue[stage] ?? dialogue.welcome
  const sequence = useMemo(() => createStageVariants({
    seed, resetRevision: revision, stage: 'guide-sequence', poseCount: POSES.length,
  }), [revision, seed])
  const variants = useMemo(() => createStageVariants({
    seed, resetRevision: revision, stage: `guide-${stage}`,
    poseCount: lines.length, dialogueCount: lines.length,
  }), [lines.length, revision, seed, stage])
  const pose = POSES[sequence.poseOrder[stageIndex]] ?? POSES[0]
  const [lineCursor, setLineCursor] = useState(0)
  const line = variants.poseOrder[lineCursor % lines.length] ?? variants.dialogueIndex
  const nudge = Math.round((variants.tilt.card / 5.25) * 4)
  const tilt = variants.tilt.paper * .2
  const sideOffset = sequence.poseOrder[STAGES.length] % 2
  const side = (stageIndex + sideOffset) % 2 ? 'right' : 'left'

  useEffect(() => {
    POSES.forEach(({ path }) => { new Image().src = path })
  }, [])

  useEffect(() => {
    const image = artRef.current
    if (!image || typeof ResizeObserver === 'undefined') return undefined
    const observer = new ResizeObserver(() => placeHead(image, pose))
    observer.observe(image)
    return () => observer.disconnect()
  }, [pose])

  function speakAgain() {
    if (lines.length < 2) return
    setLineCursor((current) => current + 1)
  }

  return (
    <aside
      className={`oracle-guide oracle-guide--${stage} oracle-guide--side-${side} oracle-guide--pose-${pose.id}`}
      style={{ '--oracle-nudge': `${nudge}px`, '--oracle-tilt': `${tilt}deg` }}
      aria-label="Your illustrated fortune guide and her pet parrot, Mithu"
    >
      <button className="oracle-guide__bubble" onClick={speakAgain} type="button"
        aria-label="Hear another joke from the fortune guide" key={`${stage}-${line}`}>
        <span aria-live="polite">{lines[line]}</span>
      </button>
      <img ref={artRef} className="oracle-guide__art" src={pose.path} alt="" draggable="false"
        onLoad={(event) => placeHead(event.currentTarget, pose)} />
    </aside>
  )
}
