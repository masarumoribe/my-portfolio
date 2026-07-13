import { useEffect, useState } from 'react'
import ArrivalText from './ArrivalText'
import SkillCard from './SkillCard'
import { MOMENTS, SKILLS, toProgress } from '../config'

function Overlay({ progressRef }) {
  const [progress, setProgress]       = useState(0)
  const [activeSkill, setActiveSkill] = useState(null)

  useEffect(() => {
    let frameId
    const tick = () => {
      setProgress(prev => {
        const next = progressRef.current
        return Math.abs(next - prev) > 0.001 ? next : prev
      })
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [progressRef])

  useEffect(() => {
    const start     = toProgress(MOMENTS.skills.start)
    const end       = toProgress(MOMENTS.skills.end)
    const sliceSize = (end - start) / SKILLS.length
    const gap       = toProgress(20)

    if (progress < start || progress > end) {
      setActiveSkill(null)
      return
    }

    const found = SKILLS.find((_, i) => {
      const windowStart = start + i * sliceSize + gap / 2
      const windowEnd   = windowStart + sliceSize - gap
      return progress >= windowStart && progress <= windowEnd
    })

    setActiveSkill(found || null)
  }, [progress])

  const getMomentOpacity = (moment, fadeRange = 0.04) => {
    const start = toProgress(MOMENTS[moment].start)
    const end   = toProgress(MOMENTS[moment].end)

    if (progress < start - fadeRange) return 0
    if (progress > end + fadeRange)   return 0
    if (progress < start) return (progress - (start - fadeRange)) / fadeRange
    if (progress > end)   return 1 - (progress - end) / fadeRange
    return 1
  }

  return (
    <div style={{
      position:      'fixed',
      inset:         0,
      pointerEvents: 'none',
      zIndex:        10,
    }}>
      <ArrivalText opacity={getMomentOpacity('arrival', 0.06)} />
      <SkillCard skill={activeSkill} visible={activeSkill !== null} />
    </div>
  )
}

export default Overlay