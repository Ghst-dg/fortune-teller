function ArchWindow({ x, y, z, scale = 1 }) {
  return <group position={[x, y, z]} scale={scale}>
    <mesh position={[0, -0.105, 0]}>
      <planeGeometry args={[0.28, 0.28]} />
      <meshStandardMaterial color="#29243a" roughness={1} />
    </mesh>
    <mesh position={[0, 0.035, 0]}>
      <circleGeometry args={[0.14, 10, 0, Math.PI]} />
      <meshStandardMaterial color="#29243a" roughness={1} />
    </mesh>
    <mesh position={[0, -0.14, 0.012]}>
      <boxGeometry args={[0.33, 0.045, 0.035]} />
      <meshStandardMaterial color="#e1b46d" roughness={0.95} />
    </mesh>
  </group>
}

function Balcony({ y, z, width, trim }) {
  return <group position={[0, y, z]}>
    <mesh><boxGeometry args={[width * 0.72, 0.1, 0.35]} />
      <meshStandardMaterial color={trim} roughness={1} /></mesh>
    <mesh position={[0, 0.23, 0.15]}>
      <boxGeometry args={[width * 0.7, 0.42, 0.055]} />
      <meshStandardMaterial color="#593c36" roughness={1} /></mesh>
    {[-0.27, 0, 0.27].map((offset) => <mesh key={offset}
      position={[offset * width, 0.23, 0.19]}>
      <boxGeometry args={[0.055, 0.45, 0.055]} />
      <meshStandardMaterial color={trim} roughness={1} /></mesh>)}
  </group>
}

function RoofPavilion({ y, width, trim }) {
  return <group position={[0, y, 0]}>
    <mesh position={[0, 0.32, 0]}>
      <boxGeometry args={[width * 0.62, 0.62, 0.52]} />
      <meshStandardMaterial color="#805044" roughness={1} /></mesh>
    {[-0.22, 0.22].map((x) => <ArchWindow key={x} x={x * width}
      y={0.34} z={0.271} scale={0.72} />)}
    <mesh position={[0, 0.69, 0]}>
      <cylinderGeometry args={[width * 0.38, width * 0.45, 0.16, 8]} />
      <meshStandardMaterial color={trim} roughness={0.96} /></mesh>
  </group>
}

export default function GhatHaveli({
  x, z, width, height, color, trim, balcony, pavilion,
}) {
  const base = -1.35
  const front = 0.51
  const levels = height > 4 ? [0.88, 1.58, 2.28] : [0.88, 1.62]
  const columns = width > 2.45 ? [-0.33, 0, 0.33] : [-0.29, 0.29]
  return <group position={[x, 0, z]}>
    <mesh position={[0, base + height / 2, 0]}>
      <boxGeometry args={[width, height, 1]} />
      <meshStandardMaterial color={color} roughness={1} /></mesh>
    <mesh position={[-width * 0.39, base + height / 2, front]}>
      <boxGeometry args={[0.1, height * 0.94, 0.08]} />
      <meshStandardMaterial color={trim} roughness={1} /></mesh>
    <mesh position={[width * 0.39, base + height / 2, front]}>
      <boxGeometry args={[0.1, height * 0.94, 0.08]} />
      <meshStandardMaterial color={trim} roughness={1} /></mesh>
    {levels.flatMap((level) => columns.map((offset) => <ArchWindow
      key={`${level}-${offset}`} x={offset * width} y={base + level} z={front + 0.045}
      scale={level > 2 ? 0.86 : 1} />))}
    {levels.slice(0, -1).map((level) => <mesh key={level}
      position={[0, base + level + 0.34, front]}>
      <boxGeometry args={[width * 0.93, 0.075, 0.1]} />
      <meshStandardMaterial color={trim} roughness={1} /></mesh>)}
    {balcony && <Balcony y={base + height * 0.67} z={front + 0.18}
      width={width} trim={trim} />}
    <mesh position={[0, base + height + 0.1, 0]}>
      <boxGeometry args={[width * 1.06, 0.2, 1.08]} />
      <meshStandardMaterial color={trim} roughness={1} /></mesh>
    {pavilion && <RoofPavilion y={base + height + 0.14} width={width} trim={trim} />}
  </group>
}
