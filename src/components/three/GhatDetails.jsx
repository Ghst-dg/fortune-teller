import { Line } from '@react-three/drei'

function Chhatri({ position, scale = 1, color = '#c47a4c' }) {
  return <group position={position} scale={scale}>
    <mesh><cylinderGeometry args={[0.68, 0.76, 0.18, 8]} />
      <meshStandardMaterial color="#a76645" roughness={1} /></mesh>
    {[-0.43, 0.43].flatMap((x) => [-0.31, 0.31].map((z) => <mesh
      key={`${x}-${z}`} position={[x, 0.68, z]}>
      <cylinderGeometry args={[0.045, 0.055, 1.3, 8]} />
      <meshStandardMaterial color="#6f493d" roughness={1} /></mesh>))}
    <mesh position={[0, 1.35, 0]}>
      <cylinderGeometry args={[0.78, 0.97, 0.2, 8]} />
      <meshStandardMaterial color={color} roughness={1} /></mesh>
    <mesh position={[0, 1.47, 0]} scale={[1, 0.28, 1]}>
      <sphereGeometry args={[0.76, 12, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
      <meshStandardMaterial color={color} roughness={0.98} /></mesh>
    <mesh position={[0, 1.7, 0]}>
      <sphereGeometry args={[0.07, 8, 6]} />
      <meshStandardMaterial color="#d9aa62" metalness={0.12} roughness={0.7} /></mesh>
  </group>
}

function LandingWall({ x, width, color }) {
  return <group position={[x, -0.28, -3.82]}>
    <mesh><boxGeometry args={[width, 0.24, 0.5]} />
      <meshStandardMaterial color={color} roughness={1} /></mesh>
    {[-0.42, 0, 0.42].map((offset) => <mesh key={offset}
      position={[offset * width, 0.35, 0]}>
      <boxGeometry args={[0.19, 0.7, 0.48]} />
      <meshStandardMaterial color="#a86748" roughness={1} /></mesh>)}
  </group>
}

const POLES = [-18, -8.8, 6.5, 16.4]

export default function GhatDetails() {
  return <group>
    <Chhatri position={[-7.2, -0.22, -3.7]} color="#d39a59" />
    <Chhatri position={[7.5, -0.24, -3.72]} color="#ad6245" scale={0.92} />
    <Chhatri position={[-17.1, -0.26, -3.88]} color="#c47a4c" scale={0.72} />
    <Chhatri position={[17.4, -0.25, -3.9]} color="#d2a265" scale={0.74} />
    <LandingWall x={-12.8} width={4.2} color="#be7b50" />
    <LandingWall x={0} width={3.4} color="#d09a64" />
    <LandingWall x={12.7} width={4.4} color="#a96345" />
    {POLES.map((x, index) => <group key={x}>
      <mesh position={[x, -0.8, -0.48]} rotation-z={index % 2 ? -0.035 : 0.04}>
        <cylinderGeometry args={[0.045, 0.06, 1.65, 8]} />
        <meshStandardMaterial color="#4f3a32" roughness={1} /></mesh>
      <Line points={[[x, -0.2, -0.48], [x + (index % 2 ? 1.25 : -1.1), -1.38, 0.28]]}
        color="#594338" lineWidth={1.1} />
    </group>)}
    {[-20.4, 20.2].map((x) => <mesh key={x} position={[x, -0.92, -2.05]}
      rotation-x={-0.38}>
      <boxGeometry args={[3.5, 0.18, 2.7]} />
      <meshStandardMaterial color="#9d6245" roughness={1} /></mesh>)}
  </group>
}
