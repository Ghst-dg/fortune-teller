import { Instance, Instances } from '@react-three/drei'
import StreetDetails from './StreetDetails'
import { GALI_SEGMENTS, innerEdge } from './galiLayout'

const OUTER = Array.from({ length: 29 }, (_, index) => ({
  x: -25.2 + index * 1.8,
  height: 3.7 + ((index * 7) % 4) * 0.42,
  color: ['#875066', '#b65d43', '#54757b', '#bd8548'][index % 4],
}))
const RIGHT_COLORS = ['#ca7448', '#4d767b', '#9f5365', '#d09a4c', '#6b536f']

function GaliBlock({ side, segment }) {
  const inner = innerEdge(segment)
  const stagger = side > 0 ? (segment.index % 2) * 0.16 : -(segment.index % 3) * 0.06
  const height = segment.height + (side > 0 ? (segment.index % 3 - 1) * 0.24 : 0)
  const color = side > 0 ? RIGHT_COLORS[(segment.index * 2) % RIGHT_COLORS.length] : segment.color
  return <group rotation-y={side * segment.tilt}>
    <mesh position={[side * segment.x, -1.42 + height / 2, segment.z + stagger]}>
      <boxGeometry args={[segment.width, height, segment.depth + Math.abs(stagger)]} />
      <meshStandardMaterial color={color} roughness={1} />
    </mesh>
    <mesh position={[side * inner, 0.52 + (segment.index % 2) * 0.28, segment.z - 0.18]}
      rotation-y={-side * Math.PI / 2}>
      <boxGeometry args={[0.54, 0.72, 0.055]} />
      <meshStandardMaterial color="#28243b" roughness={0.96} />
    </mesh>
    <mesh position={[side * (inner - 0.02), 1.2, segment.z + 0.35]}
      rotation-y={-side * Math.PI / 2}>
      <boxGeometry args={[0.72, 0.08, 0.08]} />
      <meshStandardMaterial color="#d49a38" roughness={0.8} />
    </mesh>
  </group>
}

export default function StreetWorld({ active = true }) {
  return <group>
    <mesh position={[0, 0.25, -9.15]}><boxGeometry args={[54, 5.8, 0.85]} />
      <meshStandardMaterial color="#4b4050" roughness={1} /></mesh>
    <Instances limit={OUTER.length}>
      <boxGeometry /><meshStandardMaterial roughness={1} />
      {OUTER.map((building) => <Instance key={building.x} color={building.color}
        position={[building.x, -1.42 + building.height / 2, -7.95]}
        scale={[1.7, building.height, 1.4]} />)}
    </Instances>
    {[-1, 1].flatMap((side) => GALI_SEGMENTS.map((segment) =>
      <GaliBlock key={`${side}-${segment.index}`} side={side} segment={segment} />))}
    <StreetDetails active={active} />
    <mesh position={[0, -1.42, -2.35]} rotation-x={-Math.PI / 2}>
      <planeGeometry args={[56, 18]} /><meshStandardMaterial color="#785e52" roughness={1} />
    </mesh>
    {Array.from({ length: 13 }, (_, index) => <mesh key={index}
      position={[(index % 3 - 1) * 0.06, -1.405, 1.05 - index * 0.74]}
      rotation={[-Math.PI / 2, 0, ((index * 7) % 5 - 2) * 0.012]}>
      <planeGeometry args={[4.85 - index * 0.19, 0.68]} />
      <meshStandardMaterial color={index % 2 ? '#a57a5b' : '#bd8c61'} roughness={1} />
    </mesh>)}
    <mesh position={[0, -0.46, -8.66]}><boxGeometry args={[2.7, 1.92, 0.18]} />
      <meshStandardMaterial color="#2d7890" roughness={0.96} /></mesh>
    <mesh position={[0, 0.74, -8.7]}><boxGeometry args={[3.15, 0.16, 0.25]} />
      <meshStandardMaterial color="#d29b3d" roughness={0.9} /></mesh>
  </group>
}
