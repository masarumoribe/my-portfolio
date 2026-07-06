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
      bottle:      'Tequila',
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
  // Each project becomes a coaster on the bar counter.
  // url is where clicking the coaster will take the visitor.
  
  export const PROJECTS = [
    {
      label:       'barbrain',
      description: 'AI-powered bar management app',
      tech:        ['React', 'Node', 'OpenAI'],
      url:         'https://github.com/masarumoribe',
      featured:    true,   // featured projects get a ✦ mark
    },
    {
      label:       'portfolio',
      description: 'This site',
      tech:        ['React', 'Three.js', 'Rapier'],
      url:         'https://github.com/masarumoribe',
      featured:    false,
    },
    {
      label:       'freelance',
      description: 'Client web projects',
      tech:        ['React', 'TypeScript'],
      url:         'https://github.com/masarumoribe',
      featured:    false,
    },
  ]
  
  // ─── Scene dimensions ───────────────────────────────────────
  // All measurements are in Three.js units (roughly 1 unit = 1 meter).
  // Changing these shifts the proportions of the whole room.
  
  export const SCENE = {
    // Room
    roomWidth:    14,    // total width of the bar room
    roomHeight:   8,     // total height
    roomDepth:    6,     // depth (camera looks along -Z)
  
    // Counter
    counterY:    -1.5,   // vertical position of counter surface
    counterH:     0.25,  // thickness of counter top
  
    // Shelves
    shelf1Y:      1.2,   // top shelf Y position
    shelf2Y:      0.1,   // middle shelf Y position
    shelfW:       8,     // shelf width
    shelfH:       0.12,  // shelf thickness
  
    // Bottles
    bottleH:      0.9,   // height of a bottle
    bottleR:      0.16,  // radius of bottle cylinder
  
    // Coasters
    coasterW:     1.2,   // width of a coaster
    coasterH:     0.08,  // thickness
    coasterD:     0.9,   // depth
  
    // Letters
    letterSize:   0.38,  // size of each MASARU letter cube
    letterGap:    0.48,  // spacing between letters
  
    // Camera
    cameraZ:      7,     // how far back the camera sits
    cameraY:      0.5,   // slight upward tilt target
  }

  import * as THREE from 'three'

// ─── Journey waypoints ──────────────────────────────────────
// Each waypoint is a 3D position the fairy travels through.
// The camera follows slightly behind and above each point.
// Add or adjust points to reshape the path.

export const WAYPOINTS = [
  new THREE.Vector3( 0,    0.5,  8),   // 0.00 — Arrival
  new THREE.Vector3(-2,    1.2,  5),   // 0.14 — moving in
  new THREE.Vector3(-1,    0.8,  2),   // 0.28 — Skills
  new THREE.Vector3( 2,    0.4,  0),   // 0.42 — transition
  new THREE.Vector3( 1,    0.6, -3),   // 0.57 — Projects
  new THREE.Vector3(-1,    1.2, -6),   // 0.71 — About
  new THREE.Vector3( 0,    0.8, -9),   // 0.85 — transition
  new THREE.Vector3( 0.5,  0.5, -12),  // 1.00 — Contact
]

// ─── Moment thresholds ──────────────────────────────────────
// Each moment activates when scroll progress enters its range.
// Components use these to know when to show/hide.

export const MOMENTS = {
  arrival:  { start: 0.0,  end: 0.10 },
  skills:   { start: 0.15, end: 0.60 },
  projects: { start: 0.60, end: 0.75 },
  about:    { start: 0.75, end: 0.88 },
  contact:  { start: 0.88, end: 1.0  },
}