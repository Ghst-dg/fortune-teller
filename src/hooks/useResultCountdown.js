import { useEffect, useState } from 'react'

export function useResultCountdown(deadline, onExpire) {
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()))

  useEffect(() => {
    function update() {
      const next = Math.max(0, deadline - Date.now())
      setRemaining(next)
      if (next <= 0) onExpire()
    }
    update()
    const interval = setInterval(update, 1000)
    document.addEventListener('visibilitychange', update)
    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', update)
    }
  }, [deadline, onExpire])

  const totalSeconds = Math.ceil(remaining / 1000)
  return `${String(Math.floor(totalSeconds / 60)).padStart(2, '0')}:${String(totalSeconds % 60).padStart(2, '0')}`
}
