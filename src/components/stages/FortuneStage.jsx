import cards from '../../data/tarotCards.json'
import { useResultCountdown } from '../../hooks/useResultCountdown'
import { useFortuneStore } from '../../store/useFortuneStore'
import { useStableStageCopy } from '../../utils/stageCopy'
import ResultVisual from '../fortune/ResultVisual'
import BrutalButton from '../ui/BrutalButton'

export default function FortuneStage() {
  const name = useFortuneStore((state) => state.name)
  const fortune = useFortuneStore((state) => state.fortune)
  const cardId = useFortuneStore((state) => state.selectedCardId)
  const deadline = useFortuneStore((state) => state.resultDeadline)
  const reset = useFortuneStore((state) => state.resetSession)
  const time = useResultCountdown(deadline, reset)
  const copy = useStableStageCopy('result')
  const card = cards.find((item) => item.id === cardId) ?? cards[0]

  return (
    <section className="stage fortune-stage" aria-labelledby="fortune-title"
      style={{ '--fortune-accent': fortune.lucky.hex }}>
      <ResultVisual card={card} />
      <article className="fortune-paper">
        <p className="fortune-kicker">{copy.eyebrow} · {name}</p>
        <p className="fortune-aside">{copy.title}</p>
        <h1 id="fortune-title">{fortune.headline}</h1>
        <p className="fortune-prediction">{fortune.fortune}</p>
        <div className="fortune-combo" role="group" aria-label={`${copy.caption}: ${fortune.lucky.number}, ${fortune.lucky.moment}, ${fortune.lucky.snack}, ${fortune.lucky.key}`}>
          <span>{copy.caption}</span>
          <b>{fortune.lucky.number} · {fortune.lucky.moment} · {fortune.lucky.snack} · {fortune.lucky.key}</b>
        </div>
        <div className="result-actions">
          <BrutalButton tone="cream" onClick={reset}>Again</BrutalButton>
          <p>Gone in <b>{time}</b></p>
        </div>
      </article>
    </section>
  )
}
