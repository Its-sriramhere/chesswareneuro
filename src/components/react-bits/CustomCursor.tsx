import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

export default function CustomCursor() {
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 }
  const x = useSpring(cursorX, springConfig)
  const y = useSpring(cursorY, springConfig)
  const trailRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0
    if (isTouchDevice) {
      if (trailRef.current) trailRef.current.style.display = 'none'
      if (dotRef.current) dotRef.current.style.display = 'none'
      return
    }

    const handler = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20)
      cursorY.set(e.clientY - 20)
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [cursorX, cursorY])

  return (
    <>
      <motion.div
        ref={trailRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-gold/30 pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{ x, y }}
      />
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-gold pointer-events-none z-[9999] hidden md:block"
        style={{ x: cursorX, y: cursorY }}
      />
    </>
  )
}
