const ROSETTES = Array.from({ length: 5 }, (_, index) => index * Math.PI * 0.4)

function JaliPanel({ position, mirror = false }) {
  return <group position={position} rotation-y={mirror ? -0.12 : 0.12}>
    <mesh><boxGeometry args={[1.35, 1.42, 0.1]} />
      <meshStandardMaterial color="#d3a16f" roughness={0.94} /></mesh>
    <mesh position={[0, 0, 0.07]}><boxGeometry args={[1.08, 1.14, 0.08]} />
      <meshStandardMaterial color="#6d3f35" roughness={1} /></mesh>
    {Array.from({ length: 12 }, (_, index) => {
      const x = -0.4 + (index % 4) * 0.27
      const y = -0.38 + Math.floor(index / 4) * 0.38
      return <mesh key={index} position={[x, y, 0.13]}>
        <torusGeometry args={[0.11, 0.035, 5, 8]} />
        <meshStandardMaterial color="#e2bc8d" roughness={0.88} />
      </mesh>
    })}
  </group>
}

function MeenakariTray({ position }) {
  return <group position={position}>
    <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.72, 0.72, 0.06, 20]} />
      <meshStandardMaterial color="#c79b62" metalness={0.48} roughness={0.38} /></mesh>
    {[-0.39, 0, 0.39].map((x, boxIndex) => <group key={x} position={[x, 0.13, 0]}>
      <mesh><cylinderGeometry args={[0.17, 0.19, 0.18, 12]} />
        <meshStandardMaterial color="#f4e1d1" metalness={0.16} roughness={0.3} /></mesh>
      {ROSETTES.map((angle) => <mesh key={angle} position={[
        Math.cos(angle) * 0.09, 0.1, Math.sin(angle) * 0.09,
      ]} scale={[0.055, 0.025, 0.095]} rotation-y={-angle}>
        <sphereGeometry args={[1, 7, 5]} />
        <meshStandardMaterial color={boxIndex === 1 ? '#e85887' : '#f18aa7'} roughness={0.42} />
      </mesh>)}
    </group>)}
  </group>
}

function PaanTray({ position }) {
  return <group position={position} rotation-y={-0.12}>
    <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.72, 0.72, 0.06, 18]} />
      <meshStandardMaterial color="#ce9137" metalness={0.4} roughness={0.4} /></mesh>
    {[-0.46, -0.23, 0, 0.23, 0.46].map((x, index) => <group key={x}
      position={[x, 0.1, -Math.abs(x) * 0.08]} rotation-z={(index - 2) * -0.14}>
      <mesh scale={[0.15, 0.25, 0.035]}><sphereGeometry args={[1, 10, 7]} />
        <meshStandardMaterial color={index % 2 ? '#23804d' : '#3d9c58'} roughness={0.9} /></mesh>
      <mesh position={[0, -0.22, 0]}><coneGeometry args={[0.055, 0.16, 5]} />
        <meshStandardMaterial color="#2b7843" roughness={1} /></mesh>
    </group>)}
    {[-0.62, 0.62].map((x) => <mesh key={x} position={[x, 0.13, 0.13]}>
      <cylinderGeometry args={[0.1, 0.12, 0.2, 9]} />
      <meshStandardMaterial color="#9e3f49" roughness={0.7} /></mesh>)}
  </group>
}

function MalaiyyoCups({ position }) {
  return <group position={position}>
    {[-0.34, 0, 0.34].map((x, index) => <group key={x} position={[x, 0, index % 2 * 0.08]}>
      <mesh><cylinderGeometry args={[0.12, 0.16, 0.25, 10]} />
        <meshStandardMaterial color="#ad5d3d" roughness={1} /></mesh>
      <mesh position={[0, 0.15, 0]} scale={[0.13, 0.1, 0.13]}>
        <sphereGeometry args={[1, 9, 6]} />
        <meshStandardMaterial color="#fff0b7" roughness={0.85} /></mesh>
      <mesh position={[0.02, 0.24, 0]} rotation-z={index ? 0.14 : -0.14}>
        <coneGeometry args={[0.07, 0.14, 8]} />
        <meshStandardMaterial color="#ffe8a0" roughness={0.86} /></mesh>
    </group>)}
  </group>
}

export default function KashiMarketCues() {
  return <group>
    <JaliPanel position={[-11.25, -0.2, -1.72]} />
    <JaliPanel position={[11.3, -0.18, -1.74]} mirror />
    <PaanTray position={[-6.2, -0.82, -1.19]} />
    <MeenakariTray position={[5.85, -0.82, -1.2]} />
    <MalaiyyoCups position={[10.15, -0.82, -1.18]} />
  </group>
}
