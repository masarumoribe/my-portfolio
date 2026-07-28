function AboutText({ opacity }) {
  const isMobile = window.innerWidth < 500

    return (
      <div style={{
        backgroundColor: isMobile ? 'rgba(36, 28, 69, 0)' : 'rgba(36, 28, 69, 0.5)',
        padding: isMobile ? '0' : '3rem',
        borderRadius:'0.5rem',
        position:   'absolute',
        top:        '50%',
        left:       '50%',
        transform:  'translate(-50%, -50%)',
        textAlign:  'center',
        opacity,
        transition: 'opacity 0.8s ease',
        translate:  `0 ${(1 - opacity) * 20}px`,
        pointerEvents: 'none',
        width:      '90%',
        maxWidth:   '620px',
        zIndex:     10,
      }}>
  
        {/* Section label */}
        <p style={{
          fontFamily:    'sans-serif',
          fontSize:      '0.65rem',
          letterSpacing: '0.3em',
          textTransform: 'uppercase',
          color:         'rgba(200,168,255,0.4)',
          margin:        '0 0 1.2rem',
        }}>
          ✦ about ✦
        </p>
  
        {/* Name */}
        <h2 style={{
          fontFamily:    'serif',
          fontSize:      'clamp(1.4rem, 3.5vw, 2rem)',
          fontWeight:    '400',
          color:         '#F0E8FF',
          letterSpacing: '0.08em',
          margin:        '0 0 1.5rem',
          textShadow:    '0 0 40px rgba(200,168,255,0.5)',
        }}>
          Masaru Moribe
        </h2>
  
        {/* Divider */}
        <div style={{
          width:      '40px',
          height:     '1px',
          background: 'rgba(200,168,255,0.3)',
          margin:     '0 auto 1.8rem',
        }} />
  
        {/* Paragraphs */}
        {[
          'Half Colombian, half Japanese, raised in Bogotá and drawn to Tokyo by curiosity. After graduating in Civil Engineering I packed a bag and crossed the Pacific — barely speaking the language, figuring it out as I went.',
          'I found my footing behind the bar. Ten years in some of Tokyo\'s finest venues — Tokyo American Club, Pullman Tokyo Tamachi — taught me precision, composure under pressure, and how to read a room in seconds.',
          'When COVID emptied the bar, I remembered something from university: I actually loved programming. I started exploring web development quietly, and somewhere between APIs and CSS animations I got hooked. The same instinct that makes a great cocktail — the balance of craft and creativity, logic and aesthetics — turns out to make great web experiences too.',
          'Now I\'m looking for a team that\'ll let me keep learning. Frontend is where I\'m strongest, but I\'m not afraid of the full stack.',
        ].map((text, i) => (
          <p key={i} style={{
            fontFamily:  'sans-serif',
            fontSize:    'clamp(0.82rem, 1.6vw, 0.95rem)',
            fontWeight:  '300',
            lineHeight:  '1.8',
            color:       'rgba(220,200,255,0.72)',
            margin:      '0 0 1.2rem',
            textAlign:   'left',
          }}>
            {text}
          </p>
        ))}
  
        {/* Links */}
        <div style={{
          display:    'flex',
          gap:        '12px',
          justifyContent: 'center',
          marginTop:  '2rem',
          pointerEvents: opacity > 0.5 ? 'all' : 'none',
        }}>
          {[
            { label: 'GitHub', url: 'https://github.com/masarumoribe' },
            { label: 'LinkedIn', url: 'https://linkedin.com/in/masaru-aya-moribe-829a99b9' },
          ].map(link => (
            <a
              key={link.label}
              href={link.url}
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
                padding:        '8px 20px',
                borderRadius:   '20px',
                display:        'inline-block',
                transition:     'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color       = 'rgba(200,168,255,1)'
                e.currentTarget.style.borderColor = 'rgba(200,168,255,0.7)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color       = 'rgba(200,168,255,0.7)'
                e.currentTarget.style.borderColor = 'rgba(200,168,255,0.35)'
              }}
            >
              {link.label} ↗
            </a>
          ))}
        </div>
  
      </div>
    )
  }
  
  export default AboutText