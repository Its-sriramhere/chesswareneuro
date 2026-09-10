import ScrollReveal from '../react-bits/ScrollReveal'
import { UserRound, Users, BookMarked, Gauge, TrendingUp } from 'lucide-react'

const benefits = [
  {
    icon: <UserRound size={22} />,
    title: 'PERSONAL 1-ON-1 & SMALL GROUPS',
    desc: 'Choose fully personal coaching or a focused small group — both powered by personalized attention.',
  },
  {
    icon: <Users size={22} />,
    title: 'MAXIMUM 4 STUDENTS',
    desc: 'Every group is capped at 4 students so nobody gets left behind.',
  },
  {
    icon: <BookMarked size={22} />,
    title: 'STRUCTURED CURRICULUM',
    desc: 'A clear, level-based curriculum — every level has a defined path forward.',
  },
  {
    icon: <Gauge size={22} />,
    title: 'PERSONALISED LEARNING',
    desc: 'Learn at your own pace with training adapted to your strengths and weaknesses.',
  },
  {
    icon: <TrendingUp size={22} />,
    title: 'PROGRESS TRACKED',
    desc: 'Monitor your rating and progress with transparent, data-driven feedback.',
  },
]

export default function WhyChessware() {
  return (
    <section id="why" className="relative py-32 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">Why Us</p>
          <h2 className="text-3xl md:text-5xl font-black text-ivory">
            WHY CHESSWARE <span className="text-gradient-gold">NEURO?</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b, i) => (
            <ScrollReveal key={b.title} delay={i * 0.1}>
              <div className="h-full bg-gradient-to-b from-slate/40 to-obsidian-light border border-slate-light rounded-2xl p-8 hover:border-gold/40 transition-colors duration-300 group">
                <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-5 group-hover:scale-110 transition-transform">
                  {b.icon}
                </div>
                <h3 className="font-bold text-ivory mb-3">{b.title}</h3>
                <p className="text-xs text-ivory-dim leading-relaxed">{b.desc}</p>
              </div>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={benefits.length * 0.1}>
            <div className="h-full rounded-2xl border border-gold/30 bg-obsidian-light glow-gold p-8 flex flex-col items-center justify-center text-center">
              <img src="/logo/loading.png" alt="Chessware Neuro" className="h-12 w-auto object-contain mb-3" />
              <p className="text-lg font-bold text-ivory mb-2">Ready to train?</p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
                className="mt-2 text-xs font-mono tracking-widest text-gold border border-gold/40 rounded-lg px-6 py-3 hover:bg-gold hover:text-obsidian transition-colors"
              >
                BOOK A FREE TRIAL
              </button>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}