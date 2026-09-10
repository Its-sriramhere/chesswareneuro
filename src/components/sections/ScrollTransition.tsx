import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

const words = ['CHESS', 'TECHNOLOGY', 'LEARNING', 'CHESSWARE NEURO']

export default function ScrollTransition() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const yPositions = useTransform(scrollYProgress, (v) => v * 100)

  return (
    <section ref={ref} className="relative h-[50svh] sm:h-[60svh] bg-obsidian/60 overflow-hidden flex items-center justify-center px-4">
      <motion.div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-3 md:gap-x-10 md:gap-y-6" style={{ y: yPositions }}>
        {words.map((word, i) => {
          const startX = i === 0 ? 1 : -(words.length - i) * 0.35
          const endX = i === 0 ? 1 : words.length - i

          return (
            <div key={word} className="flex items-center gap-4 md:gap-10">
              <motion.span
                className={`text-2xl md:text-6xl font-black whitespace-nowrap ${
                  i === words.length - 1 ? 'text-gradient-gold' : i === 0 ? 'text-ivory' : 'text-ivory-dim'
                }`}
                initial={{ opacity: 0, x: startX * 0.3 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ amount: 0.5 }}
                transition={{ duration: 0.8, delay: i * 0.15 }}
              >
                {word}
              </motion.span>
              {i < words.length - 1 && (
                <motion.span
                  className="text-gold text-2xl md:text-4xl"
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.15 + 0.3 }}
                >
                  →
                </motion.span>
              )}
            </div>
          )
        })}
      </motion.div>
    </section>
  )
}