import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { AdditiveBlending, DoubleSide, Vector3 } from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { sampleWaterWave } from './waterWave'

export default function WaterDiya({ position, active = true, flameScale = 1 }) {
  const diya = useRef()
  const flame = useRef()
  const halo = useRef()
  const reflection = useRef()
  const reflectionMaterial = useRef()
  const reduced = useReducedMotion()
  const wave = useMemo(() => new Vector3(), [])
  const phase = useMemo(() => position[0] * 1.73 + position[2] * 2.19, [position])

  useFrame(({ clock }) => {
    if (!diya.current || !active || reduced) return
    const time = clock.elapsedTime
    const driftX = Math.sin(time * 0.12 + phase) * 0.055
    const driftZ = Math.cos(time * 0.1 + phase) * 0.035
    sampleWaterWave(position[0] + driftX, position[2] + driftZ, time, wave)
    diya.current.position.set(position[0] + driftX, position[1] + wave.x, position[2] + driftZ)
    diya.current.rotation.set(wave.y, Math.sin(time * 0.16 + phase) * 0.07, wave.z)

    const flicker = Math.sin(time * 7.4 + phase) * 0.06 + Math.sin(time * 13.1) * 0.025
    flame.current.scale.set(1 - flicker * 0.35, flameScale * (1 + flicker), 1)
    flame.current.rotation.z = Math.sin(time * 5.2 + phase) * 0.055
    halo.current.scale.setScalar(1 + flicker * 0.8)
    reflection.current.scale.set(1 - flicker * 0.4, 1 + flicker, 1)
    reflectionMaterial.current.opacity = 0.16 + Math.max(0, flicker) * 0.5
  })

  return (
    <group ref={diya} position={position}>
      <group ref={reflection} position={[0, -0.058, 0.08]}>
        <mesh rotation-x={-Math.PI / 2} scale={[0.9, 2.3, 1]}>
          <circleGeometry args={[0.13, 18]} />
          <meshBasicMaterial ref={reflectionMaterial} color="#ff9f32" transparent opacity={0.16}
            blending={AdditiveBlending} depthWrite={false} side={DoubleSide} toneMapped={false} />
        </mesh>
        <mesh rotation-x={-Math.PI / 2} scale={[1.8, 0.42, 1]}>
          <circleGeometry args={[0.11, 18]} />
          <meshBasicMaterial color="#ffd365" transparent opacity={0.1}
            blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
      </group>

      <mesh position={[0, -0.058, 0]} scale={[1, 0.28, 0.72]}>
        <cylinderGeometry args={[0.09, 0.12, 0.045, 16]} />
        <meshStandardMaterial color="#743421" roughness={0.92} />
      </mesh>
      <mesh scale={[1, 0.46, 0.72]}>
        <sphereGeometry args={[0.18, 18, 8, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
        <meshStandardMaterial color="#b84d2e" roughness={0.82} metalness={0.04} />
      </mesh>
      <mesh position={[0.185, -0.004, 0]} rotation-z={-Math.PI / 2} scale={[1, 1, 0.72]}>
        <coneGeometry args={[0.078, 0.18, 3]} />
        <meshStandardMaterial color="#b84d2e" roughness={0.82} />
      </mesh>
      <mesh rotation-x={Math.PI / 2} scale={[1, 1, 0.72]}>
        <torusGeometry args={[0.174, 0.012, 7, 22]} />
        <meshStandardMaterial color="#dca74c" roughness={0.38} metalness={0.58} />
      </mesh>
      <mesh position={[0, 0.006, 0]} rotation-x={-Math.PI / 2} scale={[1, 0.7, 1]}>
        <circleGeometry args={[0.15, 20]} />
        <meshStandardMaterial color="#8b2f17" emissive="#f37a18" emissiveIntensity={0.62}
          roughness={0.28} side={DoubleSide} />
      </mesh>
      <mesh position={[0, 0.055, 0]} rotation-z={-0.12}>
        <cylinderGeometry args={[0.009, 0.012, 0.09, 7]} />
        <meshStandardMaterial color="#2d1710" roughness={1} />
      </mesh>

      <mesh ref={halo} position={[0, 0.16, -0.025]}>
        <circleGeometry args={[0.2, 20]} />
        <meshBasicMaterial color="#ff9b2f" transparent opacity={0.09}
          blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <group ref={flame} position={[0, 0.155, 0]} scale={[1, flameScale, 1]}>
        <mesh><coneGeometry args={[0.054, 0.19, 10]} />
          <meshBasicMaterial color="#ff922f" transparent opacity={0.9}
            blending={AdditiveBlending} depthWrite={false} toneMapped={false} />
        </mesh>
        <mesh position={[0, -0.025, 0.008]} scale={[0.5, 0.58, 0.5]}>
          <coneGeometry args={[0.054, 0.19, 10]} />
          <meshBasicMaterial color="#fff6b0" toneMapped={false} />
        </mesh>
      </group>
    </group>
  )
}
