const COLORS = ['#a84f3d', '#d28b43', '#5b7880', '#a85e67', '#73566b']

export const GALI_SEGMENTS = Array.from({ length: 7 }, (_, index) => ({
  index,
  z: 0.55 - index * 1.42,
  x: 4.18 - index * 0.27,
  width: 2.5 - index * 0.13,
  depth: 1.55,
  height: 4.45 + ((index * 5) % 4) * 0.32,
  color: COLORS[(index * 3) % COLORS.length],
  tilt: ((index % 3) - 1) * 0.018,
}))

export const innerEdge = (segment) => segment.x - segment.width / 2 - 0.025
