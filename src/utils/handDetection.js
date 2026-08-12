const WASM_ROOT = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@1.0.1/wasm'
const MODEL_URL = 'https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task'

let detectorPromise

export function loadHandDetector() {
  detectorPromise ??= import('@mediapipe/tasks-vision').then(async ({ FilesetResolver, HandLandmarker }) => {
    const vision = await FilesetResolver.forVisionTasks(WASM_ROOT)
    return HandLandmarker.createFromOptions(vision, {
      baseOptions: { modelAssetPath: MODEL_URL },
      runningMode: 'VIDEO',
      numHands: 1,
      minHandDetectionConfidence: 0.62,
      minHandPresenceConfidence: 0.62,
      minTrackingConfidence: 0.58,
    })
  })
  return detectorPromise
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y)
}

function palmMotion(points, previous) {
  if (!previous) return 1
  return points.reduce((sum, point, index) => sum + distance(point, previous[index]), 0) / points.length
}

export function inspectPalm(result, previous) {
  const points = result.landmarks?.[0]
  if (!points) return { found: false, score: 0, points: null, motion: 1 }

  const fingerPairs = [[8, 6], [12, 10], [16, 14], [20, 18]]
  const extended = fingerPairs.filter(([tip, joint]) => (
    distance(points[tip], points[0]) > distance(points[joint], points[0]) * 1.13
  )).length
  const palmSize = distance(points[0], points[9])
  const thumbOpen = distance(points[4], points[5]) > palmSize * 0.48
  const xs = points.map(({ x }) => x)
  const ys = points.map(({ y }) => y)
  const width = Math.max(...xs) - Math.min(...xs)
  const height = Math.max(...ys) - Math.min(...ys)
  const centerX = (Math.max(...xs) + Math.min(...xs)) / 2
  const centerY = (Math.max(...ys) + Math.min(...ys)) / 2
  const centered = centerX > .2 && centerX < .8 && centerY > .16 && centerY < .84
  const largeEnough = width > .2 && height > .31
  const open = extended >= 4 && thumbOpen
  const handedness = result.handedness?.[0]?.[0]
  // Raw selfie video is unmirrored; MediaPipe's handedness labels assume a mirrored input.
  const rightHand = !handedness || handedness.categoryName === 'Left'
  const modelScore = handedness?.score ?? .7
  const score = Math.round(Math.min(1, modelScore * .45 + extended / 5 * .4 + Math.min(1, width / .38) * .15) * 100)
  const palmReady = open && centered && largeEnough

  return {
    found: palmReady && rightHand,
    wrongHand: palmReady && !rightHand,
    score,
    points,
    motion: palmMotion(points, previous),
  }
}
