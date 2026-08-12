import { AdaptiveDpr, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import Atmosphere from './Atmosphere'
import PostEffects from './PostEffects'
import SceneLighting from './SceneLighting'
import SceneRig from './SceneRig'
import StageScenery from './StageScenery'
import { useFortuneStore } from '../../store/useFortuneStore'
import VerticalWorld from './VerticalWorld'

export default function WorldCanvas({ stage }) {
  const [effects, setEffects] = useState(true)
  const tarotPhase = useFortuneStore((state) => state.tarotPhase)
  const resetRevision = useFortuneStore((state) => state.resetRevision)

  return (
    <div className="world-canvas" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.15, 6.4], fov: 43, near: 0.1, far: 40 }}
        dpr={[1, 1.65]}
        gl={{ antialias: false, powerPreference: 'high-performance', alpha: false }}
        eventSource={document.getElementById('root')}
        eventPrefix="client"
      >
        <PerformanceMonitor onDecline={() => setEffects(false)}>
          <AdaptiveDpr />
          <SceneLighting stage={stage} />
          <SceneRig stage={stage} resetRevision={resetRevision}>
            <VerticalWorld stage={stage} />
            <Atmosphere stage={stage} />
            <StageScenery stage={stage} />
          </SceneRig>
          <PostEffects enabled={effects} stage={stage} tarotPhase={tarotPhase} />
        </PerformanceMonitor>
      </Canvas>
    </div>
  )
}
