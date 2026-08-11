import { STAGES, STAGE_LABELS } from '../../constants/experience'

export default function ProgressRail({ stage }) {
  const activeIndex = STAGES.indexOf(stage)

  return (
    <nav className="progress-rail" data-stage={stage} aria-label="Reading progress">
      {STAGES.map((item, index) => (
        <span
          className={index === activeIndex ? 'is-active' : index < activeIndex ? 'is-done' : ''}
          key={item}
          tabIndex="0"
          aria-label={`${STAGE_LABELS[item]}: ${index === activeIndex ? 'current step' : index < activeIndex ? 'complete' : 'upcoming'}`}
          aria-current={index === activeIndex ? 'step' : undefined}
        >
          <i aria-hidden="true" />
          <b>{STAGE_LABELS[item]}</b>
        </span>
      ))}
    </nav>
  )
}
