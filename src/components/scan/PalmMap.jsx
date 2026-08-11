const NODES = [
  [31, 71], [37, 53], [43, 36], [50, 22], [57, 39],
  [65, 56], [72, 72], [51, 62], [43, 76], [59, 78],
]

const LINES = [
  { x: 28, y: 52, width: 46, angle: -20, label: 'LIFE.LINE' },
  { x: 33, y: 68, width: 39, angle: 8, label: 'DEBUG.PATH' },
  { x: 43, y: 34, width: 35, angle: 73, label: 'CHAI.MOUNT' },
]

export default function PalmMap({ progress }) {
  return (
    <div className="palm-map" aria-hidden="true">
      <div className="palm-grid" />
      {LINES.map((line, index) => (
        <i className="map-line" key={line.label} style={{
          '--x': `${line.x}%`, '--y': `${line.y}%`, '--w': `${line.width}%`,
          '--angle': `${line.angle}deg`, '--delay': `${index * 0.22}s`,
        }}><b>{line.label}</b></i>
      ))}
      {NODES.map(([x, y], index) => (
        <span className="map-node" key={`${x}-${y}`} style={{
          '--x': `${x}%`, '--y': `${y}%`, '--delay': `${index * 0.08}s`,
        }}>{index + 1}</span>
      ))}
      <div className="map-reticle"><i /><i /></div>
      <div className="map-progress" style={{ '--scan-progress': `${progress}%` }} />
    </div>
  )
}
