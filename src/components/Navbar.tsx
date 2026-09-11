import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Programs', id: 'academy' },
  { label: 'Tech', id: 'technology' },
  { label: 'Coaches', id: 'coaches' },
  { label: 'Pricing', id: 'pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileOpen(false)
  }

  return (
    <motion.header
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 pt-[env(safe-area-inset-top)] ${
        scrolled
          ? 'bg-obsidian/90 backdrop-blur-md border-b border-slate-light py-3'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        <button onClick={() => scrollTo('hero')} className="flex items-center gap-3 py-2" aria-label="Chessware Neuro home">
          <img
            src="/logo/loading.png"
            alt="Chessware Neuro icon"
            className="h-8 md:h-10 w-auto object-contain"
          />
          <img
            src="/logo/wordmark.png"
            alt="Chessware Neuro"
            className="h-8 md:h-10 w-auto object-contain"
          />
        </button>

        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-mono tracking-widest text-ivory-dim hover:text-gold transition-colors py-2"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:block">
          <button
            onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
            className="bg-gold text-obsidian px-5 py-2.5 rounded-lg text-xs font-mono tracking-widest uppercase hover:bg-gold-light transition-colors min-h-[44px]"
          >
            Book Trial
          </button>
        </div>

        <button
          className="md:hidden text-ivory p-3 -mr-3"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-obsidian/95 backdrop-blur-md border-t border-slate-light px-6 py-6 flex flex-col gap-5"
        >
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-sm font-mono tracking-widest text-ivory-dim hover:text-gold transition-colors text-left py-2"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => {
              setMobileOpen(false)
              window.dispatchEvent(new CustomEvent('open-booking'))
            }}
            className="bg-gold text-obsidian px-5 py-3.5 rounded-lg text-xs font-mono tracking-widest uppercase"
          >
            Book Trial
          </button>
        </motion.div>
      )}
    </motion.header>
  )
}