const FINGERS = ['thumb', 'index', 'middle', 'ring', 'pinky']

export default function PalmGuide({ active }) {
  return (
    <div className={`palm-guide ${active ? 'is-active' : ''}`} aria-hidden="true">
      <i className="frame-corner corner-a" />
      <i className="frame-corner corner-b" />
      <i className="frame-corner corner-c" />
      <i className="frame-corner corner-d" />
      <div className="hand-guide">
        {FINGERS.map((finger) => <i className={`finger finger--${finger}`} key={finger} />)}
        <b />
      </div>
      <span className="target-cross target-cross--a">+</span>
      <span className="target-cross target-cross--b">+</span>
      <span className="camera-code">RIGHT PALM / LIVE</span>
    </div>
  )
}
