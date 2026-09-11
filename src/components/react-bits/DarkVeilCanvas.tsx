import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  drift: number
}

export default function DarkVeilCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animationId = 0
    let particles: Particle[] = []
    let width = 0
    let height = 0

    const resizeTo = (w: number, h: number) => {
      width = w
      height = h
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    const resize = () => resizeTo(window.innerWidth, window.innerHeight)
    resize()
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      if (r.width > 0) resizeTo(r.width, r.height)
    })
    ro.observe(canvas)
    window.addEventListener('resize', resize)

    const spawn = () => {
      const isMobile = window.innerWidth < 640
      const cap = isMobile ? 90 : 220
      const count = Math.min(cap, Math.floor((window.innerWidth * window.innerHeight) / 9000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.8,
        opacity: Math.random() * 0.6 + 0.3,
        drift: Math.random() * Math.PI * 2,
      }))
    }
    spawn()
    window.addEventListener('resize', spawn)

    const paint = (now: number) => {
      ctx.clearRect(0, 0, width, height)

      const t = now / 4000
      const blob1x = width * (0.3 + 0.1 * Math.sin(t))
      const blob1y = height * (0.25 + 0.08 * Math.cos(t * 0.8))
      const blob2x = width * (0.7 + 0.1 * Math.sin(t * 1.3 + 2))
      const blob2y = height * (0.75 + 0.08 * Math.cos(t * 0.6 + 1))
      const g1 = ctx.createRadialGradient(blob1x, blob1y, 0, blob1x, blob1y, Math.max(width, height) * 0.25)
      g1.addColorStop(0, 'rgba(212, 175, 55, 0.10)')
      g1.addColorStop(1, 'rgba(212, 175, 55, 0)')
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, width, height)
      const g2 = ctx.createRadialGradient(blob2x, blob2y, 0, blob2x, blob2y, Math.max(width, height) * 0.3)
      g2.addColorStop(0, 'rgba(140, 150, 190, 0.07)')
      g2.addColorStop(1, 'rgba(140, 150, 190, 0)')
      ctx.fillStyle = g2
      ctx.fillRect(0, 0, width, height)

      const cell = 140
      const cols = Math.ceil(width / cell)
      const rows = Math.ceil(height / cell)
      const grid: number[][] = Array.from({ length: cols * rows }, () => [])
      const cidx = (x: number, y: number) =>
        Math.min(cols - 1, Math.max(0, Math.floor(x / cell))) +
        Math.min(rows - 1, Math.max(0, Math.floor(y / cell))) * cols

      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        p.drift += 0.01

        if (p.x < -20) p.x = width + 20
        if (p.x > width + 20) p.x = -20
        if (p.y < -20) p.y = height + 20
        if (p.y > height + 20) p.y = -20

        grid[cidx(p.x, p.y)].push(i)
      })

      const CONNECT_DIST = 150
      const connectDistSq = CONNECT_DIST * CONNECT_DIST
      const checked = new Set<string>()

      particles.forEach((p, i) => {
        const cx = Math.floor(p.x / cell)
        const cy = Math.floor(p.y / cell)

        for (let gy = cy - 1; gy <= cy + 1; gy++) {
          for (let gx = cx - 1; gx <= cx + 1; gx++) {
            if (gy < 0 || gx < 0 || gy >= rows || gx >= cols) continue
            for (const j of grid[gx + gy * cols]) {
              if (j <= i) continue
              const key = `${i}:${j}`
              if (checked.has(key)) continue
              checked.add(key)
              const q = particles[j]
              const dx = p.x - q.x
              const dy = p.y - q.y
              const d2 = dx * dx + dy * dy
              if (d2 < connectDistSq) {
                const dist = Math.sqrt(d2)
                ctx.beginPath()
                ctx.moveTo(p.x, p.y)
                ctx.lineTo(q.x, q.y)
                ctx.strokeStyle = `rgba(212, 175, 55, ${0.22 * (1 - dist / CONNECT_DIST)})`
                ctx.lineWidth = 0.9
                ctx.stroke()
              }
            }
          }
        }

        // Particle with soft glow
        const pulse = 0.6 + 0.4 * Math.sin(p.drift)
        const radius = p.size * 1.8
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius * 2.2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${p.opacity * pulse * 0.18})`
        ctx.fill()
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(232, 201, 74, ${p.opacity * pulse})`
        ctx.fill()
      })
    }

    const draw = (now: number) => {
      paint(now)
      animationId = requestAnimationFrame(draw)
    }

    let running = false
    let inView = true
    let tabVisible = !document.hidden

    const maybePause = () => {
      const shouldRun = inView && tabVisible && !reduceMotion
      if (shouldRun && !running) {
        running = true
        animationId = requestAnimationFrame(draw)
      } else if (!shouldRun && running) {
        running = false
        cancelAnimationFrame(animationId)
      }
    }

    if (reduceMotion) {
      paint(performance.now())
    } else {
      running = true
      animationId = requestAnimationFrame(draw)
    }

    const io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      maybePause()
    })
    io.observe(canvas)

    const onVisibility = () => {
      tabVisible = !document.hidden
      maybePause()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(animationId)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', spawn)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  )
}