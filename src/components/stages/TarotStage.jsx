import { useEffect } from 'react'
import { TIMINGS } from '../../constants/experience'
import cards from '../../data/tarotCards.json'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { useFortuneStore } from '../../store/useFortuneStore'
import { pickRandomItem } from '../../utils/fortune'
import { useStableStageCopy } from '../../utils/stageCopy'
import TarotCard from '../tarot/TarotCard'
import StageShell from '../ui/StageShell'

const CAPTIONS = {
  shuffle: 'Shuffling fate.',
  cut: 'One clean cut.',
  deal: 'Dealing five.',
  spread: 'Spread set.',
  selecting: 'Scanning the spread…',
  locked: 'Card locked.',
  revealing: 'Turning it over…',
}

export default function TarotStage() {
  const name = useFortuneStore((state) => state.name)
  const phase = useFortuneStore((state) => state.tarotPhase)
  const selectedId = useFortuneStore((state) => state.selectedCardId)
  const setPhase = useFortuneStore((state) => state.setTarotPhase)
  const lockCard = useFortuneStore((state) => state.lockTarotCard)
  const revealFortune = useFortuneStore((state) => state.revealFortune)
  const reduced = useReducedMotion()
  const copy = useStableStageCopy('tarot')
  const selectedIndex = cards.findIndex((card) => card.id === selectedId)
  const selectedCard = cards[selectedIndex]
  const caption = phase === 'revealing' && selectedCard
    ? `${selectedCard.name}.`
    : phase === 'locked' && selectedIndex >= 0
      ? `Card ${selectedIndex + 1} locked.`
      : phase === 'shuffle' ? copy.caption : CAPTIONS[phase]

  useEffect(() => {
    const wait = (duration) => reduced ? Math.max(100, duration * 0.18) : duration
    const timers = [
      setTimeout(() => setPhase('cut'), wait(TIMINGS.tarotCut)),
      setTimeout(() => setPhase('deal'), wait(TIMINGS.tarotDeal)),
      setTimeout(() => setPhase('spread'), wait(TIMINGS.tarotSpread)),
      setTimeout(() => setPhase('selecting'), wait(TIMINGS.tarotSelecting)),
      setTimeout(() => lockCard(pickRandomItem(cards).id), wait(TIMINGS.tarotLock)),
      setTimeout(() => setPhase('revealing'), wait(TIMINGS.tarotReveal)),
      setTimeout(revealFortune, wait(TIMINGS.tarotComplete)),
    ]
    return () => timers.forEach(clearTimeout)
  }, [lockCard, reduced, revealFortune, setPhase])

  return (
    <StageShell className="tarot-stage" align="center"
      eyebrow={copy.eyebrow} title={<>{copy.title} <em>{name}.</em></>}>
      <div className={`tarot-spread tarot-spread--${phase}`}
        aria-label="Five-card spread; one card will be selected at random">
        {cards.map((card, index) => <TarotCard card={card} index={index} key={card.id}
          selected={selectedId === card.id} revealed={phase === 'revealing'} />)}
      </div>
      <p className="tarot-hint" aria-live="polite"><span>✦</span> {caption}</p>
    </StageShell>
  )
}
