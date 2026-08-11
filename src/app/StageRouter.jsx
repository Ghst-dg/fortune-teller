import CameraStage from '../components/stages/CameraStage'
import FortuneStage from '../components/stages/FortuneStage'
import IntroStage from '../components/stages/IntroStage'
import ProfileStage from '../components/stages/ProfileStage'
import ScanStage from '../components/stages/ScanStage'
import TarotStage from '../components/stages/TarotStage'

const STAGE_COMPONENTS = {
  welcome: IntroStage,
  identity: ProfileStage,
  palm: CameraStage,
  scanning: ScanStage,
  tarot: TarotStage,
  result: FortuneStage,
}

export default function StageRouter({ stage }) {
  const ActiveStage = STAGE_COMPONENTS[stage] ?? IntroStage
  return <ActiveStage key={stage} />
}
