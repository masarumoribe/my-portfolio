import * as THREE from 'three'

// ─── Palette ────────────────────────────────────────────────
// These are the core colours used across the whole scene.
// Tweak these to shift the entire mood of the portfolio.

export const COLORS = {
  // Background / environment
  background:   '#292247',
  fog:          '#0D0A1A',

  // Counter and shelves — brighter for now so we can see them
  counter:      '#4A3060',
  counterTop:   '#6A4A80',
  shelf:        '#4A3868',

  // Walls — slightly lighter than bg so they're visible
  wall:         '#1E1640',

  // Ambient light
  ambient:      '#2A1F4A',
  moonLight:    '#C8C0FF',

  // Lanterns
  lanterns: [
    { body: '#D8B0FF', light: '#9060C0' },
    { body: '#B0C8FF', light: '#5070A8' },
    { body: '#FFB0C8', light: '#A05070' },
  ],
}
  
  // ─── Skills ─────────────────────────────────────────────────
  // Each skill becomes a bottle on the top shelf.
  // color is the bottle glass tint, label is the text on the label.
  // scale is the size of the bottle.
  export const SKILLS = [
    {
      label:       'React',
      description: 'Bright, energetic, and made for good experiences. React brings interfaces to life with reusable components and a fast pace. Like tequila, it\'s the life of the frontend party when used well.',
      bottle:      'Tequila',
      color:       '#3A6A9E',
      scale:       0.9,
    },
    {
      label:       'Node',
      description: 'Reliable, bold, and built to last. Node.js powers the backend with warmth and versatility. Much like a good bourbon, it\'s comfortable on its own but also blends perfectly with everything around it.',
      bottle:      'Bourbon',
      color:       '#4A8A72',
      scale:       1.0,
    },
    {
      label:       'Python',
      description: 'Elegant, readable, dangerously easy to love. Python is the scotch of programming — aged, refined, and makes you look like you know what you\'re doing.',
      bottle:      'Scotch',
      color:       '#7B6AAE',
      scale:       1.1,
    },
    {
      label:       'JS',
      description: 'Versatile with endless possibilities. Gin can become almost any cocktail, and JavaScript can become almost any application. Sometimes a little unpredictable, but incredibly rewarding in the right hands.',
      bottle:      'Gin',
      color:       '#A06040',
      scale:       0.9,
    },
    {
      label:       'HTML',
      description: 'The foundation of every great mix. HTML provides the structure everything else depends on. Like vodka, it may not steal the spotlight, but almost nothing works without it.',
      bottle:      'Vodka',
      color:       '#884468',
      scale:       1.05,
    },
    {
      label:       'CSS',
      description: 'Full of character and unmistakable style. CSS transforms plain layouts into memorable experiences. Just as rum adds personality to a cocktail, CSS gives every website its unique look and feel.',
      bottle:      'Rum',
      color:       '#887230',
      scale:       0.95,
    },
  ]
  
  // ─── Projects ───────────────────────────────────────────────
  
  export const PROJECTS = [
    {
      label:       'BarBrain',
      menuTag: 'Weekly Special',
      description: 'AI-powered bar management app. Inventory tracking, cocktail CRUD, and a Claude-powered assistant that knows your whole menu.',
      tech:        ['React', 'FastAPI', 'PostgreSQL', 'Claude API'],
      url:         'https://github.com/masarumoribe/barbrain',
      featured:    true,
      drink:       'Manhattan',
    },
    {
      label:       'Portfolio',
      menuTag: 'House Recipe',
      description: 'The very thing you\'re looking at. A scroll-driven 3D journey built with React Three Fiber, a fairy orb, and too much caffeine.',
      tech:        ['React', 'Three.js', 'R3F', 'Rapier'],
      url:         'https://github.com/masarumoribe/my-portfolio',
      featured:    false,
      drink:       'Negroni',
    },
    {
      label:       'Chika Hula',
      menuTag: 'Our Tropical Twist',
      description: 'Website for a hula dance school in Tokyo. Clean, warm, and built to make visitors feel the aloha spirit before they even walk in.',
      tech:        ['React', 'Vite'],
      url:         'https://chikahula.com',
      featured:    false,
      drink:       'Pina Colada',
    },
    {
      label:       'The Sarau',
      menuTag: 'For Art Lovers',
      description: 'Digital home for an art curation collective. Designed to let the artwork speak — minimal interface, maximum impact.',
      tech:        ['WordPress', 'Elementor'],
      url:         'https://thesarau.me',
      featured:    false,
      drink:       'Caipirinha',
    },
  ]

// ─── Journey waypoints ──────────────────────────────────────
// Each waypoint is a 3D position the fairy travels through.
// The camera follows slightly behind and above each point.
// Add or adjust points to reshape the path.

export const WAYPOINTS = [
  new THREE.Vector3( 0,    0.5,  20),   // 0.00 — Arrival — start far in front
  new THREE.Vector3(-4,    1.2,  14),   // moving in
  new THREE.Vector3(-2,    0.8,   8),   // Skills start
  new THREE.Vector3( 0,    0.6,   2),   // Skills middle
  new THREE.Vector3( 3,    0.4,  -4),   // Skills end
  new THREE.Vector3( 0, 0.4, -10),   // transition — explosion
  new THREE.Vector3( 1,    0.8, -16),   // Projects
  new THREE.Vector3( 2,    1.0, -22),   // Projects middle
  new THREE.Vector3( 0,    0.6, -28),   // About
  new THREE.Vector3(-1,    0.8, -34),   // Contact
]

// ─── Moment thresholds ──────────────────────────────────────
// Total scroll distance in pixels — increase this to make the whole
// experience longer. 10000 = user needs to scroll 10000px to complete journey.
export const TOTAL_SCROLL = 28000

// Moments are now defined in pixels instead of 0–1 fractions.
// This makes it much easier to reason about timing —
// "skills lasts 3000px of scrolling" is intuitive.
export const MOMENTS = {
  arrival:    { start: 0,     end: 2000  },
  skills:     { start: 4000,  end: 15000  },
  transition: { start: 16000,  end: 19000  },
  projects:   { start: 19200,  end: 21000 },
  about:      { start: 23000, end: 25000 },
  contact:    { start: 27000, end: 28000 },
}

// Helper — converts a pixel value to 0–1 progress
export const toProgress = (pixels) => pixels / TOTAL_SCROLL

// Calculated after WAYPOINTS is defined
const _curve = new THREE.CatmullRomCurve3(WAYPOINTS)
export const LANTERN_PROGRESS = toProgress(MOMENTS.contact.start + 500)
export const LANTERN_WORLD_POS = _curve.getPointAt(LANTERN_PROGRESS)