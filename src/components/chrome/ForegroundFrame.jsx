import { useEffect, useRef } from 'react'

const STAGE_MOOD = {
  welcome: 'market',
  identity: 'market',
  palm: 'street',
  scanning: 'street',
  tarot: 'ghat',
  result: 'ghat',
}

function MarketFrame() {
  return (
    <>
      <div className="foreground__near market-awning market-awning--left" />
      <div className="foreground__near market-awning market-awning--right" />
    </>
  )
}

function StreetFrame() {
  return (
    <>
      <div className="foreground__soft street-balcony"><i /><i /><i /><i /></div>
      <div className="foreground__near street-jali" />
      <div className="foreground__near street-shutter"><i /><i /><i /></div>
      <div className="foreground__soft street-wire"><i /><i /></div>
    </>
  )
}

const FRAMES = { market: MarketFrame, street: StreetFrame }

export default function ForegroundFrame({ stage }) {
  const frameRef = useRef(null)
  const mood = STAGE_MOOD[stage] ?? 'market'
  const Frame = FRAMES[mood]

  useEffect(() => {
    const root = frameRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!root || reduced.matches) return undefined
    let animationFrame = 0

    function update(event) {
      cancelAnimationFrame(animationFrame)
      animationFrame = requestAnimationFrame(() => {
        const x = event.clientX / window.innerWidth - 0.5
        const y = event.clientY / window.innerHeight - 0.5
        root.style.setProperty('--foreground-x', `${x * 12}px`)
        root.style.setProperty('--foreground-y', `${y * 8}px`)
        root.style.setProperty('--foreground-soft-x', `${x * -5}px`)
        root.style.setProperty('--foreground-soft-y', `${y * -3}px`)
      })
    }

    function reset() {
      root.style.setProperty('--foreground-x', '0px')
      root.style.setProperty('--foreground-y', '0px')
      root.style.setProperty('--foreground-soft-x', '0px')
      root.style.setProperty('--foreground-soft-y', '0px')
    }

    window.addEventListener('pointermove', update, { passive: true })
    document.documentElement.addEventListener('pointerleave', reset)
    return () => {
      cancelAnimationFrame(animationFrame)
      window.removeEventListener('pointermove', update)
      document.documentElement.removeEventListener('pointerleave', reset)
    }
  }, [mood])

  if (!Frame) return null

  return (
    <div className={`foreground-frame foreground-frame--${mood}`} ref={frameRef}
      aria-hidden="true">
      <Frame />
    </div>
  )
}
