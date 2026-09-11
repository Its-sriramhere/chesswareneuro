import ScrollReveal from '../react-bits/ScrollReveal'
import CountUp from '../react-bits/CountUp'
import { programs, classDetails, schedule } from '../../data/programs'
import { Check, Clock, CalendarRange, CreditCard, Users } from 'lucide-react'

export default function PricingPlans({ onLevelTest }: { onLevelTest?: () => void }) {
  return (
    <section id="pricing" className="relative py-32 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">Fee Structure — USA</p>
          <h2 className="text-3xl md:text-5xl font-black text-ivory">
            INVEST IN YOUR <span className="text-gradient-gold">GAME.</span>
          </h2>
          <p className="text-sm text-ivory-dim mt-4">All pricing in USD • Paid in advance</p>
        </ScrollReveal>

        {/* Fee table */}
        <ScrollReveal delay={0.1}>
          <div className="relative overflow-hidden rounded-2xl border border-slate-light bg-obsidian-light/40 mb-14">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[560px]">
                <thead>
                  <tr className="border-b border-slate-light bg-obsidian-light/60">
                    <th className="p-4 md:p-6 text-xs font-mono tracking-widest text-ivory-dim font-normal">STAGE</th>
                    <th className="p-4 md:p-6 text-xs font-mono tracking-widest text-ivory-dim font-normal">LEVEL</th>
                    <th className="p-4 md:p-6 text-xs font-mono tracking-widest text-gold font-normal">1-ON-1</th>
                    <th className="p-4 md:p-6 text-xs font-mono tracking-widest text-gold font-normal">GROUP</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((program, i) => (
                    <tr
                      key={program.id}
                      className={`border-b border-slate-light/50 ${program.recommended ? 'bg-gold/[0.03]' : ''} ${
                        i === programs.length - 1 ? 'border-b-0' : ''
                      }`}
                    >
                      <td className="p-4 md:p-6">
                        <span className="text-base font-semibold text-ivory capitalize">{program.level}</span>
                        {program.recommended && (
                          <span className="ml-3 text-[9px] font-mono tracking-widest text-gold bg-gold/10 border border-gold/30 rounded-full px-2 py-0.5">
                            RECOMMENDED
                          </span>
                        )}
                      </td>
                      <td className="p-4 md:p-6 text-sm text-ivory-dim">{program.ratingBand}</td>
                      <td className="p-4 md:p-6">
                        <CountUp from={0} to={program.price1on1} prefix="$" duration={1.2} className="text-2xl font-black text-gradient-gold" />
                        <span className="ml-1 text-xs text-ivory-dim">/month</span>
                      </td>
                      <td className="p-4 md:p-6">
                        <CountUp from={0} to={program.priceGroup} prefix="$" duration={1.2} className="text-2xl font-black text-gradient-gold" />
                        <span className="ml-1 text-xs text-ivory-dim">/month</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </ScrollReveal>

        {/* Class details + Schedule */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-14">
          <ScrollReveal delay={0.1}>
            <div className="h-full bg-gradient-to-b from-slate/40 to-obsidian-light border border-slate-light rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={20} className="text-gold" />
                <h3 className="text-sm font-mono tracking-widest text-ivory">CLASS DETAILS</h3>
              </div>
              <ul className="space-y-3">
                {classDetails.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-ivory/85">
                    <Check size={15} className="text-gold mt-0.5" /> {d}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="h-full bg-gradient-to-b from-slate/40 to-obsidian-light border border-slate-light rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <CalendarRange size={20} className="text-gold" />
                <h3 className="text-sm font-mono tracking-widest text-ivory">SCHEDULE</h3>
              </div>
              <ul className="space-y-3">
                {schedule.map((d) => (
                  <li key={d} className="flex items-start gap-3 text-sm text-ivory/85">
                    <Check size={15} className="text-gold mt-0.5" /> {d}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="h-full bg-gradient-to-b from-slate/40 to-obsidian-light border border-gold/30 glow-gold rounded-2xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <Users size={20} className="text-gold" />
                <h3 className="text-sm font-mono tracking-widest text-ivory">SMALL GROUPS</h3>
              </div>
              <p className="text-sm text-ivory-dim leading-relaxed mb-4">
                Small groups are capped at a <span className="text-gold font-semibold">maximum of 4 students</span> for focused, personal attention in every session.
              </p>
              <div className="flex items-center gap-3">
                <CreditCard size={16} className="text-gold" />
                <span className="text-xs font-mono text-ivory-dim">PAID IN ADVANCE</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal delay={0.2}>
          <div
            className="relative rounded-2xl border border-slate-light bg-gradient-to-r from-slate/40 via-obsidian-light to-slate/40 p-8 md:p-10 text-center overflow-hidden cursor-pointer group"
            onClick={onLevelTest}
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
            <p className="text-xl md:text-3xl font-black text-gradient-gold mb-3">
              Not sure where you belong?
            </p>
            <p className="text-sm text-ivory-dim mb-6">
              Take our 2-minute assessment and we&apos;ll place you in the right level.
            </p>
            <span className="inline-flex items-center gap-2 text-sm font-mono tracking-widest text-gold border border-gold/40 rounded-lg px-8 py-4 group-hover:bg-gold group-hover:text-obsidian transition-colors">
              TAKE THE LEVEL TEST →
            </span>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}