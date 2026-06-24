// ─── Palette ────────────────────────────────────────────────
// These are the core colours used across the whole scene.
// Tweak these to shift the entire mood of the portfolio.

export const COLORS = {
  // Background / environment
  background:   '#0D0A1A',
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
  
  export const SKILLS = [
    { label: 'React',   color: '#3A6A9E', scale: 1.0,  yOffset: 0    },
    { label: 'Node',    color: '#4A8A72', scale: 0.85, yOffset: -0.05 },
    { label: 'Python',  color: '#7B6AAE', scale: 1.1,  yOffset: 0.05 },
    { label: 'JS',      color: '#A06040', scale: 0.9,  yOffset: 0    },
    { label: 'HTML',     color: '#884468', scale: 1.05, yOffset: 2 },
    { label: 'CSS',     color: '#887230', scale: 0.95, yOffset: 0    },
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