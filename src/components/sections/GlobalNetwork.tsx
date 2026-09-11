import { useEffect, useRef } from 'react'
import ScrollReveal from '../react-bits/ScrollReveal'
import BlurText from '../react-bits/BlurText'

const hubs = [
  { name: 'USA', flag: '🇺🇸', x: 18, y: 38 },
  { name: 'CANADA', flag: '🇨🇦', x: 14, y: 26 },
  { name: 'UK', flag: '🇬🇧', x: 44, y: 22 },
  { name: 'UAE', flag: '🇦🇪', x: 60, y: 55 },
  { name: 'SINGAPORE', flag: '🇸🇬', x: 76, y: 72 },
  { name: 'AUSTRALIA', flag: '🇦🇺', x: 82, y: 84 },
]

function NetworkCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animationId = 0
    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const nodes = hubs.map((h) => ({
      h,
      x: (h.x / 100) * canvas.width,
      y: (h.y / 100) * canvas.height,
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = (now: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Angled perspective grid
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)'
      ctx.lineWidth = 1
      for (let i = -10; i < 20; i++) {
        const x = (i / 10) * canvas.width + canvas.width / 2
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x - canvas.width / 3, canvas.height)
        ctx.stroke()
      }

      // Connnections between hubs
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist < canvas.width * 0.45) {
            ctx.beginPath()
            ctx.moveTo(a.x, a.y)
            ctx.lineTo(b.x, b.y)
            ctx.strokeStyle = `rgba(212, 175, 55, ${0.25 * (1 - dist / (canvas.width * 0.45))})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })

      // Data pulses traveling along connections
      const t = now / 1000
      nodes.forEach((a, i) => {
        nodes.forEach((b, j) => {
          if (j <= i) return
          const dist = Math.hypot(a.x - b.x, a.y - b.y)
          if (dist > canvas.width * 0.45) return
          const pulse = (t * 0.4 + i * 0.3 + j * 0.5) % 1
          const px = a.x + (b.x - a.x) * pulse
          const py = a.y + (b.y - a.y) * pulse
          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = '#D4AF37'
          ctx.globalAlpha = 0.8 * (1 - pulse * 0.5)
          ctx.fill()
          ctx.globalAlpha = 1
        })
      })

      // Node markers
      nodes.forEach((node, i) => {
        const pulse = (Math.sin(t * 2 + node.pulse) + 1) / 2
        const radius = 5 + pulse * 8
        ctx.beginPath()
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(212, 175, 55, ${0.08 + pulse * 0.12})`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = '#D4AF37'
        ctx.fill()

        ctx.strokeStyle = `rgba(212, 175, 55, ${0.3 + pulse * 0.4})`
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.arc(node.x, node.y, 8 + pulse * 6, 0, Math.PI * 2)
        ctx.stroke()
      })

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
      draw(2000)
      cancelAnimationFrame(animationId)
    } else {
      running = true
      animationId = requestAnimationFrame(draw)
    }

    const ro = new ResizeObserver(() => {
      resize()
      maybePause()
    })
    ro.observe(canvas)

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
    }
  }, [])

  return <canvas ref={canvasRef} className="w-full h-full absolute inset-0" />
}

export default function GlobalNetwork() {
  return (
    <section className="relative py-32 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6">
        <ScrollReveal className="text-center mb-12">
          <p className="text-xs tracking-[0.3em] text-gold font-mono uppercase mb-4">Global by Design</p>
          <h2 className="text-3xl md:text-5xl font-black text-ivory mb-4">
            ONE BOARD. <span className="text-gradient-gold">ONE WORLD.</span>
          </h2>
          <BlurText
            text="Learn from anywhere. Play with anyone. Grow without borders."
            delay={50}
            stepDuration={0.3}
            className="text-base md:text-lg text-ivory-dim"
          />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="relative h-[280px] sm:h-[320px] md:h-[420px] rounded-2xl border border-slate-light bg-obsidian-light/30 overflow-hidden">
            <NetworkCanvas />
            {hubs.map((hub) => (
              <div
                key={hub.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${hub.x}%`, top: `${hub.y}%` }}
              >
                <div className="flex flex-col items-center gap-1">
                  <span className="text-2xl">{hub.flag}</span>
                  <span className="text-[9px] md:text-[10px] font-mono tracking-widest text-gold bg-obsidian/80 px-2 py-0.5 rounded border border-gold/20">
                    {hub.name}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-8 text-xs md:text-sm font-mono text-ivory-dim">
            <span className="text-gold tracking-widest">ACTIVE HUBS:</span>
            {hubs.map((h) => (
              <span key={h.name} className="border border-slate-light px-3 py-1 rounded-full">
                {h.flag} {h.name}
              </span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}