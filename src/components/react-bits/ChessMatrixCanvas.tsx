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

    let animationId: number
    const SPACING = 26
    const FONT_SIZE = 18

    const resetDrop = (height: number) => ({
      y: Math.random() * -height,
      speed: 0.25 + Math.random() * 0.55,
      head: Math.floor(Math.random() * 20) + 6,
    })

    const resizeTo = (w: number, h: number) => {
      canvas.width = w
      canvas.height = h
      const cols = Math.ceil(canvas.width / SPACING)
      while (drops.length < cols) drops.push(resetDrop(canvas.height))
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

    const draw = () => {
      ctx.fillStyle = `rgba(11, 12, 16, ${0.06 * Math.min(opacity + 0.2, 1)})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${FONT_SIZE}px serif`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      for (let i = 0; i < drops.length; i++) {
        const drop = drops[i]
        const x = i * SPACING + SPACING / 2
        const y = drop.y

        if (y > canvas.height + 40) {
          drops[i] = resetDrop(canvas.height)
          continue
        }

        const isHead = Math.random() > 0.9
        const dimGold = `rgba(212, 175, 55, ${(0.45 + opacity * 0.25).toFixed(3)})`
        const brightGold = `rgba(240, 210, 120, ${Math.min(0.6 + opacity, 1).toFixed(3)})`

        for (let t = 0; t < Math.min(drop.head, 12); t++) {
          const ty = y - t * FONT_SIZE
          if (ty < -10) break
          ctx.fillStyle = t === 0 && isHead ? brightGold : dimGold
          ctx.fillText(
            t === 0 ? PIECE_CHARS[Math.floor(Math.random() * PIECE_CHARS.length)] : DIM_CHARS[Math.floor(Math.random() * DIM_CHARS.length)],
            x,
            ty
          )
        }

        drop.y += drop.speed * 1.6
      }

      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      ro.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [opacity])

  return <canvas ref={canvasRef} className={className} />
}