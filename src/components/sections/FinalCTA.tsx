import ScrollReveal from '../react-bits/ScrollReveal'
import MagnetButton from '../react-bits/MagnetButton'
import ChessMatrixCanvas from '../react-bits/ChessMatrixCanvas'

export default function FinalCTA() {
  return (
    <section className="relative min-h-[80vh] min-h-[80svh] flex items-center justify-center overflow-hidden bg-obsidian">
      <ChessMatrixCanvas className="absolute inset-0 w-full h-full" />
      <div className="absolute inset-0 bg-gradient-to-b from-obsidian/80 via-obsidian/60 to-obsidian/95" />

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <ScrollReveal>
          <img src="/logo/loading.png" alt="Chessware Neuro" className="h-16 md:h-20 w-auto object-contain mx-auto mb-8" />
          <h2 className="text-4xl md:text-7xl font-black text-ivory leading-tight mb-8">
            YOUR NEXT MOVE{' '}
            <span className="text-gradient-gold">STARTS HERE.</span>
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <MagnetButton
            className="bg-gold text-obsidian px-10 py-5 rounded-lg font-bold text-sm tracking-widest uppercase glow-gold-strong"
            onClick={() => window.dispatchEvent(new CustomEvent('open-booking'))}
          >
            Book a Free Trial
          </MagnetButton>
        </ScrollReveal>
        <ScrollReveal delay={0.4}>
          <p className="text-xs font-mono tracking-[0.3em] text-ivory-dim mt-10">
            CHESSWARE NEURO • TECHNOLOGY • STRATEGY • LEARNING
          </p>
        </ScrollReveal>
      </div>
    </section>
  )
}