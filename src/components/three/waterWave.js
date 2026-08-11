export function sampleWaterWave(x, z, time, target) {
  const longWave = time * 0.72 + x * 0.34 + z * 0.28
  const crossWave = time * 0.48 - x * 0.17 + z * 0.52
  const height = Math.sin(longWave) * 0.022 + Math.sin(crossWave) * 0.011
  const slopeX = Math.cos(longWave) * 0.0075 - Math.cos(crossWave) * 0.0019
  const slopeZ = Math.cos(longWave) * 0.0062 + Math.cos(crossWave) * 0.0057

  target.set(height, -Math.atan(slopeZ), Math.atan(slopeX))
  return target
}
