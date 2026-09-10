import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  from: number
  to: number
  separator?: string
  direction?: 'up' | 'down'
  duration?: number
  delay?: number
  className?: string
  prefix?: string
  suffix?: string
  decimals?: number
  startWhenInView?: boolean
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

function formatValue(value: number, separator: string, decimals: number) {
  const fixed = value.toFixed(decimals)
  const [intPart, fracPart] = fixed.split('.')
  const grouped = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, separator)
  return fracPart ? `${grouped}.${fracPart}` : grouped
}

export default function CountUp({
  from,
  to,
  separator = ',',
  direction = 'up',
  duration = 1,
  delay = 0,
  className = '',
  prefix = '',
  suffix = '',
  decimals = 0,
  startWhenInView = true,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [started, setStarted] = useState(!startWhenInView)
  const [display, setDisplay] = useState<string | null>(null)

  useEffect(() => {
    if (!startWhenInView) {
      setStarted(true)
      return
    }
    if (!ref.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setStarted(entry.isIntersecting)
      },
      { threshold: 0.4 }
    )
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [startWhenInView])

  useEffect(() => {
    if (!started) return

    const start = direction === 'up' ? from : to
    const end = direction === 'up' ? to : from
    const range = end - start
    const startTime = performance.now() + delay * 1000
    let raf = 0

    const tick = (now: number) => {
      const elapsed = now - startTime
      if (elapsed < 0) {
        setDisplay(formatValue(start, separator, decimals))
        raf = requestAnimationFrame(tick)
        return
      }
      const progress = Math.min(1, elapsed / (duration * 1000))
      const eased = easeOutExpo(progress)
      const current = start + range * eased
      setDisplay(formatValue(current, separator, decimals))
      if (progress < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [started, from, to, direction, duration, delay, separator, decimals])

  return (
    <span ref={ref} className={className}>
      {display === null ? formatValue(direction === 'up' ? from : to, separator, decimals) : `${prefix}${display}${suffix}`}
    </span>
  )
}