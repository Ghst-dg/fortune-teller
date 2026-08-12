import { RoundedBox } from '@react-three/drei'

const MARKS = [-2.25, -1.45, -.65, .15]

function Pillar({ x, color, accent }) {
  return (
    <group position-x={x}>
      <RoundedBox args={[.72, 5.4, .2]} radius={.13} smoothness={3}>
        <meshStandardMaterial color={color} roughness={.78} metalness={.04} />
      </RoundedBox>
      {MARKS.map((y, index) => (
        <mesh position={[0, y, .115]} rotation-z={Math.PI / 4} key={y}>
          <planeGeometry args={[index % 2 ? .2 : .14, index % 2 ? .2 : .14]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      ))}
    </group>
  )
}

export default function TransitionGate({ z, scale, color, accent, flip }) {
  return (
    <group position={[0, 0, z]} scale={scale} rotation-z={flip ? -.018 : .018}>
      <Pillar x={-1.84} color={color} accent={accent} />
      <Pillar x={1.84} color={color} accent={accent} />
      <mesh position={[0, 1.35, 0]}>
        <ringGeometry args={[1.48, 2.2, 48, 1, 0, Math.PI]} />
        <meshStandardMaterial color={color} roughness={.72} side={2} />
      </mesh>
      <mesh position={[0, 1.35, .025]}>
        <ringGeometry args={[1.75, 1.86, 48, 1, 0, Math.PI]} />
        <meshBasicMaterial color={accent} side={2} />
      </mesh>
    </group>
  )
}
