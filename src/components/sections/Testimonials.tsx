import ScrollReveal from '../react-bits/ScrollReveal'
import CardStack from '../react-bits/CardStack'
import { testimonials } from '../../data/testimonials'
import { Star, BadgeCheck } from 'lucide-react'

export default function Testimonials() {
  const cards = testimonials.map((t) => (
    <div
      key={t.id}
      className="w-full h-[280px] bg-obsidian-light/80 border border-slate-light rounded-2xl p-8 flex flex-col backdrop-blur-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-1">
          {[...Array(t.rating)].map((_, i) => (
            <Star key={i} size={16} className="text-gold fill-gold" />
          ))}
        </div>
        {t.verified && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-gold">
            <BadgeCheck size={14} /> VERIFIED
          </span>
        )}
      </div>
      <p className="text-sm text-ivory leading-relaxed mb-6 flex-1">&ldquo;{t.quote}&rdquo;</p>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-ivory text-sm">{t.name}</p>
          <p className="text-xs text-ivory-dim">
            {t.country} • {t.level}
          </p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono text-ivory-dim">IMPROVEMENT</span>
          <p className="text-sm font-bold text-gold">{t.improvement}</p>
        </div>
      </div>
    </div>
  ))

  return (
    <section className="relative py-32 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">Testimonials</p>
          <h2 className="text-3xl md:text-5xl font-black text-ivory">
            SUCCESS ON <span className="text-gradient-gold">THE BOARD</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <CardStack items={cards} />
        </ScrollReveal>
      </div>
    </section>
  )
}