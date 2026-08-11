import { Sparkles } from '@react-three/drei'
import { ZONE_Y } from '../../constants/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const COLORS = {
  welcome: '#fff1a8', identity: '#ffd47a', palm: '#74f0df',
  scanning: '#ee8dff', tarot: '#fff08a', result: '#ffca55',
}

export default function Atmosphere({ stage }) {
  const reduced = useReducedMotion()
  const isNight = stage === 'scanning' || stage === 'tarot'
  const count = reduced ? 12 : isNight ? 34 : 24

  return Object.values(ZONE_Y).map((zoneY) => <Sparkles
    key={zoneY}
    position={[0, zoneY, 0]}
    count={count}
    scale={[12, 5.5, 7]}
    size={isNight ? 2.35 : 1.65}
    speed={reduced ? 0 : isNight ? 0.34 : 0.16}
    color={COLORS[stage]}
    opacity={isNight ? 0.7 : 0.42}
  />)
}
