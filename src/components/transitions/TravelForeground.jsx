import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils } from 'three'
import { STAGES, STAGE_ZONE } from '../../constants/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import GhatTravelProp from './GhatTravelProp'
import MarketTravelProp from './MarketTravelProp'
import StreetTravelProp from './StreetTravelProp'

const PROPS = { market: MarketTravelProp, street: StreetTravelProp, ghat: GhatTravelProp }
const CROSS_ZONE = new Set(['palm', 'tarot'])

function ease(value) { return 1 - (1 - value) ** 3 }

function moveSweep(object, progress, direction, lift = 0) {
  if (!object) return
  const active = progress > 0 && progress < 1
  object.visible = active
  if (!active) return
  const curved = ease(progress)
  object.position.x = direction * MathUtils.lerp(-5.4, 5.4, curved)
  object.position.y = lift + Math.sin(progress * Math.PI) * .22
  object.position.z = Math.sin(progress * Math.PI) * .12
  object.rotation.z = direction * Math.sin(progress * Math.PI) * .045
  object.scale.setScalar(.94 + Math.sin(progress * Math.PI) * .08)
}

export default function TravelForeground({ stage, resetRevision }) {
  const anchor = useRef()
  const sweep = useRef()
  const boat = useRef()
  const shutter = useRef()
  const sari = useRef()
  const elapsed = useRef(0)
  const reduced = useReducedMotion()
  const reset = stage === 'welcome' && resetRevision > 0
  const active = reset || stage !== 'welcome'
  const zone = STAGE_ZONE[stage]
  const Prop = PROPS[zone]
  const direction = STAGES.indexOf(stage) % 2 ? 1 : -1
  const duration = reset ? .78 : CROSS_ZONE.has(stage) ? 1.28 : .76

  useFrame(({ camera }, delta) => {
    if (!anchor.current) return
    anchor.current.visible = active && !reduced
    if (!active || reduced) return
    anchor.current.position.copy(camera.position)
    anchor.current.quaternion.copy(camera.quaternion)
    anchor.current.translateZ(-2.35)
    elapsed.current += Math.min(delta, .05)
    const progress = Math.min(1, elapsed.current / duration)
    if (reset) {
      moveSweep(boat.current, MathUtils.clamp(progress / .34, 0, 1), -1, -.16)
      moveSweep(shutter.current, MathUtils.clamp((progress - .24) / .34, 0, 1), 1, 0)
      moveSweep(sari.current, MathUtils.clamp((progress - .48) / .38, 0, 1), -1, .12)
    } else moveSweep(sweep.current, progress, direction, zone === 'ghat' ? -.2 : 0)
  })

  return (
    <group ref={anchor} visible={false}>
      {reset ? <>
        <group ref={boat}><GhatTravelProp /></group>
        <group ref={shutter}><StreetTravelProp /></group>
        <group ref={sari}><MarketTravelProp /></group>
      </> : <group ref={sweep}><Prop /></group>}
    </group>
  )
}
