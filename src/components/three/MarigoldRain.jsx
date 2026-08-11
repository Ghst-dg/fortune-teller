import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const PETALS = Array.from({ length: 14 }, (_, index) => ({
  x: -4.2 + (index * 1.37) % 8.4,
  y: -0.4 + (index * 0.91) % 4.8,
  z: -1.2 - (index % 4) * 0.55,
  speed: 0.18 + (index % 5) * 0.035,
}))

export default function MarigoldRain() {
  const group = useRef()
  const reduced = useReducedMotion()
  useFrame((_, delta) => {
    if (!group.current || reduced) return
    group.current.children.forEach((petal, index) => {
      petal.position.y -= delta * PETALS[index].speed
      petal.rotation.x += delta * 0.55
      petal.rotation.z += delta * 0.35
      if (petal.position.y < -1.4) petal.position.y = 3.7
    })
  })
  return <group ref={group}>
    {PETALS.map((petal, index) => <mesh key={index} position={[petal.x, petal.y, petal.z]} scale={[0.1, 0.16, 0.035]}>
      <sphereGeometry args={[1, 8, 6]} />
      <meshBasicMaterial color={index % 3 === 0 ? '#f04f87' : '#ffb000'} toneMapped={false} />
    </mesh>)}
  </group>
}
