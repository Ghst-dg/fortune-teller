import {
  Bloom, BrightnessContrast, ChromaticAberration, EffectComposer,
  HueSaturation, Noise, Scanline, Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Vector2 } from 'three'
import { STAGE_ZONE } from '../../constants/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const TONES = {
  market: { brightness: 0.018, contrast: 0.055, hue: 0.012, saturation: 0.11 },
  street: { brightness: -0.008, contrast: 0.085, hue: -0.012, saturation: 0.04 },
  ghat: { brightness: 0.008, contrast: 0.065, hue: 0.018, saturation: 0.09 },
}

export default function PostEffects({ enabled, stage, tarotPhase }) {
  const reduced = useReducedMotion()
  const zone = STAGE_ZONE[stage]
  const previousZone = useRef(zone)
  const [travelPulse, setTravelPulse] = useState(false)
  const isScan = stage === 'scanning'
  const isReveal = stage === 'tarot' && tarotPhase === 'revealing'
  const isMoment = isScan || isReveal || travelPulse
  const tone = TONES[zone]
  const chroma = useMemo(() => {
    const x = isScan ? 0.0024 : travelPulse ? 0.0018 : 0.0011
    return new Vector2(x, x * 0.5)
  }, [isScan, travelPulse])

  useEffect(() => {
    if (previousZone.current === zone) return undefined
    previousZone.current = zone
    if (reduced) return undefined
    const frame = window.requestAnimationFrame(() => setTravelPulse(true))
    const timer = window.setTimeout(() => setTravelPulse(false), 1050)
    return () => {
      window.cancelAnimationFrame(frame)
      window.clearTimeout(timer)
    }
  }, [reduced, zone])

  if (!enabled) return null

  return (
    <EffectComposer multisampling={0}>
      <BrightnessContrast brightness={tone.brightness} contrast={tone.contrast} />
      <HueSaturation hue={tone.hue} saturation={tone.saturation} />
      <Bloom mipmapBlur intensity={isReveal ? 1.15 : travelPulse ? 0.9 : isScan ? 0.62 : 0.42}
        luminanceThreshold={travelPulse ? 0.68 : 0.78} luminanceSmoothing={0.42} />
      {isMoment && <ChromaticAberration offset={chroma} radialModulation modulationOffset={0.25} />}
      {isScan && <Scanline density={1.15} opacity={0.08} blendFunction={BlendFunction.OVERLAY} />}
      <Noise opacity={travelPulse ? 0.026 : 0.015} blendFunction={BlendFunction.SOFT_LIGHT} />
      <Vignette eskil={false} offset={0.14}
        darkness={isScan || stage === 'tarot' ? 0.52 : travelPulse ? 0.44 : 0.34} />
    </EffectComposer>
  )
}
