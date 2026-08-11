import { makeVariantSignature, stableIndex } from './fortune'

const FASTENERS = ['tape', 'pin']
const POSITIONS = ['top-left', 'top-right', 'bottom-left', 'bottom-right']
const ACCENTS = ['brocade', 'ganga', 'gulabi', 'marigold', 'ink']

function safeCount(value, fallback) {
  return Math.max(0, Math.floor(Number.isFinite(value) ? value : fallback))
}

function orderFor(signature, slot, length) {
  const order = Array.from({ length }, (_, index) => index)
  for (let index = length - 1; index > 0; index -= 1) {
    const swapWith = stableIndex(`${signature}:${slot}:${index}`, index + 1)
    ;[order[index], order[swapWith]] = [order[swapWith], order[index]]
  }
  return order
}

function numberFor(signature, slot, minimum, maximum, precision = 2) {
  const unit = stableIndex(`${signature}:${slot}`, 10_001) / 10_000
  return Number((minimum + ((maximum - minimum) * unit)).toFixed(precision))
}

function fastenerFor(signature) {
  const position = POSITIONS[stableIndex(`${signature}:fastener-position`, POSITIONS.length)]
  const left = position.endsWith('left')
  const top = position.startsWith('top')
  return {
    type: FASTENERS[stableIndex(`${signature}:fastener-type`, FASTENERS.length)],
    position,
    xPercent: numberFor(signature, 'fastener-x', left ? 20 : 70, left ? 30 : 80, 1),
    yPercent: top ? 0 : 100,
    rotation: numberFor(signature, 'fastener-rotation', -11, 11, 1),
  }
}

export function createStageVariants({
  seed,
  resetRevision = 0,
  stage = 'welcome',
  poseCount = 1,
  dialogueCount = 1,
  collagePoolSize = 3,
  collageMin = 2,
  collageMax = 3,
  tarotTextureCount = 4,
} = {}) {
  const signature = makeVariantSignature(seed || 'unseeded', resetRevision, stage, 'machine')
  const poses = orderFor(signature, 'poses', safeCount(poseCount, 1))
  const collageSize = safeCount(collagePoolSize, 3)
  const collageOrder = orderFor(signature, 'collage', collageSize)
  const minimum = Math.min(collageSize, safeCount(collageMin, 2))
  const maximum = Math.min(collageSize, Math.max(minimum, safeCount(collageMax, 3)))
  const collageCount = maximum > minimum
    ? minimum + stableIndex(`${signature}:collage-count`, maximum - minimum + 1)
    : minimum

  return {
    signature,
    poseIndex: poses[0] ?? -1,
    poseOrder: poses,
    dialogueIndex: stableIndex(`${signature}:dialogue`, safeCount(dialogueCount, 1)),
    collage: {
      count: collageCount,
      start: collageOrder[0] ?? -1,
      order: collageOrder,
    },
    tilt: {
      card: numberFor(signature, 'card-tilt', -5.25, 5.25, 2),
      paper: numberFor(signature, 'paper-tilt', -2.4, 2.4, 2),
    },
    fastener: fastenerFor(signature),
    tarotTextureOffset: stableIndex(
      `${signature}:tarot-texture`,
      safeCount(tarotTextureCount, 4),
    ),
    transitionAccent: ACCENTS[stableIndex(`${signature}:transition`, ACCENTS.length)],
  }
}
