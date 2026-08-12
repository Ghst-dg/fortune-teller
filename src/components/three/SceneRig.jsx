import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo, useRef } from 'react'
import { MathUtils, Vector3 } from 'three'
import { STAGE_ZONE } from '../../constants/experience'
import { useReducedMotion } from '../../hooks/useReducedMotion'

const TARGETS = {
  welcome: [0, 0.15, 6.4, -0.25, 43], identity: [-0.28, 0.08, 6.15, -0.22, 42],
  palm: [0.35, -7.88, 5.88, -8.18, 41], scanning: [0.08, -7.96, 5.48, -8.14, 40],
  tarot: [0, -15.55, 5.82, -15.98, 44], result: [0.24, -15.78, 6.22, -16.18, 43],
}

function easeInOutCubic(value) {
  return value < 0.5 ? 4 * value ** 3 : 1 - ((-2 * value + 2) ** 3) / 2
}

export default function SceneRig({ stage, resetRevision, children }) {
  const reduced = useReducedMotion()
  const previous = useRef({ stage, zone: STAGE_ZONE[stage], resetRevision })
  const pending = useRef(null)
  const transition = useRef(null)
  const currentLookY = useRef(TARGETS[stage][3])
  const targetPosition = useMemo(() => new Vector3(), [])
  const lookTarget = useMemo(() => new Vector3(), [])

  useEffect(() => {
    const reset = previous.current.resetRevision !== resetRevision
    const zoneChanged = previous.current.zone !== STAGE_ZONE[stage]
    const stageChanged = previous.current.stage !== stage
    if (reset || stageChanged) pending.current = {
      duration: reduced ? .01 : reset ? .72 : zoneChanged ? 1.35 : .7,
      mode: reset ? 'reset' : zoneChanged ? 'zone' : 'step',
    }
    previous.current = { stage, zone: STAGE_ZONE[stage], resetRevision }
  }, [reduced, resetRevision, stage])

  useFrame(({ camera, pointer }, delta) => {
    const [x, y, z, lookY, fov] = TARGETS[stage]
    if (pending.current) {
      transition.current = { fromY: camera.position.y, toY: y, fromLook: currentLookY.current, toLook: lookY, elapsed: 0, ...pending.current }
      pending.current = null
    }
    let push = 0
    if (transition.current) {
      const travel = transition.current
      travel.elapsed += Math.min(delta, 0.05)
      const raw = Math.min(1, travel.elapsed / travel.duration)
      const progress = travel.mode === 'reset' ? 1 - (1 - raw) ** 3 : easeInOutCubic(raw)
      camera.position.y = MathUtils.lerp(travel.fromY, travel.toY, progress)
      currentLookY.current = MathUtils.lerp(travel.fromLook, travel.toLook, progress)
      push = Math.sin(raw * Math.PI) * (travel.mode === 'step' ? .18 : .4)
      if (raw >= 1) transition.current = null
    } else {
      camera.position.y = MathUtils.damp(camera.position.y, y + (reduced ? 0 : pointer.y * 0.1), 2.8, delta)
      currentLookY.current = MathUtils.damp(currentLookY.current, lookY, 3, delta)
    }
    targetPosition.set(x + (reduced ? 0 : pointer.x * 0.2), camera.position.y, z + push)
    camera.position.x = MathUtils.damp(camera.position.x, targetPosition.x, 2.8, delta)
    camera.position.z = MathUtils.damp(camera.position.z, targetPosition.z, 2.8, delta)
    lookTarget.set(0, currentLookY.current, -1.5)
    camera.lookAt(lookTarget)
    camera.fov = MathUtils.damp(camera.fov, fov + (push ? 2 : 0), 3, delta)
    camera.updateProjectionMatrix()
  })

  return <group>{children}</group>
}
