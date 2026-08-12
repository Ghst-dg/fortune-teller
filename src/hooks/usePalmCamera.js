import { useCallback, useEffect, useRef, useState } from 'react'
import { TIMINGS } from '../constants/experience'

function stopStream(stream) {
  stream?.getTracks().forEach((track) => track.stop())
}

export function usePalmCamera(onCapture) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const sampleRef = useRef(null)
  const previousRef = useRef(null)
  const capturingRef = useRef(false)
  const stableRef = useRef(0)
  const [status, setStatus] = useState('requesting')
  const [confidence, setConfidence] = useState(0)

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
        setStatus('searching')
        const startedAt = performance.now()
        sampleTimer = setInterval(() => analyzeFrame(startedAt), 120)
      } catch {
        if (!cancelled) {
          setStatus('blocked')
        }
      }
    }

    function analyzeFrame(startedAt) {
      const video = videoRef.current
      if (!video?.videoWidth || performance.now() - startedAt < TIMINGS.cameraWarmup) return
      const canvas = sampleRef.current ?? document.createElement('canvas')
      sampleRef.current = canvas
      canvas.width = 64
      canvas.height = 48
      const context = canvas.getContext('2d', { willReadFrequently: true })
      context.drawImage(video, 0, 0, 64, 48)
      const pixels = context.getImageData(8, 6, 48, 36).data
      const luminance = []
      for (let index = 0; index < pixels.length; index += 16) {
        luminance.push((pixels[index] * 3 + pixels[index + 1] * 6 + pixels[index + 2]) / 10)
      }
      const mean = luminance.reduce((sum, value) => sum + value, 0) / luminance.length
      const variance = luminance.reduce((sum, value) => sum + (value - mean) ** 2, 0) / luminance.length
      const previous = previousRef.current
      const motion = previous ? luminance.reduce((sum, value, i) => sum + Math.abs(value - previous[i]), 0) / luminance.length : 99
      previousRef.current = luminance
      const steady = mean > 24 && mean < 238 && variance > 110 && motion < 14
      stableRef.current = steady
        ? Math.min(TIMINGS.stableSamples, stableRef.current + 1)
        : Math.max(0, stableRef.current - 2)
      const steadyConfidence = Math.min(100, Math.round((stableRef.current / TIMINGS.stableSamples) * 100))
      const elapsed = performance.now() - startedAt
      const timedConfidence = Math.min(100, Math.floor((elapsed / TIMINGS.palmCaptureDelay) * 100))
      const nextConfidence = Math.min(steadyConfidence, timedConfidence)
      setConfidence(nextConfidence)
      if (steadyConfidence > 35) setStatus('detected')
      if (steady && stableRef.current >= TIMINGS.stableSamples && timedConfidence >= 100) capture()
    }

    startCamera()
    return () => {
      cancelled = true
      clearInterval(sampleTimer)
      stopStream(streamRef.current)
    }
  }, [capture])

  return { videoRef, status, confidence, capture }
}
