import GhatWorld from './GhatWorld'
import MarketWorld from './MarketWorld'
import StreetWorld from './StreetWorld'
import JourneyConnector from './JourneyConnector'
import { ZONE_Y } from '../../constants/experience'

export default function VerticalWorld({ stage }) {
  const marketActive = stage === 'welcome' || stage === 'identity'
  const streetActive = stage === 'palm' || stage === 'scanning'

  return <group>
    <group position={[0, ZONE_Y.market, 0]}><MarketWorld active={marketActive} /></group>
    <JourneyConnector y={-4} variant="marketStreet" />
    <group position={[0, ZONE_Y.street, 0]}><StreetWorld active={streetActive} /></group>
    <JourneyConnector y={-12} variant="streetGhat" />
    <group position={[0, ZONE_Y.ghat, 0]}><GhatWorld stage={stage} /></group>
  </group>
}
