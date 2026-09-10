import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import ScrollReveal from '../react-bits/ScrollReveal'

const steps = [
  {
    num: '01',
    title: 'CHOOSE YOUR LEVEL',
    description: 'Tell us where you are and where you want to go.',
  },
  {
    num: '02',
    title: 'MEET YOUR COACH',
    description: 'Connect with the right FIDE-rated coach for your exact goals.',
  },
  {
    num: '03',
    title: 'START IMPROVING',
    description: 'Follow a personalized high-performance training journey with real-time feedback.',
  },
]

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start center', 'end center'],
  })
  const lineHeight = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])

  return (
    <section className="relative py-32 bg-obsidian/60 overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <ScrollReveal className="text-center mb-20">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">How It Works</p>
          <h2 className="text-3xl md:text-5xl font-black text-ivory">
            THE LEARNING <span className="text-gradient-gold">JOURNEY</span>
          </h2>
        </ScrollReveal>

        <div ref={ref} className="relative">
          {/* Timeline line */}
          <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px bg-slate-light" />
          <motion.div
            className="absolute left-6 md:left-1/2 top-0 w-px bg-gold"
            style={{ height: lineHeight }}
          />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className={`relative flex items-start gap-8 ${
                  i % 2 === 1 ? 'md:flex-row' : 'md:flex-row-reverse'
                }`}
              >
                <div className="hidden md:block flex-1 md:w-1/2" />
                <div className="absolute left-6 md:left-1/2 -translate-x-1/2 flex items-center justify-center">
                  <motion.div
                    className="w-5 h-5 rounded-full bg-gold ring-4 ring-obsidian glow-gold"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  />
                </div>
                <div className="flex-1 md:w-1/2 md:pr-0">
                  <ScrollReveal
                    direction={i % 2 === 1 ? 'left' : 'right'}
                    className={i % 2 === 1 ? 'md:pr-16' : 'md:pl-16'}
                  >
                    <div className="bg-gradient-to-br from-slate/40 to-obsidian-light border border-slate-light rounded-2xl p-8">
                      <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-b from-gold/20 to-gold/5">
                        {step.num}
                      </span>
                      <h3 className="text-xl md:text-2xl font-bold text-ivory mt-4 mb-3">
                        {step.title}
                      </h3>
                      <p className="text-sm text-ivory-dim leading-relaxed">{step.description}</p>
                    </div>
                  </ScrollReveal>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}