// SkillCard shows a floating UI panel when a skill bottle is active.
// It fades in when a bottle is visible and fades out when it leaves.
// Props:
//   skill   — the active skill object from config, or null if none active
//   visible — whether to show the card

function SkillCard({ skill, visible }) {
    return (
      <div style={{
        backgroundColor: 'rgba(36, 28, 69, 0.5)',
        padding: '2rem',
        borderRadius: '0.5rem',
        position:   'fixed',
        bottom:     '10vh',
        left:       '50%',
        transform:  'translateX(-50%)',
        textAlign:  'center',
        // Fade and float in when visible
        opacity:    visible ? 1 : 0,
        translate:  `0 ${visible ? '0px' : '20px'}`,
        transition: 'opacity 0.5s ease, translate 0.5s ease',
        pointerEvents: 'none',
        zIndex:     10,
        // Max width so it stays readable on all screen sizes
        width:      '90%',
        maxWidth:   '480px',
      }}>
  
        {skill && (
          <>
            {/* Skill title */}
            <p style={{
              fontFamily:    'sans-serif',
              fontSize:      '0.7rem',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color:         'rgba(200, 168, 255, 0.5)',
              margin:        '0 0 0.4rem',
            }}>
              skill
            </p>
  
            <h2 style={{
              fontFamily:    'serif',
              fontSize:      'clamp(1.8rem, 4vw, 2.8rem)',
              fontWeight:    '400',
              color:         '#F0E8FF',
              letterSpacing: '0.06em',
              margin:        '0 0 0.3rem',
              textShadow:    '0 0 30px rgba(200, 168, 255, 0.5)',
            }}>
              {skill.label}
            </h2>
  
            {/* Bottle type tag */}
            <p style={{
              fontFamily:    'sans-serif',
              fontSize:      '0.72rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color:         'rgba(200, 168, 255, 0.45)',
              margin:        '0 0 1.2rem',
            }}>
              ✦ {skill.bottle} ✦
            </p>
  
            {/* Divider */}
            <div style={{
              width:      '32px',
              height:     '1px',
              background: 'rgba(200, 168, 255, 0.3)',
              margin:     '0 auto 1.2rem',
            }} />
  
            {/* Description */}
            <p style={{
              fontFamily:  'sans-serif',
              fontSize:    'clamp(0.8rem, 1.5vw, 0.9rem)',
              fontWeight:  '300',
              lineHeight:  '1.7',
              color:       'rgba(220, 200, 255, 0.65)',
              margin:      0,
            }}>
              {skill.description}
            </p>
          </>
        )}
  
      </div>
    )
  }
  
  export default SkillCard