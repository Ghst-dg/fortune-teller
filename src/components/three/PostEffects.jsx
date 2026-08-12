import {
  Bloom, BrightnessContrast, EffectComposer, HueSaturation, Noise, Scanline, Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useEffect, useRef, useState } from 'react'
import { STAGE_ZONE } from '../../constants/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const TONES = {
  market: { brightness: .018, contrast: .055, hue: .012, saturation: .11 },
  street: { brightness: -.008, contrast: .085, hue: -.012, saturation: .04 },
  ghat: { brightness: .008, contrast: .065, hue: .018, saturation: .09 },
}

export default function PostEffects({ enabled, stage, tarotPhase, resetRevision }) {
  const reduced = useReducedMotion()
  const zone = STAGE_ZONE[stage]
  const previous = useRef({ stage, resetRevision })
  const [travelPulse, setTravelPulse] = useState(false)
  const isScan = stage === 'scanning'
  const isReveal = stage === 'tarot' && tarotPhase === 'revealing'
  const tone = TONES[zone]

  useEffect(() => {
    const changed = previous.current.stage !== stage
      || previous.current.resetRevision !== resetRevision
    previous.current = { stage, resetRevision }
    if (!changed || reduced) return undefined
    const duration = stage === 'palm' || stage === 'tarot' ? 1280 : 780
    const frame = window.requestAnimationFrame(() => setTravelPulse(true))
    const timer = window.setTimeout(() => setTravelPulse(false), duration)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [reduced, resetRevision, stage])

  if (!enabled) return null

  return (
    <EffectComposer multisampling={0}>
      <BrightnessContrast brightness={tone.brightness} contrast={tone.contrast} />
      <HueSaturation hue={tone.hue} saturation={tone.saturation} />
      <Bloom mipmapBlur intensity={isReveal ? 1.12 : travelPulse ? .82 : isScan ? .6 : .4}
        luminanceThreshold={travelPulse ? .66 : .78} luminanceSmoothing={.44} />
      {isScan && <Scanline density={1.15} opacity={.08} blendFunction={BlendFunction.OVERLAY} />}
      <Noise opacity={.012} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={.14}
        darkness={isScan || stage === 'tarot' ? .5 : travelPulse ? .4 : .34} />
    </EffectComposer>
  )
}
