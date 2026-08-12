export const STAGES = ['welcome', 'identity', 'palm', 'scanning', 'tarot', 'result']

export const ZONE_Y = { market: 0, street: -8, ghat: -16 }

export const STAGE_ZONE = {
  welcome: 'market', identity: 'market', palm: 'street',
  scanning: 'street', tarot: 'ghat', result: 'ghat',
}

export const TIMINGS = {
  cameraWarmup: 900,
  stableSamples: 17,
  palmCaptureDelay: 10_000,
  scanDuration: 6400,
  tarotCut: 900,
  tarotDeal: 1550,
  tarotSpread: 2850,
  tarotSelecting: 3650,
  tarotLock: 4300,
  tarotReveal: 5200,
  tarotComplete: 6600,
  resultDuration: 60_000,
}

export const STAGE_LABELS = {
  welcome: 'Start',
  identity: 'You',
  palm: 'Palm',
  scanning: 'Scan',
  tarot: 'Deal',
  result: 'Fate',
}
