import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export interface ToastMessage {
  id: number
  title: string
  description: string
}

export default function Toast({ message }: { message: ToastMessage | null }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key={message.id}
          className="fixed bottom-[calc(1.5rem+env(safe-area-inset-bottom))] left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 z-[120] max-w-[calc(100vw-2rem)] sm:max-w-sm"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        >
          <div className="bg-obsidian-light border border-gold/40 rounded-xl p-5 flex items-start gap-4 glow-gold">
            <CheckCircle2 className="text-gold mt-0.5 shrink-0" size={22} />
            <div>
              <p className="text-sm font-semibold text-ivory">{message.title}</p>
              <p className="text-xs text-ivory-dim mt-1">{message.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}