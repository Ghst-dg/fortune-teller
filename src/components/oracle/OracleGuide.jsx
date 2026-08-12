import { useEffect, useMemo, useState } from 'react'
import { STAGES } from '../../constants/experience'
import dialogue from '../../data/oracleDialogue.json'
import { useFortuneStore } from '../../store/useFortuneStore'
import { createStageVariants } from '../../utils/variantMachine'

const POSES = [
  { id: 'welcome-original', path: '/oracle/welcome.webp' },
  { id: 'identity-original', path: '/oracle/identity.webp' },
  { id: 'palm-original', path: '/oracle/palm.webp' },
  { id: 'scanning-original', path: '/oracle/scanning.webp' },
  { id: 'tarot-original', path: '/oracle/tarot.webp' },
  { id: 'result-original', path: '/oracle/result.webp' },
  { id: 'mischief-card', path: '/oracle/mischief-card.webp' },
  { id: 'mischief-slip', path: '/oracle/mischief-slip.webp' },
  { id: 'mischief-detective', path: '/oracle/mischief-detective.webp' },
  { id: 'sideeye-pin', path: '/oracle/sideeye-pin.webp' },
  { id: 'laugh-crown', path: '/oracle/laugh-crown.webp' },
  { id: 'mock-gasp', path: '/oracle/mock-gasp.webp' },
  { id: 'earring-thief', path: '/oracle/earring-thief.webp' },
  { id: 'whisper', path: '/oracle/whisper.webp' },
  { id: 'receipt-laugh', path: '/oracle/receipt-laugh.webp' },
  { id: 'sleepy-scarf', path: '/oracle/sleepy-scarf.webp' },
  { id: 'victory', path: '/oracle/victory.webp' },
  { id: 'who-me', path: '/oracle/who-me.webp' },
  { id: 'fake-meditation', path: '/oracle/fake-meditation.webp' },
  { id: 'twirl-slip', path: '/oracle/twirl-slip.webp' },
]
const SIDES = {
  welcome: 'right', identity: 'right', palm: 'right',
  scanning: 'right', tarot: 'left', result: 'right',
}

export default function OracleGuide({ stage }) {
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)
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
  const side = SIDES[stage] ?? 'right'

  useEffect(() => {
    POSES.forEach(({ path }) => { new Image().src = path })
  }, [])

  function speakAgain() {
    if (lines.length < 2) return
    setLineCursor((current) => current + 1)
  }

  function anchorBubble(event) {
    const image = event.currentTarget
    const ratio = image.naturalWidth / image.naturalHeight
    const visibleHeight = ratio > image.clientWidth / image.clientHeight
      ? image.clientWidth / ratio
      : image.clientHeight
    image.parentElement.style.setProperty(
      '--oracle-content-top', `${Math.max(0, image.clientHeight - visibleHeight).toFixed(1)}px`,
    )
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
      <img className="oracle-guide__art" src={pose.path} alt="" draggable="false"
        onLoad={anchorBubble} />
    </aside>
  )
}
