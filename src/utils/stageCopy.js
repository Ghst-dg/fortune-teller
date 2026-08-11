import { useMemo } from 'react'
import stageCopy from '../data/stageCopy.json'
import { useFortuneStore } from '../store/useFortuneStore'
import { createStageVariants } from './variantMachine'

export function useStableStageCopy(stage) {
  const seed = useFortuneStore((state) => state.seed)
  const revision = useFortuneStore((state) => state.resetRevision)

  return useMemo(() => {
    const options = stageCopy[stage] ?? []
    return options[createStageVariants({
      seed,
      resetRevision: revision,
      stage,
      dialogueCount: options.length,
    }).dialogueIndex]
  }, [revision, seed, stage])
}
