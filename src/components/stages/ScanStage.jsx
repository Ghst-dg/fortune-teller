import { useEffect, useMemo, useState } from 'react'
import { TIMINGS } from '../../constants/experience'
import scanCaptions from '../../data/scanCaptions.json'
import { useFortuneStore } from '../../store/useFortuneStore'
import { hashString } from '../../utils/fortune'
import { useStableStageCopy } from '../../utils/stageCopy'
import PalmMap from '../scan/PalmMap'
import StageShell from '../ui/StageShell'

export default function ScanStage() {
  const name = useFortuneStore((state) => state.name)
  const dateOfBirth = useFortuneStore((state) => state.dateOfBirth)
  const palmImage = useFortuneStore((state) => state.palmImage)
  const completeScan = useFortuneStore((state) => state.completeScan)
  const copy = useStableStageCopy('scanning')
  const [progress, setProgress] = useState(0)
  const score = useMemo(() => 88 + Math.abs(hashString(`${name}${dateOfBirth}`)) % 11, [name, dateOfBirth])
  const captionIndex = Math.min(scanCaptions.length - 1, Math.floor(progress / 10))

  useEffect(() => {
    const startedAt = performance.now()
    const timer = setInterval(() => {
      const next = Math.min(100, ((performance.now() - startedAt) / TIMINGS.scanDuration) * 100)
      setProgress(next)
      if (next >= 100) {
        clearInterval(timer)
        setTimeout(() => completeScan(score), 450)
      }
    }, 70)
    return () => clearInterval(timer)
  }, [completeScan, score])

  return (
    <StageShell
      className="scan-stage"
      eyebrow={copy.eyebrow}
      title={copy.title}
    >
      <div className="scan-console">
        <div className={`scan-portrait ${palmImage ? '' : 'is-demo'}`}
          style={palmImage ? { backgroundImage: `url(${palmImage})` } : undefined}>
          <PalmMap progress={progress} />
        </div>
        <div className="scan-data">
          <p><span>NAME</span><b>{name.toUpperCase()}</b></p>
          <p><span>VIBE</span><b>{Math.min(score, Math.round(progress * score / 100))}.0</b></p>
          <p><span>TYPE</span><b>{progress > 78 ? copy.caption : 'READING…'}</b></p>
        </div>
      </div>
      <div className="scan-caption" aria-live="polite">
        <span>{String(Math.round(progress)).padStart(3, '0')}%</span>
        <p>{scanCaptions[captionIndex]}</p>
      </div>
    </StageShell>
  )
}
