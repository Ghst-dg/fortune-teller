import { STAGES } from '../../constants/experience'
import ParrotMark from './ParrotMark'

export default function AppHeader({ stage }) {
  const current = STAGES.indexOf(stage) + 1

  return (
    <header className="app-header">
      <div className="brand-lockup" aria-label="The Ghat Oracle, Varanasi">
        <span className="brand-orb"><ParrotMark /></span>
        <span>
          <b>The Ghat Oracle</b>
          <small>VARANASI</small>
        </span>
      </div>
      <div className="stage-count" aria-label={`Step ${current} of ${STAGES.length}`}>
        <span>{String(current).padStart(2, '0')}</span>
        <i aria-hidden="true" />
        <span>{String(STAGES.length).padStart(2, '0')}</span>
      </div>
    </header>
  )
}
