import { useState, useEffect } from 'react'
import { MOMENTS, toProgress } from '../config'

// ProjectHoverCard shows project info when a cocktail is hovered.
// Always appears in the same position regardless of which cocktail is hovered.
// Props:
//   project — the hovered project object, or null if nothing is hovered

function ProjectHoverCard({ project, onMouseEnter, onMouseLeave, progress }) {
  const inProjectsSection = progress >= toProgress(MOMENTS.projects.start) && progress <= toProgress(MOMENTS.projects.end)

  const shouldShow = project && inProjectsSection
  // Keep last project in memory so we can fade it out before unmounting
  const [displayProject, setDisplayProject] = useState(null)
  const [visible, setVisible]               = useState(false)

  useEffect(() => {
    if (shouldShow) {
      // New project — update content and show immediately
      setDisplayProject(project)
      setVisible(true)
    } else {
      // No project — fade out first, then clear content
      setVisible(false)
      const timer = setTimeout(() => setDisplayProject(null), 400)
      return () => clearTimeout(timer)
    }
  }, [shouldShow, project])

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        position:      'fixed',
        bottom:        '6vh',
        left:          '50%',
        transform:     'translateX(-50%)',
        width:         'min(90%, 460px)',
        opacity:       visible ? 1 : 0,
        translate:     `0 ${visible ? '0px' : '16px'}`,
        transition:    'opacity 0.4s ease, translate 0.4s ease',
        pointerEvents: visible ? 'all' : 'none',
        zIndex:        20,
      }}
    >
      {displayProject && (
        <div style={{
          background:     'rgba(18,10,40,0.88)',
          border:         '0.5px solid rgba(200,168,255,0.25)',
          borderRadius:   '16px',
          padding:        'clamp(1.2rem, 3vw, 1.8rem)',
          backdropFilter: 'blur(16px)',
          textAlign:      'center',
        }}>
          <p style={{
            fontFamily:    'sans-serif',
            fontSize:      '0.62rem',
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color:         'rgba(200,168,255,0.45)',
            margin:        '0 0 0.4rem',
          }}>
            {displayProject.drink}
          </p>

          <div style={{
            width:      '28px',
            height:     '1px',
            background: 'rgba(200,168,255,0.3)',
            margin:     '0 auto 0.8rem',
          }} />

          <h2 style={{
            fontFamily:    'serif',
            fontSize:      'clamp(1.4rem, 3.5vw, 2rem)',
            fontWeight:    '400',
            color:         displayProject.featured ? '#FFD8A0' : '#F0E8FF',
            letterSpacing: '0.06em',
            margin:        '0 0 0.8rem',
            textShadow:    '0 0 30px rgba(200,168,255,0.3)',
          }}>
            {displayProject.featured ? '✦ ' : ''}{displayProject.label}
          </h2>

          <p style={{
            fontFamily: 'sans-serif',
            fontSize:   'clamp(0.78rem, 1.6vw, 0.88rem)',
            fontWeight: '300',
            lineHeight: '1.7',
            color:      'rgba(220,200,255,0.7)',
            margin:     '0 0 1rem',
          }}>
            {displayProject.description}
          </p>

          <div style={{
            display:        'flex',
            flexWrap:       'wrap',
            gap:            '5px',
            justifyContent: 'center',
            marginBottom:   '1.2rem',
          }}>
            {displayProject.tech.map(t => (
              <span key={t} style={{
                fontFamily:    'sans-serif',
                fontSize:      '0.68rem',
                padding:       '3px 10px',
                border:        '0.5px solid rgba(200,168,255,0.3)',
                borderRadius:  '20px',
                color:         'rgba(200,168,255,0.7)',
                letterSpacing: '0.08em',
              }}>
                {t}
              </span>
            ))}
          </div>

          <a
            href={displayProject.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              fontFamily:     'sans-serif',
              fontSize:       '0.72rem',
              letterSpacing:  '0.15em',
              textTransform:  'uppercase',
              color:          'rgba(200,168,255,0.7)',
              textDecoration: 'none',
              border:         '0.5px solid rgba(200,168,255,0.35)',
              padding:        '7px 18px',
              borderRadius:   '20px',
              display:        'inline-block',
            }}
          >
            visit project ↗
          </a>
        </div>
      )}
    </div>
  )
}

export default ProjectHoverCard