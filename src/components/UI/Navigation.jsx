import { useEffect, useState, useRef } from 'react'
import { MOMENTS, toProgress, TOTAL_SCROLL } from '../config'

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
  const [menuOpen, setMenuOpen]           = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])


  useEffect(() => {
    let frameId
    const tick = () => {
      const scrollY = targetScrollY.current
      const active  = [...SECTIONS].reverse().find(s => scrollY >= s.scroll)
      if (active) setActiveSection(active.key)
      frameId = requestAnimationFrame(tick)
    }
    frameId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameId)
  }, [targetScrollY])

  const navigateTo = (targetScroll) => {
    targetScrollY.current = Math.max(0, Math.min(targetScroll, TOTAL_SCROLL))
    setMenuOpen(false)  // close menu after navigating
  }

  // ── Mobile hamburger menu ─────────────────────────────────
  if (isMobile) {
    return (
      <>
        {/* Hamburger button */}
        <button
          onClick={() => setMenuOpen(prev => !prev)}
          style={{
            position:        'fixed',
            top:             '20px',
            right:           '20px',
            zIndex:          1000,
            pointerEvents: 'all',
            background:      'rgba(18,10,40,0.7)',
            border:          '0.5px solid rgba(200,168,255,0.3)',
            borderRadius:    '10px',
            width:           '44px',
            height:          '44px',
            display:         'flex',
            flexDirection:   'column',
            alignItems:      'center',
            justifyContent:  'center',
            gap:             '5px',
            cursor:          'pointer',
            backdropFilter:  'blur(8px)',
            padding:         0,
          }}
        >
          {/* Three lines — animated to X when open */}
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width:        '18px',
              height:       '1.5px',
              background:   'rgba(200,168,255,0.8)',
              borderRadius: '2px',
              transition:   'all 0.3s ease',
              transform: menuOpen
                ? i === 0 ? 'rotate(45deg) translate(4.5px, 4.5px)'
                : i === 2 ? 'rotate(-45deg) translate(4.5px, -4.5px)'
                : 'scaleX(0)'
                : 'none',
              opacity: menuOpen && i === 1 ? 0 : 1,
            }} />
          ))}
        </button>

        {/* Full screen overlay menu */}
        <div style={{
          position:       'fixed',
          inset:          0,
          background:     'rgba(10,6,28,0.95)',
          backdropFilter: 'blur(16px)',
          zIndex:         90,
          display:        'flex',
          flexDirection:  'column',
          alignItems:     'center',
          justifyContent: 'center',
          gap:            '8px',
          opacity:        menuOpen ? 1 : 0,
          pointerEvents:  menuOpen ? 'all' : 'none',
          transition:     'opacity 0.3s ease',
        }}>
          {SECTIONS.map((section, i) => {
            const isActive = activeSection === section.key
            return (
              <button
                key={section.key}
                onClick={() => navigateTo(section.scroll)}
                style={{
                  background:    'none',
                  border:        'none',
                  cursor:        'pointer',
                  padding:       '16px 32px',
                  textAlign:     'center',
                  opacity:       menuOpen ? 1 : 0,
                  transform:     menuOpen ? 'translateY(0)' : 'translateY(20px)',
                  transition:    `opacity 0.3s ease ${i * 0.06}s, transform 0.3s ease ${i * 0.06}s`,
                }}
              >
                {/* Section number */}
                <p style={{
                  fontFamily:    'sans-serif',
                  fontSize:      '0.6rem',
                  letterSpacing: '0.2em',
                  color:         'rgba(200,168,255,0.4)',
                  margin:        '0 0 4px',
                }}>
                  0{i + 1}
                </p>

                {/* Section name */}
                <p style={{
                  fontFamily:    'serif',
                  fontSize:      isActive ? '2rem' : '1.6rem',
                  fontWeight:    '400',
                  color:         isActive ? '#F0E8FF' : 'rgba(200,168,255,0.5)',
                  letterSpacing: '0.08em',
                  margin:        0,
                  transition:    'all 0.3s ease',
                  textShadow:    isActive ? '0 0 30px rgba(200,168,255,0.5)' : 'none',
                }}>
                  {section.label}
                </p>

                {/* Active indicator */}
                {isActive && (
                  <div style={{
                    width:      '24px',
                    height:     '1px',
                    background: 'rgba(200,168,255,0.5)',
                    margin:     '8px auto 0',
                  }} />
                )}
              </button>
            )
          })}

          {/* Decorative sparkle */}
          <p style={{
            fontFamily:    'sans-serif',
            fontSize:      '0.65rem',
            letterSpacing: '0.3em',
            color:         'rgba(200,168,255,0.2)',
            margin:        '2rem 0 0',
          }}>
            ✦ ✦ ✦
          </p>
        </div>
      </>
    )
  }

  // ── Desktop dots ──────────────────────────────────────────
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
              position:       'relative',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'flex-end',
              gap:            '10px',
              cursor:         'pointer',
              padding:        '8px 8px 8px 20px',
              margin:         '-8px -8px -8px -20px',
            }}
            onClick={() => navigateTo(section.scroll)}
            onMouseEnter={() => setHoveredDot(section.key)}
            onMouseLeave={() => setHoveredDot(null)}
          >
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