import { useEffect, useState } from 'react'
import ArrivalText from './ArrivalText'
import SkillCard from './SkillCard'
import { MOMENTS, SKILLS, toProgress } from '../config'
import ProjectHoverCard from './ProjectHoverCard'

function Overlay({ progressRef, hoveredProject, onCardEnter, onCardLeave }) {
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

      {/* Projects section title */}
      <div style={{
        position:   'fixed',
        top:        '8vh',
        left:       '50%',
        transform:  'translateX(-50%)',
        textAlign:  'center',
        opacity:    getMomentOpacity('projects', 0.04),
        transition: 'opacity 0.6s ease',
        pointerEvents: 'none',
      }}>
        <p style={{
          fontFamily:    'sans-serif',
          fontSize:      '0.7rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(200,168,255,0.4)',
          margin:        0,
        }}>
          ✦ menu ✦
        </p>
        <h2 style={{
          fontFamily:    'serif',
          fontSize:      'clamp(1.2rem, 3vw, 1.8rem)',
          fontWeight:    '400',
          color:         '#F0E8FF',
          letterSpacing: '0.1em',
          margin:        '0.3rem 0 0',
          textShadow:    '0 0 30px rgba(200,168,255,0.4)',
        }}>
          Projects
        </h2>
        <div style={{
            width:      '58px',
            height:     '1px',
            background: 'rgba(200,168,255,0.3)',
            margin:     '0.8rem auto',
          }} />
        <p style={{
          fontFamily: 'sans-serif',
          fontSize:   '1.1rem',
          fontWeight: '300',
          lineHeight: '1.7',
          color:      'rgba(220,200,255,0.7)',
          margin:     '0 0 1rem',
        }}>
          Hover over the cocktail projects for more information
        </p>
      </div>

      <ProjectHoverCard 
        project={hoveredProject} 
        onMouseEnter={onCardEnter}
        onMouseLeave={onCardLeave}
      />

    </div>
  )
}

export default Overlay