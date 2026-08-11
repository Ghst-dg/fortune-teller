import { useEffect, useState } from 'react'
import { SRGBColorSpace, TextureLoader } from 'three'
import { innerEdge } from './galiLayout'

const TEXTURE_PATH = '/textures/kashi-gali-mural.webp'

export default function KashiMural({ side, segment, y, mirrored = false }) {
  const [texture, setTexture] = useState(null)
  const inner = innerEdge(segment) - 0.012

  useEffect(() => {
    let live = true
    let loaded
    new TextureLoader().load(TEXTURE_PATH, (next) => {
      loaded = next
      next.colorSpace = SRGBColorSpace
      next.repeat.set(0.28, 1)
      next.offset.x = mirrored ? 0.58 : 0.29
      if (live) setTexture(next)
    }, undefined, () => {})
    return () => {
      live = false
      loaded?.dispose()
    }
  }, [mirrored])

  return <group position={[side * inner, y, segment.z - 0.18]}
    rotation-y={-side * Math.PI / 2}>
    <mesh><planeGeometry args={[1.16, 1.42]} />
      <meshStandardMaterial map={texture} color={texture ? '#ffffff' : '#ca7454'}
        roughness={0.95} polygonOffset polygonOffsetFactor={-1} /></mesh>
    {[[-0.42, 0.51], [0, 0.51], [0.42, 0.51], [-0.42, -0.51], [0.42, -0.51]].map(
      ([x, dotY], index) => <mesh key={`${x}-${dotY}`} position={[x, dotY, 0.012]}>
        <circleGeometry args={[0.055 + (index % 2) * 0.02, 8]} />
        <meshStandardMaterial color={index % 2 ? '#1f7180' : '#e9b23a'} roughness={0.9} />
      </mesh>,
    )}
    <mesh position={[0, 0.76, 0.015]}><boxGeometry args={[1.32, 0.08, 0.04]} />
      <meshStandardMaterial color="#e3ad3b" roughness={0.84} /></mesh>
  </group>
}
