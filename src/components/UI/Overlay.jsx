// Overlay is a fixed HTML layer that sits on top of the R3F canvas.
// It renders all text content for each moment.
// The canvas handles the 3D world — this handles all readable text.
// Props:
//   progressRef — the shared scroll progress (0 to 1)

import { useRef, useEffect, useState } from 'react'
import ArrivalText from './ArrivalText'
import { MOMENTS } from '../config'

function Overlay({ progressRef }) {
  // We need to re-render this HTML layer when progress changes.
  // R3F's useFrame doesn't work outside the Canvas, so we use
  // requestAnimationFrame to poll progressRef and update state.
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let frameId

    const tick = () => {
      // Only trigger a re-render if progress has changed meaningfully
      setProgress(prev => {
        const next = progressRef.current
        return Math.abs(next - prev) > 0.001 ? next : prev
      })
      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [progressRef])

  // Helper — returns opacity 0 or 1 based on whether progress
  // is within a moment's range. Fades in/out over a small threshold.
  const getMomentOpacity = (moment) => {
    const { start, end } = MOMENTS[moment]
    const fadeRange = 0.05  // how quickly it fades in/out

    if (progress < start - fadeRange) return 0
    if (progress > end + fadeRange)   return 0
    if (progress < start) return (progress - (start - fadeRange)) / fadeRange
    if (progress > end)   return 1 - (progress - end) / fadeRange
    return 1
  }

  return (
    // Fixed layer covering the full viewport, pointer-events none
    // so it never blocks mouse interaction with the 3D scene
    <div style={{
      position:      'fixed',
      inset:         0,
      pointerEvents: 'none',
      zIndex:        10,
    }}>
      <ArrivalText opacity={getMomentOpacity('arrival')} />
    </div>
  )
}

export default Overlay