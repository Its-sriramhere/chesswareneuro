import ScrollReveal from '../react-bits/ScrollReveal'
import SpotlightCard from '../react-bits/SpotlightCard'
import { GraduationCap, Cpu, Rocket, ArrowRight } from 'lucide-react'

const ecosystem = [
  {
    id: '01',
    title: 'CHESSWARE NEURO PVT LTD',
    icon: <GraduationCap size={28} />,
    description: 'Personalized online chess coaching for a global audience.',
    action: 'EXPLORE',
    available: true,
    link: 'academy',
  },
  {
    id: '02',
    title: 'SIGARAM64 TECHNOLOGY',
    icon: <Cpu size={28} />,
    description: 'Tamil Nadu\'s first AI-powered chess learning platform — complimentary with enrollment.',
    action: 'DISCOVER',
    available: true,
    href: 'http://sigaram64.com/',
  },
  {
    id: '03',
    title: 'FUTURE PRODUCTS',
    icon: <Rocket size={28} />,
    description: 'New ideas at the intersection of chess, technology, and education.',
    action: 'COMING SOON',
    available: false,
  },
]

export default function EcosystemBento() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="ecosystem" className="relative py-32 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">The Ecosystem</p>
          <h2 className="text-3xl md:text-5xl font-black text-ivory">
            THE CHESSWARE <span className="text-gradient-gold">ECOSYSTEM</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {ecosystem.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.15}>
              <SpotlightCard className="h-full bg-gradient-to-b from-slate/40 to-obsidian-light border border-slate-light rounded-2xl">
                <div className="p-8 flex flex-col h-full min-h-[280px] sm:min-h-[320px]">
                  <span className="text-xs font-mono text-gold mb-6">{item.id}</span>
                  <div className="text-gold mb-5">{item.icon}</div>
                  <h3 className="text-lg md:text-xl font-semibold text-ivory mb-3">{item.title}</h3>
                  <p className="text-sm text-ivory-dim leading-relaxed mb-8 flex-1">
                    {item.description}
                  </p>
                  {item.available ? (
                    item.href ? (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-gold hover:gap-3 transition-all"
                      >
                        {item.action} <ArrowRight size={14} />
                      </a>
                    ) : (
                      <button
                        onClick={() => item.link && scrollTo(item.link)}
                        className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-gold hover:gap-3 transition-all"
                      >
                        {item.action} <ArrowRight size={14} />
                      </button>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-ivory-dim/50">
                      {item.action}
                    </span>
                  )}
                </div>
              </SpotlightCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}