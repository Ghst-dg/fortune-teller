import { Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import MarketCrafts from './MarketCrafts'
import MarketDetails from './MarketDetails'

const COLORS = ['#b95440', '#dc9241', '#3f7f86', '#c55d73', '#76516b']
const FACADES = Array.from({ length: 25 }, (_, index) => ({
  x: -18 + index * 1.5,
  height: 2.65 + ((index * 7) % 5) * 0.28,
  color: COLORS[(index * 3) % COLORS.length],
}))

function StallFrame({ x, color, wide = false }) {
  const width = wide ? 2.4 : 1.85
  return <group position={[x, -1.14, -1.9]}>
    <mesh position={[0, 0.12, 0]}><boxGeometry args={[width, 0.22, 0.92]} />
      <meshStandardMaterial color="#74442f" roughness={1} /></mesh>
    {[-1, 1].map((side) => <mesh key={side} position={[side * width * 0.45, 0.9, -0.04]}>
      <boxGeometry args={[0.06, 1.7, 0.06]} /><meshStandardMaterial color="#38251f" />
    </mesh>)}
    <mesh position={[0, 1.72, -0.02]} rotation-x={-0.08}>
      <boxGeometry args={[width + 0.24, 0.09, 1.15]} />
      <meshStandardMaterial color={color} roughness={0.96} />
    </mesh>
  </group>
}

export default function MarketWorld({ active = true }) {
  const lanterns = useRef()
  const reduced = useReducedMotion()

  useFrame(({ clock }) => {
    if (!active || reduced) return
    lanterns.current?.children.forEach((lantern, index) => {
      lantern.rotation.z = Math.sin(clock.elapsedTime * 0.62 + index * 1.7) * 0.045
    })
  })

  return <group>
    <mesh position={[0, 0, -5.65]}><boxGeometry args={[40, 4.5, 0.8]} />
      <meshStandardMaterial color="#974e3f" roughness={1} /></mesh>
    <Instances limit={FACADES.length}>
      <boxGeometry /><meshStandardMaterial roughness={1} />
      {FACADES.map((facade) => <Instance key={facade.x} color={facade.color}
        position={[facade.x, -1.42 + facade.height / 2, -5.08]}
        scale={[1.42, facade.height, 0.9]} />)}
    </Instances>
    <Instances limit={FACADES.length}>
      <boxGeometry /><meshStandardMaterial color="#261f35" roughness={0.96} />
      {FACADES.map((facade, index) => <Instance key={facade.x}
        position={[facade.x, -0.38 + (index % 3) * 0.18, -4.58]}
        scale={[0.84, 1.03, 0.06]} />)}
    </Instances>
    <StallFrame x={-8.6} color="#e64d78" />
    <StallFrame x={-3.75} color="#f2a62c" wide />
    <StallFrame x={3.65} color="#218c98" wide />
    <StallFrame x={8.8} color="#dd6544" />
    <MarketCrafts /><MarketDetails />
    <mesh position={[0, -1.42, -0.65]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[42, 17]} /><meshStandardMaterial color="#a96b4b" roughness={1} />
    </mesh>
    <group ref={lanterns} position={[0, 1.75, -1.45]}>
      {Array.from({ length: 17 }, (_, index) => <mesh key={index}
        position={[-13.6 + index * 1.7, Math.sin(index * 1.4) * 0.14, 0]}>
        <octahedronGeometry args={[0.13 + (index % 3) * 0.02, 0]} />
        <meshBasicMaterial color={index % 2 ? '#ffaf25' : '#ed4f75'} toneMapped={false} />
      </mesh>)}
    </group>
  </group>
}
