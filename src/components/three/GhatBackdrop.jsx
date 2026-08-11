import GhatHaveli from './GhatHaveli'

const WASH = ['#b96542', '#ce8a52', '#d9a565', '#ad5942', '#e0b777', '#c8794d']
const TRIM = ['#e0b06e', '#8c4737', '#f0c982', '#6f4038']
const HEIGHTS = [3.2, 4.1, 3.55, 4.65, 3.78, 4.35, 3.08, 4.8]

const FACADES = Array.from({ length: 23 }, (_, index) => {
  const x = -25.3 + index * 2.3
  const centralDip = Math.abs(x) < 3.5 ? -0.62 : 0
  return {
    x,
    z: -5.25 - (index % 3) * 0.18,
    width: 2.36 + (index % 4 === 0 ? 0.22 : 0),
    height: HEIGHTS[index % HEIGHTS.length] + centralDip,
    color: WASH[index % WASH.length],
    trim: TRIM[(index * 3) % TRIM.length],
    balcony: index % 3 !== 1,
    pavilion: index % 5 === 1 && Math.abs(x) > 3.5,
  }
})

export default function GhatBackdrop() {
  return (
    <group>
      <mesh position={[0, -0.08, -5.72]}>
        <boxGeometry args={[54, 3.25, 0.72]} />
        <meshStandardMaterial color="#754438" roughness={1} />
      </mesh>
      {FACADES.map((facade) => <GhatHaveli key={facade.x} {...facade} />)}
    </group>
  )
}
