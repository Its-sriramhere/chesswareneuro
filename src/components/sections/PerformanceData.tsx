import { useEffect, useRef, useState } from 'react'
import ScrollReveal from '../react-bits/ScrollReveal'
import CountUp from '../react-bits/CountUp'
import BlurText from '../react-bits/BlurText'

const metrics = [
  { label: 'TACTICS', value: 82 },
  { label: 'OPENINGS', value: 71 },
  { label: 'ENDGAME', value: 64 },
  { label: 'CALCULATION', value: 77 },
]

function AnimatedBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const barRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    if (barRef.current) observer.observe(barRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={barRef} className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono tracking-widest text-ivory">{label}</span>
        <span className="text-xs font-mono text-gold">
          <CountUp from={0} to={value} suffix="%" delay={delay / 1000} duration={1.2} />
        </span>
      </div>
      <div className="h-2 bg-slate rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-gold-dim to-gold rounded-full transition-[width] duration-[1500ms] ease-out glow-gold"
          style={{
            width: inView ? `${value}%` : '0%',
            transitionDelay: `${delay}ms`,
          }}
        />
      </div>
    </div>
  )
}

export default function PerformanceData() {
  return (
    <section className="relative py-32 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <ScrollReveal>
              <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">
                Your Game Has Data
              </p>
              <h2 className="text-3xl md:text-5xl font-black text-ivory mb-6">
                PLAYER PERFORMANCE <span className="text-gradient-gold">ANALYTICS</span>
              </h2>
              <div className="text-ivory-dim leading-relaxed mb-8">
                <BlurText
                  text="Every move generates data. Every game tells a story. Chessware transforms raw performance into a clear roadmap for your improvement."
                  delay={40}
                  stepDuration={0.3}
                />
              </div>
              <div className="inline-flex items-center gap-3 bg-gold/10 border border-gold/30 rounded-full px-5 py-2.5 mb-8">
                <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                <span className="text-xs font-mono tracking-widest text-gold">
                  <CountUp from={0} to={12} prefix="+" suffix="%" duration={1.2} /> OVERALL IMPROVEMENT THIS MONTH
                </span>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-obsidian-light/60 border border-slate-light rounded-xl p-5">
                  <CountUp from={0} to={2.4} decimals={1} suffix="h" className="text-3xl font-bold text-gold" />
                  <div className="text-xs text-ivory-dim mt-1">Daily training time</div>
                </div>
                <div className="bg-obsidian-light/60 border border-slate-light rounded-xl p-5">
                  <CountUp from={0} to={148} className="text-3xl font-bold text-gold" />
                  <div className="text-xs text-ivory-dim mt-1">Games analyzed</div>
                </div>
                <div className="bg-obsidian-light/60 border border-slate-light rounded-xl p-5">
                  <CountUp from={0} to={92} suffix="%" className="text-3xl font-bold text-gold" />
                  <div className="text-xs text-ivory-dim mt-1">Session completion</div>
                </div>
                <div className="bg-obsidian-light/60 border border-slate-light rounded-xl p-5">
                  <CountUp from={0} to={260} prefix="+" className="text-3xl font-bold text-gold" />
                  <div className="text-xs text-ivory-dim mt-1">Rating gained</div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.2}>
            <div className="bg-gradient-to-br from-slate/40 to-obsidian-light border border-slate-light rounded-2xl p-8 md:p-10 space-y-8">
              <div className="flex items-center justify-between mb-4">
                <span className="font-mono text-xs tracking-widest text-ivory-dim">
                  PERFORMANCE OVERVIEW
                </span>
                <span className="flex items-center gap-2 text-[10px] font-mono text-gold">
                  <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" /> LIVE
                </span>
              </div>
              {metrics.map((m, i) => (
                <AnimatedBar key={m.label} label={m.label} value={m.value} delay={i * 200} />
              ))}
              <div className="pt-6 border-t border-slate-light">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-ivory-dim">CALCULATION SPEED</span>
                  <span className="text-gold">12.4s AVG</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono mt-3">
                  <span className="text-ivory-dim">ACCURACY TREND</span>
                  <span className="text-green-400">↑ STEADY</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}