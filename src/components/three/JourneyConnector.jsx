import { Instance, Instances } from '@react-three/drei'

const COLORS = {
  marketStreet: ['#c46947', '#d99d46', '#4f8f8b'],
  streetGhat: ['#754c43', '#a96748', '#c88651'],
}

const STRIPS = Array.from({ length: 19 }, (_, index) => ({
  x: -13.5 + index * 1.5,
  height: 4.7 + (index % 3) * 0.45,
  z: -4.15 - (index % 2) * 0.2,
}))

export default function JourneyConnector({ y, variant }) {
  const colors = COLORS[variant]

  return (
    <group position={[0, y, 0]}>
      <mesh position={[0, 0, -4.8]}>
        <boxGeometry args={[35, 6.7, 0.9]} />
        <meshStandardMaterial color={colors[0]} roughness={1} />
      </mesh>
      <Instances limit={STRIPS.length}>
        <boxGeometry />
        <meshStandardMaterial roughness={1} />
        {STRIPS.map((strip, index) => <Instance key={strip.x}
          color={colors[index % colors.length]}
          position={[strip.x, 0, strip.z]} scale={[1.42, strip.height, 1.05]} />)}
      </Instances>
      <Instances limit={STRIPS.length * 2}>
        <boxGeometry />
        <meshStandardMaterial color="#292044" roughness={0.95} />
        {STRIPS.flatMap((strip) => [-1.15, 1.15].map((level) => <Instance
          key={`${strip.x}-${level}`} position={[strip.x, level, strip.z + 0.55]}
          scale={[0.42, 0.62, 0.05]} />))}
      </Instances>
      {Array.from({ length: 8 }, (_, index) => <mesh key={index}
        position={[0, 1.7 - index * 0.48, -2 + index * 0.17]}>
        <boxGeometry args={[3.6, 0.14, 0.62]} />
        <meshStandardMaterial color={index % 2 ? colors[1] : colors[2]} roughness={1} />
      </mesh>)}
      {[-1.35, 0, 1.35].map((x, index) => <mesh key={x}
        position={[x, 1.25 - index * 0.42, -0.7]}>
        <octahedronGeometry args={[0.12, 0]} />
        <meshBasicMaterial color={index % 2 ? '#f04f87' : '#ffca58'} toneMapped={false} />
      </mesh>)}
    </group>
  )
}
