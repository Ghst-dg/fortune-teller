import { MeshWobbleMaterial } from '@react-three/drei'

const BUTI = Array.from({ length: 15 }, (_, index) => [
  -1.8 + (index % 5) * .9,
  -.34 + Math.floor(index / 5) * .34,
])

function Marigold({ position, shade }) {
  return (
    <group position={position} rotation={[.25, .3, position[0]]}>
      {[0, 1, 2, 3].map((petal) => (
        <mesh key={petal} rotation-z={petal * Math.PI / 2} position-x={.07}>
          <sphereGeometry args={[.075, 7, 5]} />
          <meshStandardMaterial color={shade} emissive={shade} emissiveIntensity={.18} roughness={.8} />
        </mesh>
      ))}
    </group>
  )
}

export default function MarketTravelProp() {
  return (
    <group rotation-z={-.13}>
      <mesh>
        <planeGeometry args={[4.8, 1.35, 26, 7]} />
        <MeshWobbleMaterial color="#8f2857" factor={.17} speed={1.5}
          roughness={.74} metalness={.08} side={2} />
      </mesh>
      {[-.59, .59].map((y) => <mesh key={y} position={[0, y, .018]}>
        <planeGeometry args={[4.72, .11]} />
        <meshBasicMaterial color="#efbd4d" />
      </mesh>)}
      {BUTI.map(([x, y], index) => <mesh key={`${x}-${y}`} position={[x, y, .024]}
        rotation-z={Math.PI / 4} scale={index % 2 ? 1 : .72}>
        <planeGeometry args={[.16, .16]} />
        <meshBasicMaterial color={index % 3 ? '#eebd54' : '#66d7c8'} />
      </mesh>)}
      <Marigold position={[-1.7, .94, .18]} shade="#ffb000" />
      <Marigold position={[-.7, -.96, .14]} shade="#ff713f" />
      <Marigold position={[1.15, .9, .2]} shade="#ffc33f" />
      <Marigold position={[2, -.75, .12]} shade="#ff743c" />
    </group>
  )
}
