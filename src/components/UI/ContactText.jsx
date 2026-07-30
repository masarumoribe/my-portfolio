import { label } from "three/tsl"

function ContactText({ opacity }) {
    return (
      <div style={{
        backgroundColor: 'rgba(36, 28, 69, 0.5)',
        padding: '3rem',
        borderRadius: '0.5rem',
        position:      'absolute',
        bottom:        '20vh',
        left:          '50%',
        transform:     'translateX(-50%)',
        textAlign:     'center',
        opacity,
        transition:    'opacity 0.8s ease',
        translate:     `0 ${(1 - opacity) * 20}px`,
        pointerEvents: opacity > 0.5 ? 'all' : 'none',
        width:         '90%',
        maxWidth:      '480px',
      }}>
  
        {/* Section label */}
        <p style={{
          fontFamily:    'sans-serif',
          fontSize:      '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(200,168,255,0.4)',
          margin:        '0 0 1rem',
        }}>
          ✦ last call ✦
        </p>
  
        <h2 style={{
          fontFamily:    'serif',
          fontSize:      'clamp(1.6rem, 4vw, 2.4rem)',
          fontWeight:    '400',
          color:         '#F0E8FF',
          letterSpacing: '0.06em',
          margin:        '0 0 0.5rem',
          textShadow:    '0 0 40px rgba(200,168,255,0.5)',
        }}>
          Let's work together
        </h2>
  
        <div style={{
          width:      '32px',
          height:     '1px',
          background: 'rgba(200,168,255,0.3)',
          margin:     '0 auto 1.5rem',
        }} />
  
        <p style={{
          fontFamily:  'sans-serif',
          fontSize:    'clamp(0.82rem, 1.6vw, 0.92rem)',
          fontWeight:  '300',
          lineHeight:  '1.7',
          color:       'rgba(220,200,255,0.65)',
          margin:      '0 0 2rem',
        }}>
          I'm looking for a developer role — frontend, fullstack, or anywhere
          a bartender's instincts and a developer's curiosity might be useful.
        </p>
  
        {/* Contact links */}
        <div style={{
          display:        'flex',
          gap:            '10px',
          justifyContent: 'center',
          flexWrap:       'wrap',
        }}>
          {[
            { label: 'Email',    url: 'mailto:masaru.moribe1@gmail.com' },
            { label: 'GitHub',   url: 'https://github.com/masarumoribe' },
            { label: 'LinkedIn', url: 'https://linkedin.com/in/masaru-aya-moribe-829a99b9' },
            { label: 'Resume',  url: '/masaru-moribe-cv.pdf', download: true },
          ].map(link => (
            
            <a
              key={link.label}
              href={link.url}
              target={link.label === 'Email' ? '_self' : '_blank'}
              download={link.download ? 'Masaru_Moribe_CV.pdf' : undefined}
              rel="noopener noreferrer"
              style={{
                fontFamily:     'sans-serif',
                fontSize:       '0.72rem',
                letterSpacing:  '0.15em',
                textTransform:  'uppercase',
                color:          'rgba(200,168,255,0.7)',
                textDecoration: 'none',
                border:         '0.5px solid rgba(200,168,255,0.35)',
                padding:        '8px 20px',
                borderRadius:   '20px',
                display:        'inline-block',
                transition:     'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color       = 'rgba(200,168,255,1)'
                e.currentTarget.style.borderColor = 'rgba(200,168,255,0.7)'
                e.currentTarget.style.background  = 'rgba(200,168,255,0.08)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color       = 'rgba(200,168,255,0.7)'
                e.currentTarget.style.borderColor = 'rgba(200,168,255,0.35)'
                e.currentTarget.style.background  = 'transparent'
              }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
  
      </div>
    )
  }
  
  export default ContactText