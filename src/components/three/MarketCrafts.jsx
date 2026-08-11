import { Instance, Instances, Line } from '@react-three/drei'
import KashiMarketCues from './KashiMarketCues'

const BROCADE = ['#7c255e', '#1b777e', '#d05742', '#4b3a86']
const BEADS = Array.from({ length: 28 }, (_, index) => ({
  x: -0.42 + (index % 4) * 0.28,
  y: 0.92 - Math.floor(index / 4) * 0.13,
  color: ['#eaae2d', '#2d9e91', '#e85275', '#75428b'][index % 4],
}))

function BrocadeRolls({ position }) {
  return <group position={position}>
    {BROCadeRows()}
    <mesh position={[0, -0.05, 0]}><boxGeometry args={[1.55, 0.1, 0.62]} />
      <meshStandardMaterial color="#4f2e27" roughness={1} /></mesh>
  </group>
}

function BROCadeRows() {
  return BROCADE.map((color, index) => <group key={color}
    position={[-0.52 + (index % 2) * 0.7, 0.17 + Math.floor(index / 2) * 0.27, 0]}>
    <mesh rotation-z={Math.PI / 2}><cylinderGeometry args={[0.13, 0.13, 0.62, 14]} />
      <meshStandardMaterial color={color} roughness={0.78} /></mesh>
    {[-0.19, 0.19].map((x) => <mesh key={x} position={[x, 0, 0.13]}>
      <boxGeometry args={[0.045, 0.27, 0.025]} />
      <meshStandardMaterial color="#f2bf42" metalness={0.25} roughness={0.52} />
    </mesh>)}
  </group>)
}

function BrassWall({ position }) {
  return <group position={position}>
    {[[-0.43, 0.43], [0, 0.63], [0.43, 0.39]].map(([x, y], index) => <mesh key={x}
      position={[x, y, 0]} rotation-x={Math.PI / 2}>
      <cylinderGeometry args={[0.2 + index * 0.035, 0.2 + index * 0.035, 0.045, 22]} />
      <meshStandardMaterial color={index === 1 ? '#e9bd50' : '#ca8b2c'}
        metalness={0.58} roughness={0.34} />
    </mesh>)}
    {[-0.48, 0.48].map((x) => <mesh key={x} position={[x, 0.08, 0]}>
      <cylinderGeometry args={[0.14, 0.2, 0.34, 14]} />
      <meshStandardMaterial color="#d9a13b" metalness={0.48} roughness={0.4} />
    </mesh>)}
  </group>
}

function LacquerToys({ position }) {
  return <group position={position}>
    <mesh><boxGeometry args={[1.38, 0.09, 0.45]} />
      <meshStandardMaterial color="#55312a" roughness={1} /></mesh>
    {[-0.45, 0, 0.45].map((x, index) => <group key={x} position={[x, 0.22, 0]}>
      <mesh rotation-z={index % 2 ? 0.2 : -0.2} scale={[0.2, 0.13, 0.11]}>
        <sphereGeometry args={[1, 10, 7]} />
        <meshStandardMaterial color={['#e5533d', '#2f9488', '#e8a42e'][index]} roughness={0.76} />
      </mesh>
      <mesh position={[0.19, 0.05, 0]} rotation-z={-Math.PI / 2}>
        <coneGeometry args={[0.08, 0.18, 5]} /><meshStandardMaterial color="#f2bd35" />
      </mesh>
      <mesh position={[-0.14, 0.14, 0]}><sphereGeometry args={[0.09, 8, 6]} />
        <meshStandardMaterial color="#744686" /></mesh>
    </group>)}
  </group>
}

function BeadCurtain({ position }) {
  return <group position={position}>
    {[0, 1, 2, 3].map((line) => <Line key={line}
      points={[[-0.42 + line * 0.28, 1.02, 0], [-0.42 + line * 0.28, 0.02, 0]]}
      color="#d8a537" lineWidth={0.8} />)}
    <Instances limit={BEADS.length}><sphereGeometry args={[0.045, 7, 5]} />
      <meshStandardMaterial roughness={0.7} />
      {BEADS.map((bead, index) => <Instance key={index} color={bead.color}
        position={[bead.x, bead.y, 0]} scale={1 + (index % 3) * 0.12} />)}
    </Instances>
  </group>
}

function Trinkets({ position }) {
  return <group position={position}>
    {[-0.46, -0.15, 0.17, 0.48].map((x, index) => <group key={x} position={[x, 0, 0]}>
      <mesh><cylinderGeometry args={[0.13, 0.15, 0.16, 10]} />
        <meshStandardMaterial color={['#195f78', '#a63966', '#32836e', '#bd583e'][index]}
          metalness={0.12} roughness={0.55} /></mesh>
      <mesh position={[0, 0.1, 0]}><torusGeometry args={[0.1, 0.018, 5, 12]} />
        <meshStandardMaterial color="#e8b840" metalness={0.45} /></mesh>
    </group>)}
  </group>
}

export default function MarketCrafts() {
  return <group>
    <BrocadeRolls position={[-3.75, -0.94, -1.48]} />
    <BrassWall position={[3.65, -0.82, -1.43]} />
    <LacquerToys position={[-8.6, -0.88, -1.43]} />
    <BeadCurtain position={[8.8, -0.6, -1.38]} />
    <Trinkets position={[5.55, -0.9, -1.26]} />
    <Trinkets position={[-5.7, -0.9, -1.3]} />
    <KashiMarketCues />
  </group>
}
