import { lazy, Suspense } from 'react'
import AppHeader from '../components/chrome/AppHeader'
import ForegroundFrame from '../components/chrome/ForegroundFrame'
import ProgressRail from '../components/chrome/ProgressRail'
import StagePostcard from '../components/chrome/StagePostcard'
import OracleGuide from '../components/oracle/OracleGuide'
import SceneBoundary from '../components/three/SceneBoundary'
import { useFortuneStore } from '../store/useFortuneStore'
import { createStageVariants } from '../utils/variantMachine'
import StageRouter from './StageRouter'

const WorldCanvas = lazy(() => import('../components/three/WorldCanvas'))

export default function App() {
  const stage = useFortuneStore((state) => state.stage)
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)
  const variants = createStageVariants({ seed, resetRevision: revision, stage })
  const style = { '--run-paper-tilt': `${(variants.tilt.paper * .16).toFixed(2)}deg` }

  return (
    <main className={`experience experience--${stage}`} style={style}>
      <a className="skip-link" href="#stage-content">Skip to the oracle</a>
      <div className="paper-grain" aria-hidden="true" />
      <SceneBoundary>
        <Suspense fallback={<div className="scene-fallback" aria-hidden="true"><i /><i /><i /></div>}>
          <WorldCanvas stage={stage} />
        </Suspense>
      </SceneBoundary>
      <ForegroundFrame stage={stage} />
      <StagePostcard stage={stage} />
      <AppHeader stage={stage} />
      <ProgressRail stage={stage} />
      <OracleGuide key={stage} stage={stage} />
      <div className="stage-layer" id="stage-content" tabIndex="-1">
        <StageRouter stage={stage} />
      </div>
    </main>
  )
}
