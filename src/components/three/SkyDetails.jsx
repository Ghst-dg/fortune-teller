import { Float } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

function Kite({ position, color, speed }) {
  const kite = useRef()
  useFrame(({ clock }) => {
    if (!kite.current) return
    kite.current.rotation.z = Math.sin(clock.elapsedTime * speed + position[0]) * 0.2
    kite.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed * 0.6) * 0.16
  })
  return <group ref={kite} position={position} rotation-z={Math.PI / 4}>
    <mesh><boxGeometry args={[0.38, 0.38, 0.035]} /><meshStandardMaterial color={color} /></mesh>
    {[0, 1, 2].map((item) => <mesh key={item} position={[-0.37 - item * 0.2, -0.37 - item * 0.2, 0]}>
      <octahedronGeometry args={[0.07, 0]} /><meshBasicMaterial color="#ffdf6b" toneMapped={false} />
    </mesh>)}
  </group>
}

export default function SkyDetails() {
  const reduced = useReducedMotion()
  return <Float speed={reduced ? 0 : 0.35} floatIntensity={0.12} rotationIntensity={0.02}>
    <Kite position={[-2.1, 2.15, -3.2]} color="#ef4f84" speed={0.8} />
    <Kite position={[2.1, 2.45, -4]} color="#55d7cb" speed={0.55} />
  </Float>
}
