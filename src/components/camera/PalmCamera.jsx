import { usePalmCamera } from '../../hooks/usePalmCamera'
import BrutalButton from '../ui/BrutalButton'
import PalmGuide from './PalmGuide'

const STATUS_COPY = {
  requesting: ['OPENING CAMERA', 'Allow access.'],
  loading: ['WAKING PALM READER', 'Keep your right hand ready.'],
  searching: ['FINDING RIGHT PALM', 'Open your right hand.'],
  'wrong-hand': ['OTHER HAND, PLEASE', 'Mithu asked for the right one.'],
  detected: ['RIGHT PALM FOUND', 'Hold it still.'],
  unavailable: ['PALM READER NAPPING', 'Tap once when ready.'],
  blocked: ['CAMERA BLOCKED', 'Use the demo.'],
  captured: ['GOT IT', 'Right palm secured.'],
}

export default function PalmCamera({ onCapture }) {
  const { videoRef, status, confidence, showFallback, capture } = usePalmCamera(onCapture)
  const [label, detail] = STATUS_COPY[status]

  return (
    <div className="camera-module">
      <div className="camera-bezel">
        <video ref={videoRef} autoPlay muted playsInline aria-label="Live camera preview for your right palm" />
        {status === 'requesting' && <div className="camera-loader"><i /><span>REQUESTING<br />CAMERA</span></div>}
        <PalmGuide active={status === 'detected'} />
        <div className="scan-sweep" aria-hidden="true" />
      </div>
      <div className="camera-readout" aria-live="polite">
        <div>
          <span className={`status-dot status-dot--${status}`} />
          <p><b>{label}</b><small>{detail}</small></p>
        </div>
        <strong>{String(confidence).padStart(2, '0')}<small>%</small></strong>
      </div>
      <div className="confidence-track" aria-hidden="true"><i style={{ width: `${confidence}%` }} /></div>
      {showFallback && (
        <BrutalButton className="camera-fallback" tone="cream" onClick={() => capture(status === 'blocked')}>
          {status === 'blocked' ? 'Use demo right palm' : 'Capture right palm now'}
        </BrutalButton>
      )}
    </div>
  )
}
