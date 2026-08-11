import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { Color, DoubleSide } from 'three'

const VERTEX_SHADER = `
  uniform float uTime;
  varying float vWave;
  varying vec2 vUv;
  void main() {
    vec3 moved = position;
    float worldX = position.x;
    float worldZ = 1.3 - position.y;
    float longWave = uTime * .72 + worldX * .34 + worldZ * .28;
    float crossWave = uTime * .48 - worldX * .17 + worldZ * .52;
    vWave = sin(longWave) * .022 + sin(crossWave) * .011;
    moved.z += vWave;
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(moved, 1.0);
  }
`

const FRAGMENT_SHADER = `
  uniform vec3 uColor;
  varying float vWave;
  varying vec2 vUv;
  void main() {
    float crest = smoothstep(-.006, .032, vWave);
    float glint = pow(max(0.0, sin((vUv.x + vUv.y) * 54.0)), 18.0) * .08;
    vec3 water = mix(uColor * .72, uColor + vec3(.11, .14, .13), crest + glint);
    gl_FragColor = vec4(water, 1.0);
  }
`

export default function WaterSurface({ color }) {
  const material = useRef()
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new Color(color) },
  }), [color])

  useFrame(({ clock }) => {
    if (material.current) material.current.uniforms.uTime.value = clock.elapsedTime
  })

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0, -1.52, 1.3]}>
      <planeGeometry args={[44, 30, 48, 36]} />
      <shaderMaterial ref={material} uniforms={uniforms} vertexShader={VERTEX_SHADER}
        fragmentShader={FRAGMENT_SHADER} side={DoubleSide} />
    </mesh>
  )
}
