import { useState } from 'react'
import { useFortuneStore } from '../../store/useFortuneStore'
import { useStableStageCopy } from '../../utils/stageCopy'
import BrutalButton from '../ui/BrutalButton'
import StageShell from '../ui/StageShell'

const HESITATIONS = [
  'Still here.',
  'Future says: maybe.',
  'I have chai.',
]

export default function IntroStage() {
  const acceptFate = useFortuneStore((state) => state.acceptFate)
  const copy = useStableStageCopy('welcome')
  const [hesitation, setHesitation] = useState(copy.caption)
  const [index, setIndex] = useState(0)

  function decline() {
    setHesitation(HESITATIONS[index % HESITATIONS.length])
    setIndex((value) => value + 1)
  }

  return (
    <StageShell
      className="intro-stage"
      eyebrow={copy.eyebrow}
      title={copy.title}
    >
      <div className="intro-actions">
        <BrutalButton onClick={acceptFate}>Show me</BrutalButton>
        <button className="text-button" type="button" onClick={decline}>Not yet</button>
      </div>
      <p className="hesitation" aria-live="polite">{hesitation}</p>
    </StageShell>
  )
}
