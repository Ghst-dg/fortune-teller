import { createStageVariants } from './variantMachine'

const STAGES = ['welcome', 'identity', 'palm', 'scanning', 'tarot', 'result']
const ZONES = {
  welcome: 'market', identity: 'market', palm: 'gali',
  scanning: 'gali', tarot: 'ghat', result: 'ghat',
}
const POOLS = {
  market: Array.from({ length: 9 }, (_, index) => `/art/kashi/market-${String(index + 1).padStart(2, '0')}.webp`),
  gali: Array.from({ length: 9 }, (_, index) => `/art/kashi/gali-${String(index + 1).padStart(2, '0')}.webp`),
  ghat: Array.from({ length: 8 }, (_, index) => `/art/kashi/ghat-${String(index + 1).padStart(2, '0')}.webp`),
}
const ACCENT_COLORS = {
  brocade: '#9d3e75', ganga: 'var(--aqua)', gulabi: 'var(--pink)',
  marigold: 'var(--sun)', ink: 'var(--ink)',
}

function pairedPool(stage, seed, revision) {
  const zone = ZONES[stage]
  const pool = POOLS[zone]
  const order = createStageVariants({
    seed,
    resetRevision: revision,
    stage: `${zone}-collage-pair`,
    collagePoolSize: pool.length,
    collageMin: pool.length,
    collageMax: pool.length,
  }).collage.order
  const pair = order.map((index) => pool[index])
  return STAGES.indexOf(stage) % 2 === 0 ? pair.slice(0, 3) : pair.slice(3)
}

export function getStageArt(stage, seed, revision) {
  const pool = pairedPool(stage, seed, revision)
  const stageVariant = createStageVariants({
    seed, resetRevision: revision, stage,
    collagePoolSize: pool.length,
    collageMin: stage === 'result' ? 3 : 1,
    collageMax: 3,
  })

  return stageVariant.collage.order.slice(0, stageVariant.collage.count).map((poolIndex, index) => {
    const src = pool[poolIndex]
    const variant = createStageVariants({ seed, resetRevision: revision, stage: `${stage}-collage-${src}` })
    return {
      src,
      fastener: variant.fastener.type,
      edge: variant.fastener.position.startsWith('top') ? 'top' : 'bottom',
      accent: variant.transitionAccent,
      style: {
        '--collage-tilt': `${variant.tilt.card}deg`,
        '--collage-x': `${(variant.tilt.paper * 1.35).toFixed(2)}px`,
        '--collage-y': `${(variant.tilt.card * .55).toFixed(2)}px`,
        '--collage-scale': `${(1 - (Math.abs(variant.tilt.paper) / 100)).toFixed(3)}`,
        '--collage-delay': `${index * 70}ms`,
        '--fastener-x': `${variant.fastener.xPercent}%`,
        '--fastener-turn': `${variant.fastener.rotation}deg`,
        '--fastener-color': ACCENT_COLORS[variant.transitionAccent],
      },
    }
  })
}
