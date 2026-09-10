export interface Program {
  id: string
  level: 'foundation' | 'advanced'
  tier: string
  title: string
  ratingBand: string
  description: string
  topics: string[]
  price1on1: number
  priceGroup: number
  session1on1: string
  sessionGroup: string
  maxGroup: number
  recommended?: boolean
}

export const programs: Program[] = [
  {
    id: 'foundation',
    level: 'foundation',
    tier: '01',
    title: 'BUILD YOUR FOUNDATION',
    ratingBand: 'UP TO 1500',
    description: 'Learn the fundamentals, tactical patterns, and core principles of chess.',
    topics: [
      'Piece movement & board fundamentals',
      'Basic tactical patterns (forks, pins, skewers)',
      'Opening principles & common setups',
      'Simple endgame techniques',
      'Game analysis basics',
    ],
    price1on1: 150,
    priceGroup: 70,
    session1on1: '60-minute sessions',
    sessionGroup: '60-minute sessions',
    maxGroup: 4,
  },
  {
    id: 'advanced',
    level: 'advanced',
    tier: '02',
    title: 'PLAY TO COMPETE',
    ratingBand: '1500+',
    description: 'Deepen tactical awareness, positional strategy, and elite tournament preparation.',
    topics: [
      'Advanced tactics, calculation & visualization',
      'Tournament preparation & psychology',
      'Deep opening theory & repertoire building',
      'Complex endgame mastery',
      'Opponent analysis & performance optimization',
    ],
    price1on1: 210,
    priceGroup: 95,
    session1on1: '90-minute sessions',
    sessionGroup: '60-minute sessions',
    maxGroup: 4,
    recommended: true,
  },
]

export const classDetails = [
  '60-minute sessions',
  'Advanced 1-on-1: 90 minutes',
  'Small groups — maximum 4 students',
]

export const schedule = [
  '4 classes per month',
  '1 class per week',
  'Paid in advance',
]