import ScrollReveal from '../react-bits/ScrollReveal'
import TiltedCard from '../react-bits/TiltedCard'
import CountUp from '../react-bits/CountUp'
import BlurText from '../react-bits/BlurText'
import { programs } from '../../data/programs'
import { Users, Clock } from 'lucide-react'

export default function AcademyPrograms() {
  return (
    <section id="academy" className="relative py-32 bg-obsidian/60">
      <div className="absolute inset-0 bg-noise pointer-events-none" />
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="w-px h-4 bg-gold" />
            <span className="text-xs tracking-[0.3em] text-gold font-mono uppercase">
              Chessware Neuro Academy
            </span>
            <span className="w-px h-4 bg-gold" />
          </div>
          <h2 className="text-4xl md:text-7xl font-black text-ivory leading-tight mb-6">
            MEET YOUR NEXT <span className="text-gradient-gold">LEVEL.</span>
          </h2>
          <BlurText
            text="Personalized online chess coaching designed around your level, goals, and schedule."
            delay={40}
            stepDuration={0.3}
            className="text-base md:text-lg text-ivory-dim max-w-2xl mx-auto"
          />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {programs.map((program, i) => (
            <ScrollReveal key={program.id} delay={i * 0.15}>
              <TiltedCard className="h-full">
                <div className="h-full bg-gradient-to-b from-slate/50 to-obsidian-light border border-slate-light rounded-2xl p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono text-gold">{program.tier}</span>
                    {program.recommended && (
                      <span className="text-[10px] font-mono tracking-widest text-gold bg-gold/10 px-3 py-1 rounded-full border border-gold/30">
                        RECOMMENDED
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-bold text-ivory mb-2">{program.title}</h3>
                  <p className="text-xs font-mono tracking-widest text-gold mb-3">
                    LEVEL — {program.ratingBand}
                  </p>
                  <p className="text-sm text-ivory-dim leading-relaxed mb-8">{program.description}</p>

                  <ul className="space-y-3 mb-8 flex-1">
                    {program.topics.map((topic) => (
                      <li key={topic} className="flex items-start gap-3 text-sm text-ivory/80">
                        <span className="text-gold mt-1">▸</span>
                        {topic}
                      </li>
                    ))}
                  </ul>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-obsidian/60 border border-slate-light rounded-xl p-4 text-center">
                      <span className="block text-[10px] font-mono tracking-widest text-ivory-dim mb-1">1-ON-1</span>
                      <CountUp from={0} to={program.price1on1} prefix="$" className="block text-2xl font-bold text-gold" />
                      <span className="block text-[10px] text-ivory-dim">/ month</span>
                    </div>
                    <div className="bg-obsidian/60 border border-slate-light rounded-xl p-4 text-center">
                      <span className="block text-[10px] font-mono tracking-widest text-ivory-dim mb-1">GROUP</span>
                      <CountUp from={0} to={program.priceGroup} prefix="$" className="block text-2xl font-bold text-gold" />
                      <span className="block text-[10px] text-ivory-dim">/ month</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-ivory-dim mb-6">
                    <span className="flex items-center gap-1.5">
                      <Clock size={13} className="text-gold" /> {i === 0 ? program.session1on1 : `${program.session1on1} / ${program.sessionGroup}`}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={13} className="text-gold" /> Max {program.maxGroup}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-6 border-t border-slate-light">
                    <span className="text-[10px] font-mono text-ivory-dim">
                      <CountUp from={0} to={4} suffix=" CLASSES / MONTH" />
                    </span>
                    <button
                      onClick={() =>
                        window.dispatchEvent(new CustomEvent('open-booking', { detail: { program: program.level } }))
                      }
                      className="text-xs font-mono tracking-widest text-ivory hover:text-gold transition-colors inline-flex items-center gap-1"
                    >
                      START →
                    </button>
                  </div>
                </div>
              </TiltedCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}