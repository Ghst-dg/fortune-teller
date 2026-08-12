import { usePalmCamera } from '../../hooks/usePalmCamera'
import PalmGuide from './PalmGuide'

const STATUS_COPY = {
  requesting: ['OPENING CAMERA', 'Allow access.'],
  loading: ['WAKING PALM READER', 'Keep your right hand ready.'],
  searching: ['FINDING RIGHT PALM', 'Open your right hand.'],
  'wrong-hand': ['OTHER HAND, PLEASE', 'Mithu asked for the right one.'],
  detected: ['RIGHT PALM FOUND', 'Hold it still.'],
  unavailable: ['PALM READER PAUSED', 'Reload to try the camera again.'],
  blocked: ['CAMERA BLOCKED', 'Allow camera, then reload.'],
  captured: ['GOT IT', 'Right palm secured.'],
}

export default function PalmCamera({ onCapture }) {
  const { videoRef, status, confidence } = usePalmCamera(onCapture)
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
    </div>
  )
}
