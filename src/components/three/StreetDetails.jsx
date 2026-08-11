import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import GaliThresholds from './GaliThresholds'
import KashiMural from './KashiMural'
import { GALI_SEGMENTS, innerEdge } from './galiLayout'

const WIRES = [
  [[-5.8, 2.42, -1.3], [-1.8, 2.02, -2.1], [1.4, 2.16, -1.9], [5.6, 2.52, -1.25]],
  [[-4.7, 2.84, -4.6], [-1.2, 2.45, -4.2], [1.4, 2.56, -4.35], [4.5, 2.92, -4.7]],
  [[-3.9, 2.05, -6.7], [0, 1.73, -6.25], [3.7, 2.13, -6.75]],
]

function BlueDoor({ side, segment, ochre = false }) {
  const inner = innerEdge(segment)
  return <group position={[side * inner, -0.51, segment.z]} rotation-y={-side * Math.PI / 2}>
    <mesh position={[0, 0, -0.06]}><boxGeometry args={[0.98, 1.76, 0.13]} />
      <meshStandardMaterial color="#282139" roughness={1} /></mesh>
    <mesh><boxGeometry args={[0.79, 1.55, 0.11]} />
      <meshStandardMaterial color={ochre ? '#d39536' : '#247891'} roughness={0.95} /></mesh>
    {[-0.22, 0.22].map((x) => [-0.39, 0.37].map((y) => <mesh key={`${x}-${y}`}
      position={[x, y, 0.07]}><boxGeometry args={[0.24, 0.48, 0.035]} />
      <meshStandardMaterial color={ochre ? '#975434' : '#1c526d'} roughness={1} /></mesh>))}
    <mesh position={[0, -0.84, 0.25]}><boxGeometry args={[1.15, 0.14, 0.52]} />
      <meshStandardMaterial color="#af7853" roughness={1} /></mesh>
  </group>
}

function JaliBalcony({ side, segment, y }) {
  const inner = innerEdge(segment)
  return <group position={[side * inner, y, segment.z]} rotation-y={-side * Math.PI / 2}>
    <mesh position={[0, -0.14, 0.25]}><boxGeometry args={[1.55, 0.14, 0.7]} />
      <meshStandardMaterial color="#946047" roughness={1} /></mesh>
    {[-0.62, -0.31, 0, 0.31, 0.62].map((x, index) => <mesh key={x}
      position={[x, 0.24, 0.56]} rotation-z={index % 2 ? 0.52 : -0.52}>
      <boxGeometry args={[0.055, 0.74, 0.055]} />
      <meshStandardMaterial color="#302b42" roughness={0.92} /></mesh>)}
    <mesh position={[0, 0.6, 0.56]}><boxGeometry args={[1.5, 0.07, 0.07]} />
      <meshStandardMaterial color="#302b42" roughness={0.92} /></mesh>
  </group>
}

export default function StreetDetails({ active }) {
  const cloths = useRef()
  const reduced = useReducedMotion()
  useFrame(({ clock }) => {
    if (!active || reduced) return
    cloths.current?.children.forEach((cloth, index) => {
      cloth.rotation.z = Math.sin(clock.elapsedTime * 0.55 + index * 1.8) * 0.035
    })
  })

  return <group>
    {[-1, 1].flatMap((side) => [1, 3, 5].map((index) => <BlueDoor
      key={`${side}-${index}`} side={side} segment={GALI_SEGMENTS[index]} ochre={index === 3} />))}
    <JaliBalcony side={-1} segment={GALI_SEGMENTS[0]} y={1.02} />
    <JaliBalcony side={1} segment={GALI_SEGMENTS[2]} y={1.16} />
    <JaliBalcony side={-1} segment={GALI_SEGMENTS[4]} y={1.26} />
    <GaliThresholds />
    <KashiMural side={-1} segment={GALI_SEGMENTS[2]} y={0.05} />
    <KashiMural side={1} segment={GALI_SEGMENTS[4]} y={0.12} mirrored />
    {WIRES.map((points, index) => <Line key={index} points={points}
      color={index === 1 ? '#584358' : '#2e293d'} lineWidth={1.15} />)}
    <group ref={cloths} position={[0, 1.86, -3.05]}>
      {[[-1.2, '#cc4f68'], [0.95, '#df9f35']].map(([x, color]) => <mesh key={x} position={[x, 0, 0]}>
        <boxGeometry args={[0.65, 0.62, 0.025]} /><meshStandardMaterial color={color} roughness={1} />
      </mesh>)}
    </group>
  </group>
}
