const BLOOMS = [
  [-0.3, 0.2], [-0.12, 0.27], [0.08, 0.23], [0.29, 0.2],
  [-0.2, 0.36], [0.02, 0.38], [0.21, 0.34],
]

function FlowerBasket({ position }) {
  return <group position={position}>
    <mesh><cylinderGeometry args={[0.42, 0.32, 0.22, 12]} />
      <meshStandardMaterial color="#82482c" roughness={1} /></mesh>
    {BLOOMS.map(([x, y], index) => <mesh key={`${x}-${y}`} position={[x, y, index % 2 * 0.05]}>
      <sphereGeometry args={[0.12, 7, 5]} />
      <meshStandardMaterial color={index % 3 ? '#ffb32e' : '#ef5838'} roughness={0.94} />
    </mesh>)}
  </group>
}

function KulhadKachori({ position }) {
  return <group position={position}>
    <mesh position={[0, -0.04, 0]}><boxGeometry args={[1.25, 0.1, 0.48]} />
      <meshStandardMaterial color="#5f3527" roughness={1} /></mesh>
    {[-0.43, -0.16].map((x) => <mesh key={x} position={[x, 0.13, 0]}>
      <cylinderGeometry args={[0.1, 0.135, 0.28, 10]} />
      <meshStandardMaterial color="#b86742" roughness={1} />
    </mesh>)}
    {[0.12, 0.37, 0.54].map((x, index) => <mesh key={x} position={[x, 0.09, index % 2 * 0.04]}>
      <sphereGeometry args={[0.15, 10, 7]} /><meshStandardMaterial color="#d98b2f" roughness={0.9} />
    </mesh>)}
    <mesh position={[0.43, 0.24, -0.08]} rotation={[1.5, 0, -0.38]} scale={[0.15, 0.29, 0.05]}>
      <sphereGeometry args={[1, 10, 7]} /><meshStandardMaterial color="#2f8a52" roughness={1} />
    </mesh>
  </group>
}

function RickshawCue({ position, mirror = false }) {
  return <group position={position} rotation-y={mirror ? Math.PI : 0} scale={0.7}>
    {[-0.68, 0.68].map((x) => <group key={x} position={[x, 0, 0]}>
      <mesh><torusGeometry args={[0.52, 0.055, 8, 24]} />
        <meshStandardMaterial color="#262136" roughness={0.9} /></mesh>
      {Array.from({ length: 6 }, (_, index) => <mesh key={index} rotation-z={index * Math.PI / 3}>
        <boxGeometry args={[0.94, 0.025, 0.025]} /><meshStandardMaterial color="#57465d" />
      </mesh>)}
    </group>)}
    <mesh position={[0, 0.42, 0]}><boxGeometry args={[1.1, 0.18, 0.58]} />
      <meshStandardMaterial color="#dfa139" roughness={0.9} /></mesh>
    <mesh position={[0.05, 1.04, 0]}><boxGeometry args={[1.42, 0.12, 0.82]} />
      <meshStandardMaterial color="#ed4f7b" roughness={0.92} /></mesh>
  </group>
}

export default function MarketDetails() {
  return <group>
    {[-11.2, -6.25, 6.25, 11.25].map((x, index) => <group key={x}
      position={[x, -0.94, -1.42]} rotation-y={(index % 2 ? -1 : 1) * 0.08}>
      <mesh position={[0, -0.28, 0]}><boxGeometry args={[1.34, 0.46, 0.7]} />
        <meshStandardMaterial color={index % 2 ? '#72412d' : '#945538'} roughness={1} /></mesh>
      <FlowerBasket position={[-0.34, 0, 0.03]} /><KulhadKachori position={[0.42, 0.02, 0]} />
    </group>)}
    <KulhadKachori position={[-1.35, -0.92, -1.04]} />
    <KulhadKachori position={[1.52, -0.92, -1.08]} />
    <RickshawCue position={[-9.55, -1.04, -2.4]} />
    <RickshawCue position={[9.8, -1.04, -2.45]} mirror />
  </group>
}
