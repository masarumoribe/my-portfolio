import { useEffect, useState } from 'react'
import { MOMENTS, toProgress, TOTAL_SCROLL } from '../config'

// Each section mapped to its scroll position and label
const SECTIONS = [
  { key: 'arrival',  label: 'Arrival',  scroll: 0 },
  { key: 'skills',   label: 'Skills',   scroll: MOMENTS.skills.start   + 1000 },
  { key: 'projects', label: 'Projects', scroll: MOMENTS.projects.start + 500  },
  { key: 'about',    label: 'About',    scroll: MOMENTS.about.start    + 500  },
  { key: 'contact',  label: 'Contact',  scroll: MOMENTS.contact.start  + 500  },
]

function Navigation({ progressRef, targetScrollY, scrollYRef }) {
  const [activeSection, setActiveSection] = useState('arrival')
  const [hoveredDot, setHoveredDot]       = useState(null)

  // Track which section is currently active
  useEffect(() => {
    let frameId

    const tick = () => {
      const scrollY = targetScrollY.current

      // Find the active section based on current scroll position
      const active = [...SECTIONS].reverse().find(s => scrollY >= s.scroll)
      if (active) setActiveSection(active.key)

      frameId = requestAnimationFrame(tick)
    }

    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [scrollYRef])

  const navigateTo = (targetScroll) => {
    // Set targetScrollY — Journey.jsx lerps toward it smoothly
    // This animates the fairy traveling to the section
    targetScrollY.current = Math.max(0, Math.min(targetScroll, TOTAL_SCROLL))
  }

  return (
    <div style={{
      position:      'fixed',
      right:         '24px',
      top:           '50%',
      transform:     'translateY(-50%)',
      display:       'flex',
      flexDirection: 'column',
      gap:           '16px',
      zIndex:        50,
      pointerEvents: 'all',
    }}>
      {SECTIONS.map(section => {
        const isActive  = activeSection === section.key
        const isHovered = hoveredDot === section.key

        return (
          <div
            key={section.key}
            style={{
              position: 'relative',
              display:  'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '10px',
              cursor: 'pointer',
            }}
            onClick={() => navigateTo(section.scroll)}
            onMouseEnter={() => setHoveredDot(section.key)}
            onMouseLeave={() => setHoveredDot(null)}
          >
            {/* Label — appears on hover */}
            <div style={{
              fontFamily:    'sans-serif',
              fontSize:      '0.65rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color:         'rgba(200,168,255,0.8)',
              opacity:       isHovered ? 1 : 0,
              transform:     isHovered ? 'translateX(0)' : 'translateX(8px)',
              transition:    'opacity 0.2s ease, transform 0.2s ease',
              whiteSpace:    'nowrap',
              pointerEvents: 'none',
            }}>
              {section.label}
            </div>

            {/* Dot */}
            <div style={{
              width:        isActive ? '10px' : '6px',
              height:       isActive ? '10px' : '6px',
              borderRadius: '50%',
              background:   isActive
                ? 'rgba(200,168,255,0.9)'
                : 'rgba(200,168,255,0.3)',
              border:       isHovered && !isActive
                ? '1px solid rgba(200,168,255,0.6)'
                : 'none',
              transition:   'all 0.3s ease',
              boxShadow:    isActive
                ? '0 0 8px rgba(200,168,255,0.6)'
                : 'none',
            }} />
          </div>
        )
      })}
    </div>
  )
}

export default Navigation