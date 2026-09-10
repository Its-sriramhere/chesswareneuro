export interface Testimonial {
  id: string
  name: string
  country: string
  rating: number
  improvement: string
  quote: string
  level: string
  verified: boolean
}

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Marcus Wei',
    country: '🇺🇸 USA',
    rating: 5,
    improvement: '1400 → 1850',
    quote: 'In just 6 months, my rating jumped 450 points. The personalized training plans and game analysis completely transformed how I approach chess.',
    level: 'Intermediate',
    verified: true,
  },
  {
    id: '2',
    name: 'Sofia Rodriguez',
    country: '🇨🇦 Canada',
    rating: 5,
    improvement: '900 → 1350',
    quote: 'I started as a complete beginner. The structured foundation program made everything click. My coach explains concepts in a way that just makes sense.',
    level: 'Beginner',
    verified: true,
  },
  {
    id: '3',
    name: 'Arjun Patel',
    country: '🇬🇧 UK',
    rating: 5,
    improvement: '1900 → 2200',
    quote: 'The advanced program is next-level. My coach helped me prepare for specific opponents and develop a real tournament mindset.',
    level: 'Competitive',
    verified: true,
  },
  {
    id: '4',
    name: 'Yuki Tanaka',
    country: '🇯🇵 Japan',
    rating: 5,
    improvement: '1200 → 1680',
    quote: 'The technology tools are incredible. Being able to analyze my games with engine insights and track my progress visually keeps me motivated every day.',
    level: 'Intermediate',
    verified: true,
  },
  {
    id: '5',
    name: 'Ahmed Al-Rashid',
    country: '🇦🇪 UAE',
    rating: 5,
    improvement: '1600 → 1950',
    quote: 'What sets Chessware apart is the combination of world-class coaching and cutting-edge technology. The digital classroom experience is seamless.',
    level: 'Intermediate',
    verified: true,
  },
]
