import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { BufferGeometry, DoubleSide, Float32BufferAttribute, Vector3 } from 'three'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { sampleWaterWave } from './waterWave'

const SECTIONS = [
  [-1.35, 0.02, -0.04], [-0.78, 0.29, -0.22], [0, 0.38, -0.32],
  [0.78, 0.29, -0.22], [1.35, 0.02, -0.04],
]

function createHull() {
  const vertices = []
  SECTIONS.forEach(([x, width, keel]) => vertices.push(x, 0.1, -width, x, 0.1, width, x, keel, 0))
  const indices = []
  for (let index = 0; index < SECTIONS.length - 1; index += 1) {
    const a = index * 3
    const b = (index + 1) * 3
    indices.push(a, a + 2, b + 2, a, b + 2, b)
    indices.push(a + 1, b + 2, a + 2, a + 1, b + 1, b + 2)
  }
  indices.push(0, 1, 2, 12, 14, 13)
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new Float32BufferAttribute(vertices, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

export default function RiverBoat({
  position, color = '#7d3d28', speed = 0.06, reverse = false,
  scale = 1, travel = [-5, 5], active = true,
}) {
  const boat = useRef()
  const reduced = useReducedMotion()
  const hull = useMemo(() => createHull(), [])
  const wave = useMemo(() => new Vector3(), [])
  const lane = useMemo(() => {
    const middle = (travel[0] + travel[1]) / 2
    const radius = (travel[1] - travel[0]) / 2
    const normalized = Math.max(-1, Math.min(1, (position[0] - middle) / radius))
    return { middle, radius, phase: Math.asin(normalized) }
  }, [position, travel])
  const portRail = SECTIONS.map(([x, width]) => [x, 0.12, -width])
  const starboardRail = SECTIONS.map(([x, width]) => [x, 0.12, width])

  useEffect(() => () => hull.dispose(), [hull])
  useFrame(({ clock }) => {
    if (!boat.current || !active || reduced) return
    const direction = reverse ? -1 : 1
    boat.current.position.x = lane.middle + Math.sin(
      lane.phase + clock.elapsedTime * speed * direction,
    ) * lane.radius
    sampleWaterWave(boat.current.position.x, position[2], clock.elapsedTime, wave)
    boat.current.position.y = position[1] + wave.x * 0.65
    boat.current.rotation.x = wave.y * 0.55
    boat.current.rotation.z = wave.z * 0.55
  })

  return (
    <group ref={boat} position={position} rotation-y={reverse ? Math.PI : 0} scale={scale}>
      <mesh geometry={hull}><meshStandardMaterial color={color} side={DoubleSide} roughness={0.88} /></mesh>
      <Line points={portRail} color="#e4a34c" lineWidth={2.2} />
      <Line points={starboardRail} color="#e4a34c" lineWidth={2.2} />
      {[-0.55, 0, 0.55].map((x) => <mesh key={x} position={[x, 0.16, 0]}>
        <boxGeometry args={[0.11, 0.055, 0.58]} /><meshStandardMaterial color="#c98545" roughness={0.9} />
      </mesh>)}
      <mesh position={[-0.15, 0.28, 0.42]} rotation={[0.12, 0.08, -0.52]}>
        <boxGeometry args={[1.45, 0.045, 0.075]} /><meshStandardMaterial color="#503025" />
      </mesh>
    </group>
  )
}
