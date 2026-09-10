import { useState } from 'react'
import ScrollReveal from '../react-bits/ScrollReveal'
import SpotlightCard from '../react-bits/SpotlightCard'
import StrokeText from '../react-bits/StrokeText'
import CountUp from '../react-bits/CountUp'
import { coaches } from '../../data/coaches'
import { X, Star, GraduationCap, Trophy } from 'lucide-react'

export default function CoachDirectory() {
  const [selected, setSelected] = useState<number | null>(null)
  const coach = coaches[0]

  const titleColors: Record<string, string> = {
    GM: 'text-gold border-gold/40',
    FNI: 'text-gold border-gold/40',
    IM: 'text-ivory border-ivory/30',
    FM: 'text-ivory-dim border-ivory-dim/30',
    WIM: 'text-ivory border-ivory/30',
    WGM: 'text-gold border-gold/40',
  }

  const initials = coach.name
    .replace('Dr. ', '')
    .split(' ')
    .filter((w) => w && w !== '.')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')

  return (
    <section id="coaches" className="relative py-32 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-6">Coach Profile</p>
          <StrokeText
            text="THE MIND BEHIND THE MOVES."
            strokeColor="#D4AF37"
            fillColor="#F4F4F6"
            strokeWidth={1.8}
            drawDuration={1.8}
            fillDelay={0.3}
            fontSize={68}
            fontWeight={900}
            letterSpacing={-2}
            trigger="scroll"
            fillMode="wipe"
            className="mb-6"
          />
          <p className="text-base md:text-lg text-ivory-dim max-w-xl mx-auto">
            Master strategist and certified trainer committed to your growth.
          </p>
        </ScrollReveal>

        <div className="max-w-2xl mx-auto">
          <ScrollReveal>
            <SpotlightCard className="h-full rounded-2xl border border-gold/30 bg-gradient-to-b from-slate/40 to-obsidian-light glow-gold">
              <div className="p-10 h-full flex flex-col items-center text-center">
                <img
                    src={coach.avatar}
                    alt={coach.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-gold/40 glow-gold mb-6"
                  />
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-ivory">
                    {coach.name}
                  </h3>
                  <span className={`px-2.5 py-1 rounded border text-xs font-bold ${titleColors[coach.fideTitle]}`}>
                    {coach.fideTitle}
                  </span>
                </div>
                <p className="text-sm text-ivory-dim mb-6">{coach.title}</p>

                <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                  {coach.credentials.map((c) => (
                    <span
                      key={c}
                      className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-gold bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5"
                    >
                      <GraduationCap size={13} /> {c}
                    </span>
                  ))}
                  <span className="flex items-center gap-1.5 text-[11px] font-mono tracking-wider text-ivory bg-slate/60 border border-slate-light rounded-full px-4 py-1.5">
                    <Trophy size={13} className="text-gold" /> {coach.ratingLabel}
                  </span>
                  <span className="text-[11px] font-mono tracking-wider text-ivory bg-slate/60 border border-slate-light rounded-full px-4 py-1.5">
                    🇮🇳 {coach.country}
                  </span>
                </div>

                <div className="w-full max-w-md bg-obsidian/60 border border-slate-light rounded-xl px-6 py-5 mb-6">
                  <div className="text-[10px] font-mono text-gold tracking-widest mb-2">EXPERIENCE</div>
                  <div className="text-2xl font-bold text-gradient-gold">
                    <CountUp from={0} to={12} suffix="+ years coaching" />
                  </div>
                </div>

                <ul className="space-y-3 mb-8 w-full max-w-md text-left">
                  {coach.specialization.map((spec) => (
                    <li key={spec} className="flex items-start gap-3 text-sm text-ivory/85">
                      <span className="text-gold mt-0.5">✦</span> {spec}
                    </li>
                  ))}
                </ul>

                <p className="text-sm text-ivory-dim leading-relaxed mb-8 max-w-lg text-center">
                  {coach.bio}
                </p>

                <button
                  onClick={() => setSelected(0)}
                  className="w-full max-w-md py-4 rounded-lg border border-gold/40 text-xs font-mono tracking-widest text-gold hover:bg-gold hover:text-obsidian transition-colors"
                >
                  VIEW FULL PROFILE
                </button>
              </div>
            </SpotlightCard>
          </ScrollReveal>
        </div>
      </div>

      {selected !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="relative w-full max-w-lg bg-obsidian-light border border-gold/30 rounded-2xl p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className="absolute top-4 right-4 text-ivory-dim hover:text-gold transition-colors"
              aria-label="Close profile"
            >
              <X size={18} />
            </button>
            <div className="mb-6 flex items-center gap-4">
              <img
                src={coach.avatar}
                alt={coach.name}
                className="w-20 h-20 rounded-full object-cover border border-gold/40"
              />
              <div>
                <h3 className="text-2xl font-bold text-ivory">{coach.name}</h3>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded border text-xs font-bold ${titleColors[coach.fideTitle]}`}>
                  {coach.fideTitle} • {coach.ratingLabel}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="text-gold fill-gold" />
              ))}
              <span className="text-xs text-ivory-dim">{coach.experience}</span>
            </div>
            <p className="text-sm text-ivory-dim leading-relaxed mb-6">{coach.bio}</p>
            <div className="space-y-4 mb-6 border-b border-slate-light pb-6">
              {coach.credentials.map((cred) => (
                <div key={cred} className="flex items-center gap-3 text-sm text-ivory">
                  <GraduationCap size={16} className="text-gold" /> {cred}
                </div>
              ))}
            </div>
            <div className="pb-6 border-b border-slate-light mb-6">
              <span className="text-[10px] font-mono text-gold tracking-widest">SPECIALIZATION</span>
              <ul className="mt-2 space-y-2">
                {coach.specialization.map((spec) => (
                  <li key={spec} className="text-sm text-ivory flex items-start gap-2">
                    <span className="text-gold">✦</span> {spec}
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => {
                setSelected(null)
                window.dispatchEvent(new CustomEvent('open-booking'))
              }}
              className="w-full py-3 rounded-lg bg-gold text-obsidian font-semibold text-xs tracking-widest uppercase"
            >
              Book a Session
            </button>
          </div>
        </div>
      )}
    </section>
  )
}