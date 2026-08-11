import { Instance, Instances } from '@react-three/drei'

const EDGES = [-26, -20.2, -15.1, -10.1, -5.5, -1.6, 2.8, 7.6, 12.4, 18.1, 26]
const STONE = ['#b66f48', '#c78350', '#d29a61', '#a96143', '#d3a46d']
const STEPS = Array.from({ length: 14 }, (_, tier) => EDGES.slice(0, -1).map((edge, section) => ({
  x: (edge + EDGES[section + 1]) / 2,
  width: EDGES[section + 1] - edge + 0.03,
  y: -0.34 - tier * 0.084,
  z: -3.82 + tier * 0.225,
  color: STONE[(section * 2 + tier) % STONE.length],
}))).flat()

const AXES = [-15.1, -5.5, 2.8, 12.4]

export default function ContinuousGhats() {
  return <group>
    <Instances limit={STEPS.length}>
      <boxGeometry />
      <meshStandardMaterial roughness={1} />
      {STEPS.map((step, index) => <Instance key={index} color={step.color}
        position={[step.x, step.y, step.z]} scale={[step.width, 0.11, 0.34]} />)}
    </Instances>
    {AXES.map((x, index) => <mesh key={x}
      position={[x, -0.84, -2.36]} rotation-x={-0.36}>
      <boxGeometry args={[0.2, 0.18, 3.15]} />
      <meshStandardMaterial color={index % 2 ? '#7e4d3c' : '#976043'} roughness={1} />
    </mesh>)}
    {[-11.8, -0.2, 10.5].map((x, index) => <mesh key={x}
      position={[x, -1.18, -1.12]}>
      <boxGeometry args={[index === 1 ? 3.4 : 4.5, 0.22, 0.82]} />
      <meshStandardMaterial color={index === 1 ? '#b8734a' : '#c58a58'} roughness={1} />
    </mesh>)}
  </group>
}
