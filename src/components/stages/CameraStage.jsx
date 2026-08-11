import { useFortuneStore } from '../../store/useFortuneStore'
import { useStableStageCopy } from '../../utils/stageCopy'
import PalmCamera from '../camera/PalmCamera'
import StageShell from '../ui/StageShell'

export default function CameraStage() {
  const savePalm = useFortuneStore((state) => state.savePalm)
  const copy = useStableStageCopy('palm')

  return (
    <StageShell
      className="camera-stage"
      eyebrow={copy.eyebrow}
      title={copy.title}
    >
      <PalmCamera onCapture={savePalm} />
      <p className="privacy-note"><span aria-hidden="true">●</span> {copy.caption}</p>
    </StageShell>
  )
}
