import { RoundedBox, Sparkles } from '@react-three/drei'

const SLATS = [-1.24, -.82, -.4, .02, .44, .86, 1.28]
const JALI = [-.62, 0, .62]
const CROSSINGS = JALI.flatMap((x) => JALI.map((y) => [x, y]))

export default function StreetTravelProp() {
  return (
    <group rotation-z={.08}>
      <RoundedBox args={[2.35, 3.45, .2]} radius={.09} smoothness={3}>
        <meshStandardMaterial color="#176b78" roughness={.82} />
      </RoundedBox>
      <mesh position={[0, 0, .12]}>
        <planeGeometry args={[1.88, 2.92]} />
        <meshStandardMaterial color="#27566c" roughness={.9} />
      </mesh>
      {SLATS.map((y) => <mesh key={y} position={[0, y, .145]}>
        <boxGeometry args={[1.9, .075, .055]} />
        <meshStandardMaterial color="#78c9c3" roughness={.72} />
      </mesh>)}
      {CROSSINGS.map(([x, y]) => <group key={`${x}-${y}`} position={[x, y, .19]}>
        <mesh rotation-z={Math.PI / 4}><boxGeometry args={[.3, .045, .04]} />
          <meshStandardMaterial color="#efc45d" metalness={.32} roughness={.42} /></mesh>
        <mesh rotation-z={-Math.PI / 4}><boxGeometry args={[.3, .045, .04]} />
          <meshStandardMaterial color="#efc45d" metalness={.32} roughness={.42} /></mesh>
      </group>)}
      <mesh position={[.72, -.25, .23]}>
        <torusGeometry args={[.18, .035, 8, 24]} />
        <meshStandardMaterial color="#d99e3e" metalness={.62} roughness={.3} />
      </mesh>
      <Sparkles count={18} scale={[3.2, 4.1, 1]} size={1.6} speed={.08}
        color="#ffe1a0" opacity={.48} />
      <pointLight position={[-1.5, 1.4, .8]} intensity={3.2} distance={4} color="#ffcf72" />
    </group>
  )
}
