import { motion } from 'framer-motion'

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
}

export default function SplitText({
  text,
  className = '',
  delay = 0,
  stagger = 0.05,
  as: Tag = 'h2',
}: SplitTextProps) {
  const words = text.split(' ')

  return (
    <Tag className={className}>
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((char, charIndex) => (
            <motion.span
              key={charIndex}
              className="inline-block"
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.5,
                delay: delay + (wordIndex * stagger * 3 + charIndex * stagger),
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              {char}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}