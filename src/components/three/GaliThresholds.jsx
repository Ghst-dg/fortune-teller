import { GALI_SEGMENTS, innerEdge } from './galiLayout'

function BrocadeBundle() {
  return <group>
    {[-0.25, 0, 0.25].map((x, index) => <mesh key={x} position={[x, 0.09, 0]}
      rotation-z={Math.PI / 2}>
      <cylinderGeometry args={[0.09, 0.09, 0.34, 10]} />
      <meshStandardMaterial color={['#74265e', '#167b7c', '#bd473f'][index]} roughness={0.76} />
    </mesh>)}
    <mesh position={[0, -0.03, 0]}><boxGeometry args={[0.88, 0.09, 0.34]} />
      <meshStandardMaterial color="#5b3529" roughness={1} /></mesh>
  </group>
}

function BrassStack() {
  return <group>
    {[-0.25, 0.1, 0.34].map((x, index) => <mesh key={x} position={[x, 0.12 + index * 0.03, 0]}
      rotation-x={Math.PI / 2}>
      <cylinderGeometry args={[0.14 + index * 0.025, 0.14 + index * 0.025, 0.04, 16]} />
      <meshStandardMaterial color="#d6a039" metalness={0.52} roughness={0.36} />
    </mesh>)}
    <mesh position={[-0.42, 0.09, 0]}><cylinderGeometry args={[0.1, 0.14, 0.22, 12]} />
      <meshStandardMaterial color="#e1ad46" metalness={0.46} roughness={0.4} /></mesh>
  </group>
}

function ToyBirds() {
  return <group>
    {[-0.28, 0.08, 0.38].map((x, index) => <group key={x} position={[x, 0.12, 0]}>
      <mesh scale={[0.15, 0.1, 0.09]}><sphereGeometry args={[1, 9, 6]} />
        <meshStandardMaterial color={['#dc4f3d', '#2e9085', '#d89a2d'][index]} roughness={0.78} /></mesh>
      <mesh position={[0.14, 0.02, 0]} rotation-z={-Math.PI / 2}>
        <coneGeometry args={[0.055, 0.13, 5]} /><meshStandardMaterial color="#f1ba38" />
      </mesh>
    </group>)}
    <mesh position={[0, -0.03, 0]}><boxGeometry args={[0.9, 0.09, 0.32]} />
      <meshStandardMaterial color="#70432e" roughness={1} /></mesh>
  </group>
}

const GOODS = [BrocadeBundle, BrassStack, ToyBirds]

function ThresholdGoods({ side, segment, kind }) {
  const inner = innerEdge(segment)
  const Goods = GOODS[kind]
  return <group position={[side * inner, -1.2, segment.z + 0.2]}
    rotation-y={-side * Math.PI / 2}>
    <mesh position={[0, -0.05, 0]}><boxGeometry args={[1.1, 0.13, 0.64]} />
      <meshStandardMaterial color="#9b694a" roughness={1} /></mesh>
    <group position={[0, 0.12, 0.13]}><Goods /></group>
  </group>
}

export default function GaliThresholds() {
  return <group>
    {[-1, 1].flatMap((side) => [1, 3, 5].map((index, row) => <ThresholdGoods
      key={`${side}-${index}`} side={side} segment={GALI_SEGMENTS[index]}
      kind={(row + (side > 0 ? 1 : 0)) % GOODS.length} />))}
  </group>
}
