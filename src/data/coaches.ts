export interface Coach {
  id: string
  name: string
  title: string
  fideTitle: string
  ratingLabel: string
  specialization: string[]
  country: string
  avatar: string
  experience: string
  credentials: string[]
  bio: string
}

export const coaches: Coach[] = [
  {
    id: '1',
    name: 'Dr. S. A. Suryakumar',
    title: 'Coaching by Dr. S. A. Suryakumar',
    fideTitle: 'FNI',
    ratingLabel: 'FIDE-RATED',
    specialization: ['International FIDE-Rated Player', 'Structured 1-on-1 & Small Group Coaching', 'Tournament Preparation & Personalised Training'],
    country: '🇮🇳 India',
    avatar: '/coaches/dr-suryakumar.jpg',
    experience: '12+ years coaching',
    credentials: ['PhD — Emotional Intelligence (Europe)', 'MBA'],
    bio: 'Dr. S. A. Suryakumar is a FIDE National Instructor and International FIDE-Rated Player with 12+ years of coaching experience. Combining deep emotional intelligence with structured chess methodology, he personalises every training journey for measurable improvement.',
  },
]