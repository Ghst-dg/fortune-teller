import { Sparkles } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer, Vignette } from '@react-three/postprocessing'
import { useMemo, useRef } from 'react'
import { Color, MathUtils, Vector3 } from 'three'
import TransitionGate from './TransitionGate'

const DEPTHS = [5, 3.25, 1.5, -.25, -2]
const PALETTES = {
  market: { background: '#b74b3e', cloth: ['#522348', '#d85f43'], gold: '#ffc43c' },
  street: { background: '#176f76', cloth: ['#24345d', '#d26048'], gold: '#f4d37c' },
  ghat: { background: '#245a70', cloth: ['#292044', '#b24758'], gold: '#ffbf47' },
}
const ACCENTS = { brocade: '#ffc43c', ganga: '#76e4dc', gulabi: '#f27f98', marigold: '#ffb000', ink: '#fff0c2' }

function ease(value) { return 1 - (1 - value) ** 3 }

export default function TransitionScene({ zone, accent, mode, duration }) {
  const journey = useRef()
  const target = useMemo(() => new Vector3(), [])
  const palette = PALETTES[zone]
  const accentColor = ACCENTS[accent] ?? palette.gold

  useFrame(({ camera, clock }) => {
    const raw = Math.min(1, clock.elapsedTime / (duration / 1000))
    const progress = ease(raw)
    if (mode === 'rewind') {
      journey.current.position.y = -progress * 6.4
      camera.position.z = 7 - progress * 2.4
      target.set(0, progress * 1.1, -4)
    } else {
      camera.position.z = 7 - progress * 9.1
      camera.position.y = Math.sin(raw * Math.PI) * .16
      target.set(0, 0, -6)
    }
    journey.current.rotation.z = Math.sin(raw * Math.PI) * .012
    camera.lookAt(target)
    camera.fov = MathUtils.lerp(46, mode === 'rewind' ? 51 : 49, progress)
    camera.updateProjectionMatrix()
  })

  return (
    <>
      <color attach="background" args={[palette.background]} />
      <ambientLight intensity={1.8} />
      <directionalLight position={[2, 4, 7]} intensity={2.2} color={palette.gold} />
      <group ref={journey}>
        {DEPTHS.map((z, index) => (
          <TransitionGate key={z} z={z} scale={1 + index * .045}
            color={palette.cloth[index % 2]} accent={index % 2 ? accentColor : palette.gold}
            flip={index % 2 === 0} />
        ))}
        <Sparkles count={42} scale={[7, 5, 12]} size={2.2} speed={.12}
          color={new Color(accentColor)} opacity={.65} />
        <mesh position={[0, 0, -7]}>
          <planeGeometry args={[20, 13]} />
          <meshBasicMaterial color={palette.background} />
        </mesh>
      </group>
      <EffectComposer multisampling={0}>
        <Bloom mipmapBlur intensity={.72} luminanceThreshold={.62} luminanceSmoothing={.5} />
        <Vignette eskil={false} offset={.08} darkness={.36} />
      </EffectComposer>
    </>
  )
}
