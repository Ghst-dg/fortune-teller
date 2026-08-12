import { Canvas } from '@react-three/fiber'
import TransitionScene from './TransitionScene'

export default function TransitionCanvas({ zone, accent, mode, duration }) {
  return (
    <Canvas
      className="stage-transition__canvas"
      camera={{ position: [0, 0, 7], fov: 46, near: .1, far: 30 }}
      dpr={[1, 1.35]}
      frameloop="always"
      gl={{ alpha: false, antialias: false, powerPreference: 'high-performance' }}
    >
      <TransitionScene zone={zone} accent={accent} mode={mode} duration={duration} />
    </Canvas>
  )
}
