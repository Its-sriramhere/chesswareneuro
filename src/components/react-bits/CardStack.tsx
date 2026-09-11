import { useState, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface CardStackProps {
  items: ReactNode[]
  className?: string
}

export default function CardStack({ items, className = '' }: CardStackProps) {
  const [current, setCurrent] = useState(0)
  const [offset, setOffset] = useState(0)
  const [exit, setExit] = useState<'left' | 'right' | null>(null)

  const move = (direction: 1 | -1) => {
    setExit(direction === 1 ? 'right' : 'left')
    setOffset(direction === 1 ? -300 : 300)
    setTimeout(() => {
      setCurrent((c) => (c + (direction === 1 ? 1 : -1) + items.length) % items.length)
      setOffset(0)
      setExit(null)
    }, 300)
  }

  const visible = [-2, -1, 0, 1, 2].map((d) => (current + d + items.length) % items.length)

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div className="relative w-full max-w-xl h-[280px] overflow-hidden">
        <AnimatePresence>
          {visible.map((idx) => (
            <motion.div
              key={idx}
              className="absolute inset-0"
              style={{ zIndex: -Math.abs(idx - current) }}
              animate={{
                x: (idx === current ? offset : (idx - current) * 18) + (exit && idx === current ? (exit === 'right' ? -300 : 300) : 0),
                scale: 1 - Math.abs(idx - current) * 0.06,
                opacity: 1 - Math.abs(idx - current) * 0.15,
                rotate: (idx - current) * 0.05,
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {items[idx]}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => move(-1)}
          className="p-3 rounded-full border border-slate-light text-ivory hover:border-gold hover:text-gold transition-colors"
          aria-label="Previous testimonial"
        >
          <ChevronLeft size={20} />
        </button>
        <span className="text-sm text-ivory-dim font-mono">
          {String(current + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
        </span>
        <button
          onClick={() => move(1)}
          className="p-3 rounded-full border border-slate-light text-ivory hover:border-gold hover:text-gold transition-colors"
          aria-label="Next testimonial"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}