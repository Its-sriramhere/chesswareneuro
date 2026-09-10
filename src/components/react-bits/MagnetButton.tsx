import { useRef, type ReactNode } from 'react'
import { motion } from 'framer-motion'

interface MagnetButtonProps {
  children: ReactNode
  className?: string
  strength?: number
  onClick?: () => void
}

export default function MagnetButton({ children, className = '', strength = 20, onClick }: MagnetButtonProps) {
  const ref = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height
    el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`
  }
  const handleMouseLeave = () => {
    const el = ref.current
    if (el) el.style.transform = 'translate(0, 0)'
  }

  return (
    <motion.button
      ref={ref}
      className={`transition-transform duration-300 ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  )
}