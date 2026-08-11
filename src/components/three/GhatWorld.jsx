import ContinuousGhats from './ContinuousGhats'
import GhatBackdrop from './GhatBackdrop'
import GhatDetails from './GhatDetails'
import RiverBoat from './RiverBoat'
import WaterDiya from './WaterDiya'
import WaterSurface from './WaterSurface'

const RIVER_COLORS = {
  welcome: '#2b7280', identity: '#326d79', palm: '#194c67',
  scanning: '#252f67', tarot: '#231f58', result: '#3a7e86',
}

const SUN_COLORS = { scanning: '#9e8de1', tarot: '#b7a3f2' }

const DIYAS = [
  { position: [-2.7, -1.455, 0.92], flameScale: 0.9 },
  { position: [-0.4, -1.46, 0.62], flameScale: 1.05 },
  { position: [1.75, -1.455, 0.38], flameScale: 0.84 },
  { position: [3.85, -1.46, 0.12], flameScale: 1 },
]

export default function GhatWorld({ stage }) {
  const active = stage === 'tarot' || stage === 'result'

  return (
    <group>
      <GhatBackdrop />
      <ContinuousGhats />
      <GhatDetails />
      <WaterSurface color={RIVER_COLORS[stage]} />
      <mesh position={[-3.5, 2.15, -6]}>
        <circleGeometry args={[1.15, 32]} />
        <meshBasicMaterial color={SUN_COLORS[stage] ?? '#ffd65a'} toneMapped={false} />
      </mesh>
      <RiverBoat active={active} position={[2.9, -1.46, -2.25]} scale={0.7}
        travel={[1.7, 5.3]} speed={0.045} />
      <RiverBoat active={active} position={[-3.4, -1.47, -3.15]} scale={0.42}
        travel={[-5.3, -1.8]} speed={0.032} reverse color="#4f6f72" />
      {DIYAS.map((diya) => (
        <WaterDiya key={diya.position[0]} active={active} {...diya} />
      ))}
    </group>
  )
}
