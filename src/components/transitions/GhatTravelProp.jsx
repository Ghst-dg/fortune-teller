import { Line, MeshDistortMaterial } from '@react-three/drei'

const RAIL = [[-1.75, -.16, .23], [-.8, .16, .2], [.25, .28, .12], [1.55, .08, 0]]

function CloseDiya({ position, scale }) {
  return <group position={position} scale={scale}>
    <mesh scale={[1, .34, .72]}><sphereGeometry args={[.17, 14, 7]} />
      <meshStandardMaterial color="#a94327" roughness={.84} /></mesh>
    <mesh position={[0, .16, 0]}><coneGeometry args={[.05, .2, 9]} />
      <meshBasicMaterial color="#ffb138" toneMapped={false} /></mesh>
    <pointLight position={[0, .15, .14]} intensity={1.3} distance={1.5} color="#ff9d3c" />
  </group>
}

export default function GhatTravelProp() {
  return (
    <group rotation-z={-.08}>
      <mesh position={[0, -.58, -.08]} rotation-x={-Math.PI / 2.8}>
        <planeGeometry args={[5.6, 1.7, 22, 5]} />
        <MeshDistortMaterial color="#3a8895" transparent opacity={.56}
          distort={.22} speed={1.15} roughness={.2} metalness={.14} side={2} />
      </mesh>
      <mesh position={[0, -.08, .02]} rotation-z={-Math.PI / 2} scale={[1, 1.5, .64]}>
        <coneGeometry args={[.76, 3.75, 4]} />
        <meshStandardMaterial color="#6e3426" roughness={.88} side={2} />
      </mesh>
      <mesh position={[-.18, .18, .18]} rotation-z={-.08}>
        <boxGeometry args={[3.4, .12, .7]} />
        <meshStandardMaterial color="#aa6334" roughness={.8} />
      </mesh>
      <Line points={RAIL} color="#efb348" lineWidth={3} />
      {[-1.05, -.15, .75].map((x) => <mesh key={x} position={[x, .33, .2]} rotation-z={-.08}>
        <boxGeometry args={[.12, .42, .1]} />
        <meshStandardMaterial color="#4a281e" roughness={1} />
      </mesh>)}
      <CloseDiya position={[-1.15, .72, .36]} scale={1.25} />
      <CloseDiya position={[.45, .83, .35]} scale={1.05} />
      <CloseDiya position={[1.45, .56, .32]} scale={.9} />
    </group>
  )
}
