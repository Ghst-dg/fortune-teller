import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, MathUtils } from 'three'
import { STAGE_ZONE, ZONE_Y } from '../../constants/experience'

const MOODS = {
  welcome: ['#ef864d', '#ffd06b', 2.3],
  identity: ['#d96e55', '#ffbd64', 2.15],
  palm: ['#24536a', '#6ce7d9', 1.75],
  scanning: ['#302750', '#b597ff', 1.45],
  tarot: ['#241d49', '#ffc562', 1.6],
  result: ['#e47b4c', '#ffe070', 2.45],
}

export default function SceneLighting({ stage }) {
  const background = useRef()
  const fog = useRef()
  const keyLight = useRef()
  const accentLight = useRef()
  const mood = MOODS[stage]
  const skyTarget = useMemo(() => new Color(mood[0]), [mood])
  const lightTarget = useMemo(() => new Color(mood[1]), [mood])

  useFrame((_, delta) => {
    background.current?.lerp(skyTarget, 1 - Math.exp(-delta * 2.5))
    fog.current?.color.lerp(skyTarget, 1 - Math.exp(-delta * 2.5))
    if (keyLight.current) {
      keyLight.current.color.lerp(lightTarget, 1 - Math.exp(-delta * 2.5))
      keyLight.current.intensity = MathUtils.damp(keyLight.current.intensity, mood[2], 3, delta)
    }
    if (accentLight.current) accentLight.current.position.y = MathUtils.damp(
      accentLight.current.position.y, ZONE_Y[STAGE_ZONE[stage]] + 0.5, 3, delta,
    )
  })

  return (
    <>
      <color ref={background} attach="background" args={[mood[0]]} />
      <fog ref={fog} attach="fog" args={[mood[0], 7, 16]} />
      <ambientLight intensity={1.25} color="#ffe6bd" />
      <directionalLight ref={keyLight} position={[-4, 5, 3]} intensity={mood[2]} color={mood[1]} />
      <pointLight ref={accentLight} position={[3, ZONE_Y[STAGE_ZONE[stage]] + 0.5, 1]}
        intensity={stage === 'tarot' ? 14 : 9} distance={6} color="#ff5a91" />
    </>
  )
}
