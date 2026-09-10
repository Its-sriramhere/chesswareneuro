import { type ReactNode } from 'react'
import { motion } from 'framer-motion'

export interface BentoItem {
  id: string
  title: string
  description?: string
  icon?: ReactNode
  size: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

interface MagicBentoProps {
  items: BentoItem[]
  className?: string
}

const sizeClasses: Record<BentoItem['size'], string> = {
  sm: 'md:col-span-1 md:row-span-1',
  md: 'md:col-span-2 md:row-span-1',
  lg: 'md:col-span-2 md:row-span-2',
  xl: 'md:col-span-3 md:row-span-2',
}

const sizeHeights: Record<BentoItem['size'], string> = {
  sm: 'min-h-[200px]',
  md: 'min-h-[220px]',
  lg: 'min-h-[280px]',
  xl: 'min-h-[320px]',
}

export default function MagicBento({ items, className = '' }: MagicBentoProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 auto-rows-min gap-4 md:gap-5 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
          className={`relative overflow-hidden bg-slate border border-slate-light rounded-2xl p-6 group ${sizeClasses[item.size]} ${sizeHeights[item.size]} ${item.className}`}
        >
          <div className="relative z-10 flex flex-col h-full">
            {item.icon && <div className="mb-4 text-gold">{item.icon}</div>}
            <h3 className="text-lg md:text-xl font-semibold text-ivory mb-2">
              {item.title}
            </h3>
            {item.description && (
              <p className="text-sm text-ivory-dim leading-relaxed">{item.description}</p>
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </motion.div>
      ))}
    </div>
  )
}