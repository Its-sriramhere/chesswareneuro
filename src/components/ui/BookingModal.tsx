import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Loader2, Award, CalendarDays, Clock, User, MapPin, Timer, MessageCircle, CheckCircle2 } from 'lucide-react'
import { programs } from '../../data/programs'
import { coaches } from '../../data/coaches'
import { buildWhatsAppLink } from '../../lib/whatsapp'

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
  hours: string
  date: string
  time: string
  name: string
  email: string
  whatsapp?: string
  country?: string
  message?: string
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
const sessionHours = ['1 hour', '1.5 hours', '2 hours']

const timeToMin = (t: string) => {
  const [hm, mod] = t.split(' ')
  const [h, m] = hm.split(':').map(Number)
  const hr = (h % 12) + (mod === 'PM' ? 12 : 0)
  return hr * 60 + m
}

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

const steps = ['Program', 'Coach', 'Timezone', 'Date', 'Session Hours', 'Timing', 'Details']

export default function BookingModal({ open, onClose, onComplete, initialProgram }: BookingModalProps) {
  const [step, setStep] = useState(0)
  const [data, setData] = useState<BookingData>({
    program: initialProgram || 'foundation',
    coach: '',
    timezone: '',
    hours: '1 hour',
    date: '',
    time: '',
    name: '',
    email: '',
    whatsapp: '',
    country: '',
    message: '',
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [weekIndex, setWeekIndex] = useState(0)
  const [submitted, setSubmitted] = useState(false)

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
    if (open && coaches.length === 1 && !data.coach) {
      setData((d) => ({ ...d, coach: coaches[0].name }))
    }
  }, [open, data.coach, coaches])

  useEffect(() => {
    if (open) {
      setWeekIndex(0)
      setError(null)
      setSubmitted(false)
    }
  }, [open])

  const next = async () => {
    setError(null)
    const stepError =
      (step === 1 && !data.coach)
        ? 'Please choose a coach to continue.'
        : (step === 2 && !data.timezone)
          ? 'Please select your timezone to continue.'
          : (step === 3 && !data.date)
            ? 'Please pick a date to continue.'
            : (step === 5 && !data.time)
              ? 'Please choose a start time to continue.'
              : null
    if (stepError) {
      setError(stepError)
      return
    }
    if (step < steps.length - 1) {
      setStep(step + 1)
      return
    }
    if (!data.name.trim() || !data.email.trim()) {
      setError('Please enter your name and email to confirm.')
      return
    }
    if (!EMAIL_RE.test(data.email.trim())) {
      setError("That email address doesn't look right — please check it and try again.")
      return
    }
    setSending(true)
    try {
      await onComplete(data)
      setSending(false)
      setSubmitted(true)
    } catch {
      setSending(false)
      setError('Failed to send your booking. Please check your connection and try again.')
    }
  }
  const back = () => setStep(Math.max(0, step - 1))

  const stepReady = (s: number) => {
    switch (s) {
      case 1:
        return !!data.coach
      case 2:
        return !!data.timezone
      case 3:
        return !!data.date
      case 5:
        return !!data.time
      default:
        return true
    }
  }

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
            {!submitted ? (
              <>
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
                        {WEEKS[weekIndex].map((d, di) => {
                          const label = fmtDate(d)
                          const isSelected = data.date === label
                          return (
                            <motion.button
                              key={label}
                              initial={{ opacity: 0, scale: 0.55 }}
                              animate={{ opacity: 1, scale: isSelected ? 1.06 : 1 }}
                              whileTap={{ scale: 0.88 }}
                              transition={{
                                delay: (di % 7) * 0.045,
                                type: 'spring',
                                stiffness: 350,
                                damping: 24,
                              }}
                              onClick={() => setData({ ...data, date: label })}
                              className={`relative p-3 rounded-xl border text-center transition-colors ${
                                isSelected
                                  ? 'border-gold bg-gold/15'
                                  : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                              }`}
                            >
                              {isSelected && (
                                <motion.span
                                  layoutId="dayHighlight"
                                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                  className="absolute inset-0 rounded-xl border-2 border-gold ring-2 ring-gold/30 shadow-[0_0_18px_rgba(212,175,55,0.35)]"
                                />
                              )}
                              <span className="block text-[10px] font-mono text-ivory-dim">{WEEKDAYS[d.getDay()]}</span>
                              <span className="text-base font-bold text-ivory mt-0.5">{d.getDate()}</span>
                              <span className="block text-[9px] text-gold mt-0.5">
                                {MONTHS[d.getMonth()]}
                                {d.getFullYear() !== 2026 ? ` ${d.getFullYear()}` : ''}
                              </span>
                            </motion.button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-4">
                      <div className="bg-obsidian/60 border border-slate-light rounded-xl p-5 text-center">
                        <p className="text-xs font-mono text-gold tracking-widest mb-2">HOW LONG IS YOUR SESSION?</p>
                        <p className="text-sm text-ivory-dim">Pick the duration, then choose a start time that fits it.</p>
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {sessionHours.map((h, i) => (
                          <motion.button
                            key={h}
                            initial={{ opacity: 0, y: 18 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileTap={{ scale: 0.9 }}
                            transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 300, damping: 22 }}
                            onClick={() => setData({ ...data, hours: h, time: '' })}
                            className={`relative p-5 rounded-xl border text-center transition-colors overflow-hidden ${
                              data.hours === h
                                ? 'border-gold bg-gold/15'
                                : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                            }`}
                          >
                            {data.hours === h && (
                              <motion.span
                                layoutId="hoursHighlight"
                                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                className="absolute inset-0 rounded-xl border-2 border-gold ring-2 ring-gold/30 shadow-[0_0_18px_rgba(212,175,55,0.35)]"
                              />
                            )}
                            <span className="relative block text-xl font-bold text-ivory">{h.split(' ')[0]}</span>
                            <span className="relative block text-[10px] font-mono text-gold mt-1 uppercase">
                              {h.split(' ')[1]}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {step === 5 && (() => {
                    const sessionMin = parseFloat(data.hours || '1') * 60
                    const maxStart = 21 * 60 - sessionMin
                    const eveningSlots = eveningTimes.filter((t) => timeToMin(t) <= maxStart)
                    return (
                    <div className="space-y-5">
                      <p className="text-xs font-mono text-gold tracking-widest text-center">
                        SELECT A START TIME FOR YOUR {data.hours.toUpperCase()} SESSION
                      </p>
                      <div>
                        <p className="text-xs font-mono text-gold tracking-widest mb-3">MORNING — 9 AM TO 1 PM</p>
                        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                          {morningTimes.map((t, ti) => (
                            <motion.button
                              key={t}
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileTap={{ scale: 0.88 }}
                              transition={{ delay: ti * 0.06, type: 'spring', stiffness: 350, damping: 24 }}
                              onClick={() => setData({ ...data, time: t })}
                              className={`relative p-3 rounded-xl border text-center transition-colors overflow-hidden ${
                                data.time === t
                                  ? 'border-gold bg-gold/15'
                                  : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                              }`}
                            >
                              {data.time === t && (
                                <motion.span
                                  layoutId="timeHighlight"
                                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                  className="absolute inset-0 rounded-xl border-2 border-gold ring-2 ring-gold/30 shadow-[0_0_14px_rgba(212,175,55,0.35)]"
                                />
                              )}
                              <span className="relative text-sm font-mono text-ivory">{t}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-xs font-mono text-gold tracking-widest mb-3">EVENING — 2 PM TO 9 PM</p>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {eveningSlots.map((t, ti) => (
                            <motion.button
                              key={t}
                              initial={{ opacity: 0, scale: 0.6 }}
                              animate={{ opacity: 1, scale: 1 }}
                              whileTap={{ scale: 0.88 }}
                              transition={{ delay: ti * 0.06, type: 'spring', stiffness: 350, damping: 24 }}
                              onClick={() => setData({ ...data, time: t })}
                              className={`relative p-3 rounded-xl border text-center transition-colors overflow-hidden ${
                                data.time === t
                                  ? 'border-gold bg-gold/15'
                                  : 'border-slate-light bg-obsidian/60 hover:border-gold/40'
                              }`}
                            >
                              {data.time === t && (
                                <motion.span
                                  layoutId="timeHighlight"
                                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                                  className="absolute inset-0 rounded-xl border-2 border-gold ring-2 ring-gold/30 shadow-[0_0_14px_rgba(212,175,55,0.35)]"
                                />
                              )}
                              <span className="relative text-sm font-mono text-ivory">{t}</span>
                            </motion.button>
                          ))}
                        </div>
                      </div>
                    </div>
                    );
                    })()}

                  {step === 6 && (
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
                      <input
                        value={data.whatsapp}
                        onChange={(e) => setData({ ...data, whatsapp: e.target.value })}
                        placeholder="WhatsApp number (e.g. +91 98765 43210)"
                        inputMode="tel"
                        className="w-full bg-obsidian/60 border border-slate-light rounded-xl px-5 py-4 text-ivory placeholder:text-ivory-dim/50 focus:border-gold focus:outline-none"
                      />
                      <input
                        value={data.country}
                        onChange={(e) => setData({ ...data, country: e.target.value })}
                        placeholder="Country (e.g. India)"
                        className="w-full bg-obsidian/60 border border-slate-light rounded-xl px-5 py-4 text-ivory placeholder:text-ivory-dim/50 focus:border-gold focus:outline-none"
                      />
                      <textarea
                        value={data.message}
                        onChange={(e) => setData({ ...data, message: e.target.value })}
                        placeholder="Message (optional) — anything we should know?"
                        rows={3}
                        maxLength={300}
                        className="w-full resize-none bg-obsidian/60 border border-slate-light rounded-xl px-5 py-4 text-ivory placeholder:text-ivory-dim/50 focus:border-gold focus:outline-none"
                      />
                      <div className="relative rounded-2xl p-[1.5px] bg-gradient-to-br from-gold/80 via-ivory/25 to-sky-400/50 overflow-hidden">
                        <div className="relative rounded-2xl bg-obsidian/95 p-5">
                          <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-gold/15 blur-2xl pointer-events-none" />
                          <div className="absolute -bottom-10 -left-8 w-28 h-28 rounded-full bg-sky-400/15 blur-2xl pointer-events-none" />
                          <p className="text-[10px] font-mono tracking-[0.35em] text-gold text-center mb-1">
                            ✦ YOUR BOOKING PASS ✦
                          </p>
                          <p className="text-center text-[9px] font-mono text-ivory-dim tracking-widest mb-4">
                            CHESSWARE NEURO
                          </p>
                          <div className="relative">
                            {[
                              {
                                icon: Award,
                                label: 'Program',
                                value: selectedProgram
                                  ? `${selectedProgram.level} — ${selectedProgram.title}`
                                  : '-',
                                chip: 'text-gold border-gold/40 bg-gold/10',
                              },
                              {
                                icon: User,
                                label: 'Coach',
                                value: data.coach || '-',
                                chip: 'text-sky-300 border-sky-300/40 bg-sky-400/10',
                              },
                              {
                                icon: Timer,
                                label: 'Session',
                                value: data.hours || '-',
                                chip: 'text-emerald-300 border-emerald-300/40 bg-emerald-400/10',
                              },
                              {
                                icon: CalendarDays,
                                label: 'Date',
                                value: data.date || '-',
                                chip: 'text-violet-300 border-violet-300/40 bg-violet-400/10',
                              },
                              {
                                icon: Clock,
                                label: 'Start Time',
                                value: data.time || '-',
                                chip: 'text-amber-300 border-amber-300/40 bg-amber-400/10',
                              },
                              {
                                icon: MapPin,
                                label: 'Timezone',
                                value: data.timezone || '-',
                                chip: 'text-rose-300 border-rose-300/40 bg-rose-400/10',
                              },
                            ].map((r, i) => (
                              <motion.div
                                key={r.label}
                                initial={{ opacity: 0, x: -14 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 + i * 0.08, type: 'spring', stiffness: 260, damping: 24 }}
                                className="flex items-center gap-3 py-2.5 border-b border-white/5 last:border-0"
                              >
                                <span
                                  className={`w-9 h-9 shrink-0 rounded-lg border flex items-center justify-center ${r.chip}`}
                                >
                                  <r.icon size={16} />
                                </span>
                                <div className="min-w-0">
                                  <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-ivory-dim">
                                    {r.label}
                                  </p>
                                  <p className="text-sm text-ivory truncate">
                                    {r.label === 'Program' && selectedProgram ? (
                                      <>
                                        <span className="capitalize">{selectedProgram.level}</span>
                                        <span className="text-gold text-xs">
                                          {' '}
                                          (1-on-1 ${selectedProgram.price1on1} / Group ${selectedProgram.priceGroup})
                                        </span>
                                      </>
                                    ) : (
                                      r.value
                                    )}
                                  </p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
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
                className={`inline-flex items-center gap-2 text-sm font-mono tracking-widest text-obsidian bg-gold rounded-lg px-6 py-3 hover:bg-gold-light transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                  stepReady(step) ? '' : 'opacity-70'
                }`}
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
              </>
            ) : (
              <div className="p-8 pt-6 text-center flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                  className="w-16 h-16 rounded-full bg-gold/15 border-2 border-gold flex items-center justify-center text-gold mb-5"
                >
                  <CheckCircle2 size={32} />
                </motion.div>
                <h3 className="text-2xl font-bold text-ivory mb-2">Booking Request Sent!</h3>
                <p className="text-sm text-ivory-dim mb-1">
                  Thanks {data.name.trim().split(' ')[0] || 'friend'} — we&apos;ve received your request.
                </p>
                <p className="text-sm text-ivory-dim mb-6">
                  Chat with us on WhatsApp to confirm your slot faster.
                </p>
                <a
                  href={buildWhatsAppLink(data)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full max-w-sm py-4 rounded-lg bg-[#25D366] text-obsidian font-semibold text-xs tracking-widest uppercase flex items-center justify-center gap-2 mb-3"
                >
                  <MessageCircle size={16} /> Chat with us on WhatsApp
                </a>
                <button
                  onClick={() => setSubmitted(false)}
                  className="w-full max-w-sm py-3 rounded-lg border border-slate-light text-xs font-mono tracking-widest text-ivory-dim hover:text-gold transition-colors mb-3"
                >
                  ← Modify Booking Details
                </button>
                <button
                  onClick={onClose}
                  className="w-full max-w-sm py-3 rounded-lg bg-gold text-obsidian font-semibold text-xs tracking-widest uppercase"
                >
                  Done
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}