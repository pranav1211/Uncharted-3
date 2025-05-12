// Game region definitions
export const REGIONS = [
  { id: 'region1', x: 10, y: 50, width: 25, height: 20 },
  { id: 'region2', x: 40, y: 10, width: 25, height: 20 },
  { id: 'region3', x: 5, y: 35, width: 22, height: 32 },
  { id: 'region4', x: 43, y: 10, width: 22, height: 32 },
  { id: 'region5', x: 75, y: 60, width: 22, height: 32 },
  { id: 'region6', x: 5, y: 75, width: 25, height: 20 },
  { id: 'region7', x: 73, y: 10, width: 25, height: 20 },
  { id: 'region8', x: 70, y: 40, width: 25, height: 20 },
];

// Hover-to-Reveal Zones (Gravitational Zones)
export const HOVER_ZONES = [
  { 
    id: 'mercury', 
    region: 'region1',
    x: 5, 
    y: 15, 
    width: 10, 
    height: 10, 
    tooltip: 'Mercury', 
    sequence: 0,
    requiredLens: 'default'  // Visible with default lens
  },
  { 
    id: 'venus', 
    region: 'region1',
    x: 20, 
    y: 17, 
    width: 10, 
    height: 10, 
    tooltip: 'Venus', 
    sequence: 1,
    requiredLens: 'default'  // Visible with default lens
  },
  { 
    id: 'earth', 
    region: 'region1',
    x: 35, 
    y: 13, 
    width: 10, 
    height: 10, 
    tooltip: 'Earth', 
    sequence: 2,
    requiredLens: 'default'  // Visible with default lens
  },
  { 
    id: 'mars', 
    region: 'region2',
    x: 55, 
    y: 45, 
    width: 10, 
    height: 10, 
    tooltip: 'Mars', 
    sequence: 3,
    requiredLens: 'default'  // Visible with default lens
  },
  { 
    id: 'jupiter', 
    region: 'region2',
    x: 30, 
    y: 45, 
    width: 10, 
    height: 10, 
    tooltip: 'Jupiter', 
    sequence: 4,
    requiredLens: 'default'  // Visible with default lens
  },
  { 
    id: 'saturn', 
    region: 'region1',
    x: 65, 
    y: 15, 
    width: 10, 
    height: 10, 
    tooltip: 'Saturn', 
    sequence: 5,
    requiredLens: 'uv'  // Only visible with UV lens
  },
  { 
    id: 'uranus', 
    region: 'region2',
    x: 75, 
    y: 20, 
    width: 10, 
    height: 10, 
    tooltip: 'Uranus', 
    sequence: 6,
    requiredLens: 'uv'  // Only visible with UV lens
  },
  { 
    id: 'neptune', 
    region: 'region2',
    x: 90, 
    y: 15, 
    width: 10, 
    height: 10, 
    tooltip: 'Neptune', 
    sequence: 7,
    requiredLens: 'uv'  // Only visible with UV lens
  },
  { 
    id: 'pluto', 
    region: 'region2',
    x: 90, 
    y: 65, 
    width: 10, 
    height: 10, 
    tooltip: 'Pluto', 
    sequence: 8,
    requiredLens: 'uv'  // Only visible with UV lens
  },
];

// Riddles that replace Ink Zones
export const RIDDLE_ZONES = [
  { 
    id: 'riddle1', 
    region: 'region4',
    x: 43, 
    y: 10, 
    width: 22, 
    height: 32, 
    riddle: "I am a traveler through space and time, though I appear only in the mind. In my presence, gravity bends, and the very fabric of space-time ends. What am I?", 
    answer: "black hole",
    requiredPlanets: ['mercury', 'venus', 'earth', 'mars', 'jupiter','saturn'] // Second after 5 planets

  },
  { 
    id: 'riddle2', 
    region: 'region5',
    x: 75, 
    y: 60, 
    width: 22, 
    height: 32, 
    riddle: "I am not a star, but I light up the sky. I'm a traveler from beyond, zooming by. What am I?", 
    answer: "comet",
    requiredPlanets: ['mercury', 'venus', 'earth'] // First riddle appears after 3 inner planets

  },
  { 
    id: 'riddle3', 
    region: 'region3',
    x: 5, 
    y: 35, 
    width: 22, 
    height: 32, 
    riddle: "I'm a big rock in space, and I orbit the Sun. Sometimes I'm near Earth, making people run. What am I?", 
    answer: "asteroid",
    requiredPlanets: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'neptune','pluto'] // After 7 planets
  },
];

// Keep the ink zones for backward compatibility but they won't be used
export const INK_ZONES = [
  { 
    id: 'ink1', 
    region: 'region4',
    x: 60, 
    y: 15, 
    width: 15, 
    height: 10, 
    message: 'The hunter watches from', 
    requiredPlanets: ['mercury', 'venus', 'earth'] // First ink zone appears after 3 inner planets
  },
  { 
    id: 'ink2', 
    region: 'region5',
    x: 45, 
    y: 45, 
    width: 15, 
    height: 10, 
    message: 'Belt of three stars', 
    requiredPlanets: ['mercury', 'venus', 'earth', 'mars', 'jupiter','saturn'] // Second after 6 planets
  },
  { 
    id: 'ink3', 
    region: 'region3',
    x: 75, 
    y: 45, 
    width: 15, 
    height: 10, 
    message: 'Ancient ', 
    requiredPlanets: ['mercury', 'venus', 'earth', 'mars', 'jupiter', 'saturn', 'uranus','neptune','pluto'] // All planets
  },
];

// Lens-uncoverable regions
export const LENS_ZONES = [
  {
    id: 'lens1',
    region: 'region6',
    x: 10,
    y: 80,
    width: 15,
    height: 10,
    requiredLens: 'uv',
    message: 'I am round and bright in the dark of the night,'
  },
  {
    id: 'lens2',
    region: 'region7',
    x: 78,
    y: 15,
    width: 15,
    height: 10,
    requiredLens: 'uv',
    message: 'Though I borrow my glow, I am a beautiful sight.What am I?'
  }
];

// Final answer for the text challenge
export const TEXT_CHALLENGE_ANSWER = 'MOON';