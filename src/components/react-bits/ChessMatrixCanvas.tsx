import { useEffect, useRef } from 'react'

interface ChessMatrixCanvasProps {
  className?: string
  opacity?: number
}

const PIECE_CHARS = ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜', '♟']
const DIM_CHARS = ['♟', '♟', '♟', '♟', '♟', '♟', '♞', '♝']

export default function ChessMatrixCanvas({
  className = 'absolute inset-0 w-full h-full',
  opacity = 1,
}: ChessMatrixCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let animationId = 0
    const SPACING = 26
    const FONT_SIZE = 26

    const resetDrop = (height: number) => ({
      y: Math.random() * -height,
      speed: 0.16 + Math.random() * 0.35,
      head: Math.floor(Math.random() * 20) + 6,
      jx: (Math.random() - 0.5) * 4,
    })

    let cssW = 0
    let cssH = 0

    const resizeTo = (w: number, h: number) => {
      cssW = w
      cssH = h
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const cols = Math.ceil(cssW / SPACING)
      while (drops.length < cols) drops.push(resetDrop(cssH))
      while (drops.length > cols) drops.pop()
    }

    const resize = () => resizeTo(window.innerWidth, window.innerHeight)

    const drops = Array.from({ length: Math.ceil(window.innerWidth / SPACING) }, () => resetDrop(window.innerHeight))

    resize()
    const ro = new ResizeObserver((entries) => {
      const r = entries[0].contentRect
      if (r.width > 0) resizeTo(r.width, r.height)
    })
    ro.observe(canvas)
    window.addEventListener('resize', resize)

    const paint = (now: number) => {
      ctx.fillStyle = `rgba(11, 12, 16, ${0.05 * Math.min(opacity + 0.2, 1)})`
      ctx.fillRect(0, 0, cssW, cssH)

      ctx.font = `${FONT_SIZE}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const t = now / 1000

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]
        const x = i * SPACING + SPACING / 2 + drop.jx
        const stagger = i % 2 === 1 ? SPACING / 2 : 0
        const y = drop.y + stagger

        if (drop.y > cssH + 40) {
          drops[i] = resetDrop(canvas.height)
          continue
        }

        const isHead = Math.random() > 0.94
        const pulse = 0.5 + 0.5 * Math.sin(t * 1.4 + i * 1.3)
        const headPulse = 0.35 + 0.65 * Math.sin(t * 2.2 + i)
        const base = 0.75 + opacity * 0.25
        const dimAlpha = Math.min(base * (0.25 + 0.75 * pulse) * 1.15, 1)
        const dimGold = `rgba(212, 175, 55, ${dimAlpha.toFixed(3)})`
        const brightGold = `rgba(240, 210, 120, ${Math.min(0.35 + 0.9 * headPulse, 1).toFixed(3)})`

        for (let c = 0; c < Math.min(drop.head, 12); c++) {
          const ty = y - c * FONT_SIZE
          if (ty < -10) break
          ctx.fillStyle = c === 0 && isHead ? brightGold : dimGold
          ctx.fillText(
            c === 0
              ? PIECE_CHARS[Math.floor(Math.random() * PIECE_CHARS.length)]
              : DIM_CHARS[Math.floor(Math.random() * DIM_CHARS.length)],
            x,
            ty
          )
        }

        drop.y += drop.speed * 1.4
      }
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
      paint(performance.now() + 1000)
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
    window.addEventListener('resize', maybePause)

    return () => {
      cancelAnimationFrame(animationId)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', resize)
      window.removeEventListener('resize', maybePause)
    }
  }, [opacity])

  return <canvas ref={canvasRef} className={className} />
}