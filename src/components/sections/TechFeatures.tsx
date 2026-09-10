import ScrollReveal from '../react-bits/ScrollReveal'
import TiltedCard from '../react-bits/TiltedCard'
import { BrainCircuit, Languages, BookOpen, Sparkles, Target, BarChart3, BadgeCheck } from 'lucide-react'

const features = [
  {
    icon: <BrainCircuit size={22} />,
    title: 'AI-POWERED LEARNING',
    desc: 'Intelligent coaching engine adapts to every move you play.',
  },
  {
    icon: <Languages size={22} />,
    title: 'MULTILINGUAL INTERACTIVE LEARNING',
    desc: 'Learn in your language with interactive, engaging lessons.',
  },
  {
    icon: <BookOpen size={22} />,
    title: 'STRUCTURED CURRICULUM',
    desc: 'Built on Bloom\'s Taxonomy for a proven learning hierarchy.',
  },
  {
    icon: <Sparkles size={22} />,
    title: 'ADAPTIVE LEARNING',
    desc: 'Difficulty adjusts in real time to your performance level.',
  },
  {
    icon: <Target size={22} />,
    title: 'INTERACTIVE PRACTICE',
    desc: 'Hands-on puzzles and sparring matched to your weaknesses.',
  },
  {
    icon: <BarChart3 size={22} />,
    title: 'PERFORMANCE ANALYTICS',
    desc: 'Track accuracy, rating growth, and skill mastery over time.',
  },
]

export default function TechFeatures() {
  return (
    <section id="technology" className="relative py-32 bg-obsidian/60">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/40 via-transparent to-obsidian/40 pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">AI-Powered Learning</p>
          <h2 className="text-3xl md:text-5xl font-black text-ivory mb-6">
            INTRODUCING <span className="text-gradient-gold">SIGARAM64</span>
          </h2>
          <p className="text-base md:text-lg text-ivory-dim mb-2">
            Premium Chess Learning Experience — Powered by AI
          </p>
          <p className="text-sm font-mono text-gold tracking-widest">
            TAMIL NADU&apos;S FIRST AI-POWERED CHESS LEARNING PLATFORM
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
          {features.map((f, i) => (
            <ScrollReveal key={f.title} delay={i * 0.1}>
              <TiltedCard intensity={10} className="h-full">
                <div className="h-full bg-obsidian-light/60 border border-slate-light rounded-2xl p-7 hover:border-gold/40 transition-colors duration-300">
                  <div className="w-14 h-14 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold mb-5">
                    {f.icon}
                  </div>
                  <h3 className="font-semibold text-ivory mb-3">{f.title}</h3>
                  <p className="text-xs text-ivory-dim leading-relaxed">{f.desc}</p>
                </div>
              </TiltedCard>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={0.2}>
          <div className="relative rounded-2xl border border-gold/30 bg-gradient-to-r from-slate/40 via-obsidian-light to-slate/40 p-8 md:p-10 text-center overflow-hidden glow-gold">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <div className="inline-flex items-center gap-2 text-[10px] font-mono tracking-widest text-gold bg-gold/10 border border-gold/40 rounded-full px-4 py-1.5 mb-5">
              <BadgeCheck size={14} /> COMPLIMENTARY WITH ENROLLMENT
            </div>
            <h3 className="text-2xl md:text-3xl font-black text-ivory mb-3">
              Every Chessware Neuro Student Gets SIGARAM64
            </h3>
            <p className="text-sm text-ivory-dim mb-6">
              Full access at no extra cost.
            </p>
            <div className="inline-flex items-center gap-2 text-sm font-mono text-gold border border-gold/40 rounded-full px-6 py-3">
              Regular value: <span className="font-bold">₹1,350/month per student</span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}