import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { programs } from '../../data/programs'
import { coaches } from '../../data/coaches'

interface BookingModalProps {
  open: boolean
  onClose: () => void
  onComplete: (data: BookingData) => void | Promise<void>
  initialProgram?: string | null
}

export interface BookingData {
  program: string
  coach: string
  timezone: string
  date: string
  time: string
  name: string
  email: string
}

const timezones = [
  'UTC−05:00 (USA — Eastern)',
  'UTC−06:00 (USA — Central)',
  'UTC−07:00 (USA — Mountain)',
  'UTC−08:00 (USA — Pacific)',
  'UTC+00:00 (London)',
  'UTC+04:00 (Gulf)',
  'UTC+08:00 (Singapore)',
  'UTC+10:00 (Sydney)',
]

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const morningTimes = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM']
const eveningTimes = ['02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM']

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const fmtDate = (d: Date) => `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`

function buildWeeks(): Date[][] {
  const weeks: Date[][] = []
  const start = new Date()
  start.setDate(start.getDate() + 1)
  start.setHours(0, 0, 0, 0)
  const cur = new Date(start)
  const end = new Date(2026, 11, 31, 0, 0, 0, 0)
  let week: Date[] = []
  while (cur <= end) {
    week.push(new Date(cur))
    if (week.length === 7) {
      weeks.push(week)
      week = []
    }
    cur.setDate(cur.getDate() + 1)
  }
  if (week.length > 0) weeks.push(week)
  return weeks
}

const WEEKS = buildWeeks()

const weekLabel = (week: Date[]) => {
  const first = week[0]
  const last = week[week.length - 1]
  const sameMonth = first.getMonth() === last.getMonth()
  return `${WEEKDAYS[first.getDay()]} ${first.getDate()} ${MONTHS[first.getMonth()]} – ${
    sameMonth ? last.getDate() : `${last.getDate()} ${MONTHS[last.getMonth()]}`
  } ${last.getFullYear()}`
}

const steps = ['Program', 'Coach', 'Timezone', 'Date', 'Time', 'Details']

export default function BookingModal({ open, onClose, onComplete, initialProgram }: BookingModalProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<BookingData>({
    program: initialProgram || 'foundation',
    coach: '',
    timezone: '',
    date: '',
    time: '',
    name: '',
    email: '',
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weekIndex, setWeekIndex] = useState(0)

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  useEffect(() => {
    if (open && coaches.length === 1) {
      setData((d) => ({ ...d, coach: d.coach || coaches[0].name }))
    }
    if (open) {
      setWeekIndex(0)
      setError(null)
    }
  }, [open])

  const next = async () => {
    if (step < steps.length - 1) {
      setStep(step + 1)
      return
    }
    setError(null)
    if (!data.name.trim() || !data.email.trim()) {
      setError('Please enter your name and email to confirm.')
      return
    }
    if (!EMAIL_RE.test(data.email.trim())) {
      setError("That email address doesn't look right — please check it and try again.")
      return
    }
    if (!data.coach || !data.timezone || !data.date || !data.time) {
      setError('Please complete all booking details.')
      return
    }
    setSending(true)
    try {
      await onComplete(data)
    } catch {
      setSending(false)
      setError('Failed to send your booking. Please check your connection and try again.')
    }
  }
  const back = () => setStep(Math.max(0, step - 1))

  const selectedProgram = programs.find((p) => p.level === data.program)

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-obsidian/90 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="relative w-full max-w-2xl bg-obsidian-light border border-gold/30 rounded-2xl max-h-[calc(100dvh-2rem)] overflow-y-auto overscroll-contain"
            initial={{ y: 60, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

            <div className="flex items-center justify-between p-6 pb-0">
              <div>
                <h3 className="text-xl font-bold text-ivory">Book a Session</h3>
                <p className="text-xs font-mono text-gold tracking-widest mt-1">
                  STEP {String(step + 1).padStart(2, '0')} / 06 — {steps[step].toUpperCase()}
                </p>
              </div>
              <button
                onClick={onClose}
                className="text-ivory-dim hover:text-gold transition-colors p-3 -m-3"
                aria-label="Close booking modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* Step indicator */}
            <div className="flex items-center gap-2 px-6 py-5">
              {steps.map((s, i) => (
                <div key={s} className="flex-1">
                  <div
                    className={`h-1 rounded-full transition-colors duration-300 ${
                      i <= step ? 'bg-gold' : 'bg-slate'
                    }`}
                  />
                </div>
              ))}
            </div>

            <div className="p-6 pt-2 min-h-[300px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.2 }}
                >
                  {error && (
                    <div className="mb-4 text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3">
                      {error}
                    </div>
                  )}
                  {step === 0 && (
                    <div className="space-y-3">
                      {programs.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setData({ ...data, program: p.level })}
                          className={`w-full text-left p-5 rounded-xl border transition-colors ${
                            data.program === p.level
                              ? 'border-gold bg-gold/10'
                              : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-xs font-mono text-gold">{p.tier}</span>
                              <span className="block text-sm font-semibold text-ivory mt-1 capitalize">
                                {p.level} • {p.title}
                              </span>
                              <span className="block text-[10px] font-mono text-ivory-dim mt-1">
                                LEVEL — {p.ratingBand}
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="block text-sm font-bold text-gold">1-on-1 ${p.price1on1}</span>
                              <span className="block text-xs text-ivory-dim mt-0.5">Group ${p.priceGroup} / month</span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 1 && (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      {coaches.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => setData({ ...data, coach: c.name })}
                          className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-colors ${
                            data.coach === c.name
                              ? 'border-gold bg-gold/10'
                              : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                          }`}
                        >
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-10 h-10 rounded-full object-cover border border-gold/40"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-semibold text-ivory">
                              {c.name} <span className="text-gold text-xs">{c.fideTitle}</span>
                            </p>
                            <p className="text-xs text-ivory-dim">
                              {c.specialization[0]} • {c.ratingLabel}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 2 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {timezones.map((tz) => (
                        <button
                          key={tz}
                          onClick={() => setData({ ...data, timezone: tz })}
                          className={`p-4 rounded-xl border text-left transition-colors ${
                            data.timezone === tz
                              ? 'border-gold bg-gold/10'
                              : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                          }`}
                        >
                          <span className="text-sm text-ivory">{tz}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {step === 3 && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <button
                          onClick={() => setWeekIndex(Math.max(0, weekIndex - 1))}
                          disabled={weekIndex === 0}
                          className="inline-flex items-center gap-1 text-xs font-mono tracking-widest text-gold hover:text-gold-light transition-colors disabled:opacity-30"
                        >
                          <ChevronLeft size={14} /> PREV
                        </button>
                        <span className="text-xs font-mono text-ivory-dim">
                          WEEK {String(weekIndex + 1).padStart(2, '0')} / {String(WEEKS.length).padStart(2, '0')} — {weekLabel(WEEKS[weekIndex])}
                        </span>
                        <button
                          onClick={() => setWeekIndex(Math.min(WEEKS.length - 1, weekIndex + 1))}
                          disabled={weekIndex >= WEEKS.length - 1}
                          className="inline-flex items-center gap-1 text-xs font-mono tracking-widest text-gold hover:text-gold-light transition-colors disabled:opacity-30"
                        >
                          NEXT <ChevronRight size={14} />
                        </button>
                      </div>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {WEEKS[weekIndex].map((d) => {
                          const label = fmtDate(d)
                          const isSelected = data.date === label
                          return (
                            <button
                              key={label}
                              onClick={() => setData({ ...data, date: label })}
                              className={`p-3 rounded-xl border text-center transition-colors ${
                                isSelected
                                  ? 'border-gold bg-gold/10'
                                  : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                              }`}
                            >
                              <span className="block text-[10px] font-mono text-ivory-dim">{WEEKDAYS[d.getDay()]}</span>
                              <span className="text-base font-bold text-ivory mt-0.5">{d.getDate()}</span>
                              <span className="block text-[9px] text-gold mt-0.5">
                                {MONTHS[d.getMonth()]}
                                {d.getFullYear() !== 2026 ? ` ${d.getFullYear()}` : ''}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-5">
                      <div>
                        <p className="text-xs font-mono text-gold tracking-widest mb-3">MORNING — 9 AM TO 1 PM</p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {morningTimes.map((t) => (
                            <button
                              key={t}
                              onClick={() => setData({ ...data, time: t })}
                              className={`p-3 rounded-xl border text-center transition-colors ${
                                data.time === t
                                  ? 'border-gold bg-gold/10'
                                  : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                              }`}
                            >
                              <span className="text-sm font-mono text-ivory">{t}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-gold tracking-widest mb-3">EVENING — 2 PM TO 9 PM</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {eveningTimes.map((t) => (
                            <button
                              key={t}
                              onClick={() => setData({ ...data, time: t })}
                              className={`p-3 rounded-xl border text-center transition-colors ${
                                data.time === t
                                  ? 'border-gold bg-gold/10'
                                  : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                              }`}
                            >
                              <span className="text-sm font-mono text-ivory">{t}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {step === 5 && (
                    <div className="space-y-4">
                      <input
                        value={data.name}
                        onChange={(e) => setData({ ...data, name: e.target.value })}
                        placeholder="Full name"
                        className="w-full bg-obsidian/60 border border-slate-light rounded-xl px-5 py-4 text-ivory placeholder:text-ivory-dim/50 focus:border-gold focus:outline-none"
                      />
                      <input
                        value={data.email}
                        onChange={(e) => setData({ ...data, email: e.target.value })}
                        placeholder="Email address"
                        aria-invalid={data.email.trim().length > 0 && !EMAIL_RE.test(data.email.trim())}
                        className={`w-full bg-obsidian/60 border rounded-xl px-5 py-4 text-ivory placeholder:text-ivory-dim/50 focus:outline-none transition-colors ${
                          data.email.trim().length > 0 && !EMAIL_RE.test(data.email.trim())
                            ? 'border-red-500/60 focus:border-red-400'
                            : 'border-slate-light focus:border-gold'
                        }`}
                      />
                      {data.email.trim().length > 0 && !EMAIL_RE.test(data.email.trim()) && (
                        <p className="text-xs text-red-400">
                          That email address doesn&apos;t look right — e.g. you@example.com
                        </p>
                      )}
                      <div className="bg-obsidian/60 border border-slate-light rounded-xl p-5">
                        <p className="text-xs font-mono text-gold tracking-widest mb-3">SUMMARY</p>
                        <div className="space-y-1 text-sm">
                          <p className="text-ivory-dim">
                            <span className="text-ivory">Program:</span>{' '}
                            <span className="capitalize">{selectedProgram ? selectedProgram.level : '-'}</span>
                            {selectedProgram && (
                              <span className="text-gold">
                                {' '}
                                (1-on-1 ${selectedProgram.price1on1} / Group ${selectedProgram.priceGroup} per month)
                              </span>
                            )}
                          </p>
                          <p className="text-ivory-dim">
                            <span className="text-ivory">Coach:</span> {data.coach || '-'}
                          </p>
                          <p className="text-ivory-dim">
                            <span className="text-ivory">Slot:</span> {data.date} • {data.time}
                          </p>
                          <p className="text-ivory-dim">
                            <span className="text-ivory">Timezone:</span> {data.timezone || '-'}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="flex items-center justify-between pt-4 px-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] sm:pb-6 border-t border-slate-light">
              <button
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm font-mono tracking-widest text-ivory-dim hover:text-ivory transition-colors disabled:opacity-40 py-3"
              >
                <ChevronLeft size={16} /> BACK
              </button>
              <button
                onClick={next}
                disabled={sending}
                className="inline-flex items-center gap-2 text-sm font-mono tracking-widest text-obsidian bg-gold rounded-lg px-6 py-3 hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> SENDING…
                  </>
                ) : step === steps.length - 1 ? (
                  <>
                    CONFIRM BOOKING <ChevronRight size={16} />
                  </>
                ) : (
                  <>
                    NEXT <ChevronRight size={16} />
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}