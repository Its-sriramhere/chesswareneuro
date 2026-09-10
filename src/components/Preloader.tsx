import { motion, AnimatePresence } from 'framer-motion'

interface PreloaderProps {
  loading: boolean
}

export default function Preloader({ loading }: PreloaderProps) {
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-obsidian"
          exit={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-obsidian via-obsidian to-obsidian-light" />
          <div className="absolute top-0 left-0 w-2/3 h-2/3 bg-gold/5 blur-[120px] rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-slate/20 blur-[100px] rounded-full translate-x-1/3 translate-y-1/3" />

          <motion.div
            className="relative z-10 text-center px-6"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <motion.span
                className="absolute inset-0 rounded-full border-2 border-gold/20 border-t-gold"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
              />
              <motion.img
                src="/logo/loading.png"
                alt="Chessware Neuro loading"
                className="relative w-16 md:w-20 h-auto object-contain"
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              />
            </div>

            <motion.p
              className="text-xs font-mono tracking-[0.35em] text-ivory-dim mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              CHESSWARE NEURO
            </motion.p>

            <motion.h1
              className="text-2xl md:text-4xl font-black text-ivory mb-10"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Welcome to <span className="text-gradient-gold">"Chessware Neuro"</span>
            </motion.h1>

            <div className="w-64 mx-auto h-1 bg-slate rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-gold-dim to-gold"
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 2, ease: 'easeInOut' }}
              />
            </div>
            <motion.p
              className="text-[10px] font-mono tracking-widest text-gold mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 1, 0] }}
              transition={{ duration: 2.2, times: [0, 0.2, 0.8, 0.95, 1] }}
            >
              LOADING THE BOARD…
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}