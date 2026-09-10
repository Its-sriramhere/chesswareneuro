import { useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TiltedCardProps {
  children: ReactNode
  className?: string
  glareColor?: string
  intensity?: number
}

export default function TiltedCard({ children, className = '', glareColor = 'rgba(212, 175, 55, 0.1)', intensity = 15 }: TiltedCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotate, setRotate] = useState({ x: 0, y: 0 })
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 })

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    setRotate({
      x: (y - 0.5) * -intensity,
      y: (x - 0.5) * intensity,
    })
    setGlare({ x: x * 100, y: y * 100, opacity: 0.15 })
  }

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 })
    setGlare({ x: 50, y: 50, opacity: 0 })
  }

  return (
    <motion.div
      ref={ref}
      className={`relative perspective-[1000px] ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      <div
        className="absolute inset-0 rounded-xl pointer-events-none z-10 transition-opacity duration-300"
        style={{
          background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, ${glareColor}, transparent 60%)`,
          opacity: glare.opacity,
        }}
      />
      {children}
    </motion.div>
  )
}
