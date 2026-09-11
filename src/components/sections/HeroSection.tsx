import { motion } from 'framer-motion'
import DarkVeilCanvas from '../react-bits/DarkVeilCanvas'
import MagnetButton from '../react-bits/MagnetButton'
import BlurText from '../react-bits/BlurText'
import { ChevronDown } from 'lucide-react'

interface HeroSectionProps {
  ready?: boolean
}

export default function HeroSection({ ready = false }: HeroSectionProps) {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="hero" className="relative min-h-screen min-h-svh flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian to-obsidian" />
      <DarkVeilCanvas />

      <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gold/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-slate/30 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-8"
        >
          <img src="/logo/loading.png" alt="Chessware Neuro" className="h-10 md:h-12 w-auto object-contain" />
          <span className="text-xs md:text-sm tracking-[0.3em] text-ivory-dim font-mono">
            CHESSWARE NEURO
          </span>
          <span className="hidden md:block w-px h-6 bg-slate-light" />
          <span className="hidden md:block text-xs text-ivory-dim font-mono">EST. 2026</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-4xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[1.05] mb-6"
        >
          THE FUTURE OF CHESS{' '}
          <span className="text-gradient-gold">STARTS HERE.</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-12 w-full"
        >
          <BlurText
            text="Technology-powered chess education for a global generation."
            delay={60}
            stepDuration={0.28}
            className="text-base md:text-xl text-ivory-dim max-w-2xl mx-auto"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={ready ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="flex flex-col sm:flex-row items-center gap-4"
        >
          <MagnetButton
            className="bg-gold text-obsidian px-8 py-4 rounded-lg font-semibold text-sm tracking-widest uppercase"
            onClick={() => {
              document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })
              // Trigger booking modal via custom event
              window.dispatchEvent(new CustomEvent('open-booking'))
            }}
          >
            Book a Free Trial
          </MagnetButton>
          <MagnetButton
            className="border border-slate-light text-ivory px-8 py-4 rounded-lg font-semibold text-sm tracking-widest uppercase hover:border-gold/50 transition-colors"
            onClick={() => scrollTo('ecosystem')}
          >
            Explore Ecosystem
          </MagnetButton>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.4, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-gold/60"
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}