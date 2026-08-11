import MarigoldRain from './MarigoldRain'
import SkyDetails from './SkyDetails'
import { ZONE_Y } from '../../constants/experience'

export default function StageScenery({ stage }) {
  if (stage === 'welcome' || stage === 'identity') {
    return <group position={[0, ZONE_Y.market, 0]}><SkyDetails /></group>
  }
  if (stage === 'result') {
    return <group position={[0, ZONE_Y.ghat, 0]}><MarigoldRain /></group>
  }
  return null
}
