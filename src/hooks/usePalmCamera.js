import { useCallback, useEffect, useRef, useState } from 'react'
import { TIMINGS } from '../constants/experience'
import { inspectPalm, loadHandDetector } from '../utils/handDetection'

function stopStream(stream) {
  stream?.getTracks().forEach((track) => track.stop())
}

export function usePalmCamera(onCapture) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const previousRef = useRef(null)
  const capturingRef = useRef(false)
  const stableRef = useRef(0)
  const [status, setStatus] = useState('requesting')
  const [confidence, setConfidence] = useState(0)
  const [showFallback, setShowFallback] = useState(false)

  const capture = useCallback((demo = false) => {
    if (capturingRef.current) return
    capturingRef.current = true
    const video = videoRef.current
    if (demo || !video?.videoWidth) return onCapture(null)

    const canvas = document.createElement('canvas')
    const size = Math.min(video.videoWidth, video.videoHeight)
    const sourceX = (video.videoWidth - size) / 2
    const sourceY = (video.videoHeight - size) / 2
    canvas.width = 720
    canvas.height = 720
    const context = canvas.getContext('2d')
    context.translate(720, 0)
    context.scale(-1, 1)
    context.drawImage(video, sourceX, sourceY, size, size, 0, 0, 720, 720)
    setStatus('captured')
    stopStream(streamRef.current)
    onCapture(canvas.toDataURL('image/jpeg', 0.82))
  }, [onCapture])

  useEffect(() => {
    let cancelled = false
    let sampleTimer
    const fallbackTimer = setTimeout(() => setShowFallback(true), 9000)

    async function startCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error('unsupported')
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (cancelled) return stopStream(stream)
        streamRef.current = stream
        videoRef.current.srcObject = stream
        await videoRef.current.play()
        setStatus('loading')
        const detector = await loadHandDetector()
        if (cancelled) return
        setStatus('searching')
        const startedAt = performance.now()
        sampleTimer = setInterval(() => analyzeFrame(detector, startedAt), 150)
      } catch {
        if (!cancelled) {
          setStatus(streamRef.current ? 'unavailable' : 'blocked')
          setShowFallback(true)
        }
      }
    }

    function analyzeFrame(detector, startedAt) {
      const video = videoRef.current
      if (!video?.videoWidth || performance.now() - startedAt < TIMINGS.cameraWarmup) return
      const palm = inspectPalm(detector.detectForVideo(video, performance.now()), previousRef.current)
      previousRef.current = palm.points
      const steady = palm.found && palm.motion < .024
      stableRef.current = steady ? stableRef.current + 1 : Math.max(0, stableRef.current - 2)
      const holdScore = Math.round((stableRef.current / TIMINGS.stableSamples) * 100)
      const nextConfidence = palm.found ? Math.min(99, Math.round(palm.score * .55 + holdScore * .45)) : 0
      setConfidence(nextConfidence)
      setStatus(palm.found ? 'detected' : palm.wrongHand ? 'wrong-hand' : 'searching')
      if (stableRef.current >= TIMINGS.stableSamples) capture()
    }

    startCamera()
    return () => {
      cancelled = true
      clearInterval(sampleTimer)
      clearTimeout(fallbackTimer)
      stopStream(streamRef.current)
    }
  }, [capture])

  return { videoRef, status, confidence, showFallback, capture }
}
