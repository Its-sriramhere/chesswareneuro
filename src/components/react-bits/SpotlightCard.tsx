import { useRef, useState, type ReactNode } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  className?: string
  spotlightColor?: string
}

export default function SpotlightCard({ children, className = '', spotlightColor = 'rgba(212, 175, 55, 0.15)' }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [spotlight, setSpotlight] = useState({ x: 0, y: 0, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setSpotlight({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      opacity: 1,
    })
  }

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setSpotlight((s) => ({ ...s, opacity: 0 }))}
    >
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: spotlight.opacity,
          background: `radial-gradient(300px circle at ${spotlight.x}px ${spotlight.y}px, ${spotlightColor}, transparent 70%)`,
        }}
      />
      {children}
    </div>
  )
}