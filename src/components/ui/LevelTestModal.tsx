import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight } from 'lucide-react'

interface LevelTestModalProps {
  open: boolean
  onClose: () => void
  onComplete: (level: 'foundation' | 'advanced') => void
}

const questions = [
  {
    question: 'How long have you been playing chess?',
    options: [
      { label: 'Less than 6 months', score: 1 },
      { label: '6–12 months', score: 2 },
      { label: '1–3 years', score: 3 },
      { label: '3+ years', score: 4 },
    ],
  },
  {
    question: 'How often do you play or study chess?',
    options: [
      { label: 'Occasionally — once a month', score: 1 },
      { label: 'Weekly casual games', score: 2 },
      { label: 'A few times a week', score: 3 },
      { label: 'Daily training', score: 4 },
    ],
  },
  {
    question: 'What is your current chess rating (any platform)?',
    options: [
      { label: 'Under 800', score: 1 },
      { label: '800–1200', score: 2 },
      { label: '1200–1800', score: 3 },
      { label: '1800+', score: 4 },
    ],
  },
  {
    question: 'What is your primary goal?',
    options: [
      { label: 'Learn the basics & have fun', score: 1 },
      { label: 'Improve my game steadily', score: 2 },
      { label: 'Compete in tournaments', score: 3 },
      { label: 'Reach master-level performance', score: 4 },
    ],
  },
]

export default function LevelTestModal({ open, onClose, onComplete }: LevelTestModalProps) {
  const [step, setStep] = useState(0)
  const [score, setScore] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  const handleSelect = (points: number) => {
    setSelected(points)
    setTimeout(() => {
      setScore((s) => s + points)
      if (step < questions.length - 1) {
        setStep(step + 1)
        setSelected(null)
      } else {
        const avg = (score + points) / questions.length
        const level = avg <= 2.25 ? 'foundation' : 'advanced'
        onComplete(level)
        reset()
      }
    }, 350)
  }

  const reset = () => {
    setStep(0)
    setScore(0)
    setSelected(null)
  }

  const close = () => {
    reset()
    onClose()
  }

  const current = questions[step]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={close}
        >
          <motion.div
            className="relative w-full max-w-lg bg-obsidian-light border border-gold/30 rounded-2xl p-6 sm:p-8 max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 30 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <button
              onClick={close}
              className="absolute top-3 right-3 text-ivory-dim hover:text-gold transition-colors p-3"
              aria-label="Close level test"
            >
              <X size={18} />
            </button>

            <div className="mb-8">
              <p className="text-xs font-mono text-gold tracking-widest mb-2">
                LEVEL TEST — QUESTION {step + 1} OF {questions.length}
              </p>
              <div className="flex gap-2">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= step ? 'bg-gold' : 'bg-slate'
                    }`}
                  />
                ))}
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-lg md:text-xl font-semibold text-ivory mb-6">
                  {current.question}
                </h3>
                <div className="space-y-3">
                  {current.options.map((opt) => (
                    <button
                      key={opt.label}
                      onClick={() => handleSelect(opt.score)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center justify-between group ${
                        selected === opt.score
                          ? 'border-gold bg-gold/10'
                          : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                      }`}
                    >
                      <span className="text-sm text-ivory group-hover:text-gold transition-colors">
                        {opt.label}
                      </span>
                      <ArrowRight size={16} className="text-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}