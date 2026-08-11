import { Component } from 'react'

export default class SceneBoundary extends Component {
  state = { failed: false }

  static getDerivedStateFromError() {
    return { failed: true }
  }

  componentDidCatch(error) {
    console.warn('The 3D atmosphere took a chai break.', error)
  }

  render() {
    if (this.state.failed) return <div className="scene-fallback" aria-hidden="true"><i /><i /><i /></div>
    return this.props.children
  }
}
