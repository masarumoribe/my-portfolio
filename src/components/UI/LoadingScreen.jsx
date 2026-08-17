import { useEffect, useState } from 'react'
import { useProgress } from '@react-three/drei'

function LoadingScreen() {
  const { progress, active } = useProgress()
  const [visible, setVisible]   = useState(true)
  const [fadeOut, setFadeOut]   = useState(false)

  useEffect(() => {
    // When all assets are loaded and progress hits 100
    // start the fade out sequence
    if (!active && progress === 100) {
      // Small delay so scene has time to render first frame
      const timer = setTimeout(() => {
        setFadeOut(true)
        // Remove from DOM after fade completes
        setTimeout(() => setVisible(false), 800)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [active, progress])

  if (!visible) return null

  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      background:      '#0D0A1A',
      zIndex:          1000,
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      gap:             '2rem',
      opacity:         fadeOut ? 0 : 1,
      transition:      'opacity 0.8s ease',
      pointerEvents:   fadeOut ? 'none' : 'all',
    }}>

      {/* Logo */}
      <img
        src="/favicon.png"
        alt="Masaru Moribe"
        style={{
          width:     '80px',
          height:    '80px',
          opacity:   0.9,
          animation: 'pulse 2s ease-in-out infinite',
        }}
      />

      {/* Name */}
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontFamily:    'serif',
          fontSize:      '1.1rem',
          fontWeight:    '400',
          color:         '#F0E8FF',
          letterSpacing: '0.15em',
          margin:        '0 0 0.4rem',
        }}>
          Masaru Moribe
        </p>
        <p style={{
          fontFamily:    'sans-serif',
          fontSize:      '0.6rem',
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color:         'rgba(200,168,255,0.4)',
          margin:        0,
        }}>
          I code and make cocktails
        </p>
      </div>

      {/* Loading indicator */}
      <div style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        gap:            '0.8rem',
      }}>
        {/* Progress bar */}
        <div style={{
          width:        '120px',
          height:       '1px',
          background:   'rgba(200,168,255,0.15)',
          borderRadius: '1px',
          overflow:     'hidden',
        }}>
          <div style={{
            width:        `${progress}%`,
            height:       '100%',
            background:   'rgba(200,168,255,0.6)',
            borderRadius: '1px',
            transition:   'width 0.3s ease',
          }} />
        </div>

        {/* Percentage */}
        <p style={{
          fontFamily:    'sans-serif',
          fontSize:      '0.6rem',
          letterSpacing: '0.2em',
          color:         'rgba(200,168,255,0.3)',
          margin:        0,
        }}>
          {Math.round(progress)}%
        </p>
      </div>

      {/* Pulse animation keyframes */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: scale(1); }
          50%       { opacity: 1;   transform: scale(1.05); }
        }
      `}</style>

    </div>
  )
}

export default LoadingScreen