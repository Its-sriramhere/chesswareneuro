import { motion } from 'framer-motion'
import ScrollReveal from '../react-bits/ScrollReveal'
import SplitFlapText from '../react-bits/SplitFlapText'
import BlurText from '../react-bits/BlurText'

const formulaParts = [
  { label: 'CHESS', symbol: '+', className: 'text-ivory' },
  { label: 'TECHNOLOGY', symbol: '+', className: 'text-ivory-dim' },
  { label: 'EDUCATION', symbol: '=', className: 'text-ivory-dim' },
  { label: 'CHESSWARE NEURO', symbol: '', className: 'text-gradient-gold font-black' },
]

const flapFontSize = {
  '--split-flap-font-size': 'clamp(14px, 2.1vw, 32px)',
} as React.CSSProperties

export default function CompanyIntro() {
  return (
    <section id="company" className="relative py-32 bg-obsidian/60 overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 bg-gold/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <ScrollReveal>
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-6">Who We Are</p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="hidden md:flex flex-col items-center gap-8 mb-12">
            <SplitFlapText
              words={['WE ARE BUILDING MORE THAN A', 'WE ARE SHAPING THE NEXT GEN']}
              tileColor="#15181F"
              textColor="#F4F4F6"
              padTo={27}
              fontSize={32}
              style={flapFontSize}
            />
            <SplitFlapText
              words={['CHESS ACADEMY.', 'ONE MOVE AT A TIME.']}
              tileColor="#15181F"
              textColor="#E8C94A"
              padTo={17}
              fontSize={32}
              style={flapFontSize}
            />
          </div>
          <h2 className="md:hidden text-3xl md:text-6xl font-black text-ivory leading-tight mb-10">
            We Are Building More Than a{' '}
            <span className="text-gradient-gold">Chess Academy.</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <BlurText
            text="Chessware Neuro is building a technology-driven ecosystem for chess education, training, and digital experiences. We combine the timeless thinking of chess with modern technology and AI to make high-quality learning more accessible to players around the world."
            delay={30}
            stepDuration={0.3}
            className="text-base md:text-lg text-ivory-dim leading-relaxed max-w-2xl mx-auto mb-16"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 font-mono text-lg md:text-2xl">
            {formulaParts.map((part, i) => (
              <div key={part.label} className="flex items-center gap-3 md:gap-5">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: i * 0.15 }}
                  className={`px-4 md:px-6 py-3 rounded-lg border border-slate-light bg-obsidian-light ${part.className}`}
                >
                  {part.label}
                </motion.span>
                {part.symbol && (
                  <span className="text-gold text-xl md:text-3xl">{part.symbol}</span>
                )}
              </div>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}

