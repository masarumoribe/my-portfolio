// ArrivalText shows your name and tagline at the start of the journey.
// opacity is driven by Overlay based on scroll progress —
// this component only handles how it looks, not when it shows.

function ArrivalText({ opacity }) {
    return (
      <div style={{
        position:   'absolute',
        bottom:     '12vh',
        left:       '50%',
        transform:  'translateX(-50%)',
        textAlign:  'center',
        opacity,
        // Smooth fade tied to opacity changes
        transition: 'opacity 0.6s ease',
        // Shift up slightly as it fades in for a gentle float-in feel
        translate:  `0 ${(1 - opacity) * 20}px`,
      }}>
  
        {/* Name */}
        <h1 style={{
          fontFamily:    'serif',
          fontSize:      'clamp(2rem, 5vw, 3.5rem)',
          fontWeight:    '400',
          color:         '#F0E8FF',
          letterSpacing: '0.08em',
          margin:        0,
          // Subtle text glow — reinforces the magical atmosphere
          textShadow:    '0 0 40px rgba(200, 168, 255, 0.6)',
        }}>
          Masaru Moribe
        </h1>
  
        {/* Divider */}
        <div style={{
          width:      '40px',
          height:     '1px',
          background: 'rgba(200, 168, 255, 0.4)',
          margin:     '1rem auto',
        }} />
  
        {/* Tagline */}
        <p style={{
          fontFamily:    'sans-serif',
          fontSize:      'clamp(0.85rem, 2vw, 1rem)',
          fontWeight:    '300',
          color:         'rgba(200, 168, 255, 0.8)',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          margin:        0,
        }}>
          I code and make cocktails
        </p>
  
        {/* Scroll hint — fades out as user starts scrolling */}
        <p style={{
          fontFamily:    'sans-serif',
          fontSize:      '0.75rem',
          color:         'rgba(200, 168, 255, 0.35)',
          letterSpacing: '0.15em',
          marginTop:     '3rem',
          opacity:       opacity > 0.8 ? 1 : 0,
          transition:    'opacity 0.4s ease',
        }}>
          scroll to explore ↓
        </p>
  
      </div>
    )
  }
  
  export default ArrivalText