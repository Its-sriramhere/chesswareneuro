import ScrollReveal from '../react-bits/ScrollReveal'

const columns = [
  {
    title: 'COMPANY',
    links: ['About Us', 'Careers', 'Press', 'Partners', 'Contact'],
  },
  {
    title: 'ACADEMY',
    links: ['Programs', 'Coaches', 'Pricing', 'Level Test', 'Free Trial'],
  },
  {
    title: 'TECHNOLOGY',
    links: ['SIGARAM64', 'AI Learning', 'Adaptive Training', 'Progress Analytics'],
  },
  {
    title: 'LEGAL',
    links: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Refund Policy'],
  },
]

const socials = ['X', 'LinkedIn', 'Instagram', 'YouTube']

const contact = {
  title: 'CONTACT',
  email: 'chesswareneuropvttd@gmail.com',
  phone: '+91 75981 11855',
}

export default function Footer() {
  const year = new Date().getFullYear()

  const scrollToSection = (label: string) => {
    const map: Record<string, string> = {
      Programs: 'academy',
      Coaches: 'coaches',
      Pricing: 'pricing',
      'Level Test': 'pricing',
      'Free Trial': 'booking',
      'Game Analysis': 'technology',
      SIGARAM64: 'technology',
      'AI Learning': 'technology',
      'Adaptive Training': 'technology',
      'Progress Analytics': 'technology',
      'About Us': 'company',
      Contact: 'why',
    }
    const id = map[label]
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer id="contact" className="relative bg-obsidian/70 border-t border-slate-light">
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="max-w-6xl mx-auto px-6 py-20">
        <ScrollReveal className="text-center mb-16">
          <img src="/logo/loading.png" alt="Chessware Neuro" className="h-12 w-auto object-contain mx-auto mb-4" />
          <h3 className="text-2xl md:text-4xl font-black text-ivory">
            CHESSWARE <span className="text-gradient-gold">NEURO</span>
          </h3>
          <p className="text-xs md:text-sm font-mono tracking-[0.3em] text-gold mt-3">
            BUILDING THE FUTURE OF CHESS.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-mono tracking-widest text-gold mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <button
                      onClick={() => scrollToSection(link)}
                      className="text-sm text-ivory-dim hover:text-gold transition-colors"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div>
            <h4 className="text-xs font-mono tracking-widest text-gold mb-5">{contact.title}</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="text-sm text-ivory-dim hover:text-gold transition-colors break-all"
                >
                  {contact.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${contact.phone.replace(/\s/g, '')}`}
                  className="text-sm text-ivory-dim hover:text-gold transition-colors"
                >
                  {contact.phone}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 border-t border-slate-light/50">
          <div className="flex items-center gap-6">
            {socials.map((s) => (
              <button
                key={s}
                className="text-xs font-mono tracking-widest text-ivory-dim hover:text-gold transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
          <p className="text-xs text-ivory-dim text-center">
            © {year} Chessware Neuro. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}