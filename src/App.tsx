import { useCallback, useEffect, lazy, Suspense, useState } from 'react'
import CustomCursor from './components/react-bits/CustomCursor'
import Navbar from './components/Navbar'
import HeroSection from './components/sections/HeroSection'
import ScrollTransition from './components/sections/ScrollTransition'
import CompanyIntro from './components/sections/CompanyIntro'
import EcosystemBento from './components/sections/EcosystemBento'
import AcademyPrograms from './components/sections/AcademyPrograms'
import HowItWorks from './components/sections/HowItWorks'
import GlobalNetwork from './components/sections/GlobalNetwork'
import CoachDirectory from './components/sections/CoachDirectory'
import TechFeatures from './components/sections/TechFeatures'
import PerformanceData from './components/sections/PerformanceData'
import PricingPlans from './components/sections/PricingPlans'
import Testimonials from './components/sections/Testimonials'
import FinalCTA from './components/sections/FinalCTA'
import Footer from './components/sections/Footer'
import WhyChessware from './components/sections/WhyChessware'
import BookingModal, { type BookingData } from './components/ui/BookingModal'
import LevelTestModal from './components/ui/LevelTestModal'
import Toast, { type ToastMessage } from './components/ui/Toast'
import Preloader from './components/Preloader'
import ChessMatrixCanvas from './components/react-bits/ChessMatrixCanvas'
import { sendBookingEmail } from './lib/sendBookingEmail'

const ChessboardHero = lazy(() => import('./components/sections/ChessboardHero'))

function ChessboardPlaceholder() {
  return (
    <section className="py-24 bg-obsidian/60">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-center min-h-[300px] text-ivory-dim">
        <span className="text-xs font-mono tracking-widest animate-pulse">LOADING 3D MATRIX…</span>
      </div>
    </section>
  )
}

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false)
  const [levelTestOpen, setLevelTestOpen] = useState(false)
  const [initialProgram, setInitialProgram] = useState<string | null>(null)
  const [toast, setToast] = useState<ToastMessage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const minLoad = new Promise<void>((resolve) => setTimeout(resolve, 2400))
    const pageLoad =
      document.readyState === 'complete'
        ? Promise.resolve()
        : new Promise<void>((resolve) => window.addEventListener('load', () => resolve(), { once: true }))
    Promise.all([minLoad, pageLoad]).then(() => setLoading(false))
  }, [])

  useEffect(() => {
    document.body.style.overflow = loading ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [loading])

  useEffect(() => {
    const openBooking = (e: Event) => {
      const detail = (e as CustomEvent).detail as { program?: string } | undefined
      setInitialProgram(detail?.program ?? null)
      setBookingOpen(true)
    }
    window.addEventListener('open-booking', openBooking)
    window.addEventListener('open-booking-modal', openBooking)
    return () => {
      window.removeEventListener('open-booking', openBooking)
      window.removeEventListener('open-booking-modal', openBooking)
    }
  }, [])

  const showToast = useCallback((title: string, description: string) => {
    setToast({ id: Date.now(), title, description })
  }, [])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 5000)
    return () => clearTimeout(t)
  }, [toast])

  const handleBookingComplete = useCallback(
    async (data: BookingData) => {
      await sendBookingEmail(data)
      showToast(
        'Booking Request Sent',
        `${data.name}, your request for ${data.coach || 'your coach'} on ${data.date} at ${data.time} has been received. A confirmation email is on its way.`
      )
    },
    [showToast]
  )

  const handleLevelTestComplete = useCallback(
    (level: 'foundation' | 'advanced') => {
      setLevelTestOpen(false)
      showToast(
        `Recommended: ${level.charAt(0).toUpperCase() + level.slice(1)}`,
        'Based on your answers, this is the right level for you. Ready to book a free trial?'
      )
      setTimeout(() => setBookingOpen(true), 600)
    },
    [showToast]
  )

  return (
    <>
      <Preloader loading={loading} />
      <CustomCursor />
      {!loading && (
        <ChessMatrixCanvas className="fixed inset-0 z-0 w-full h-full pointer-events-none" opacity={0.45} />
      )}
      <Navbar />

      <main className="relative z-10">
        <HeroSection ready={!loading} />
        <Suspense fallback={<ChessboardPlaceholder />}>
        <ChessboardHero />
      </Suspense>
        <ScrollTransition />
        <CompanyIntro />
        <EcosystemBento />
        <AcademyPrograms />
        <WhyChessware />
        <HowItWorks />
        <GlobalNetwork />
        <CoachDirectory />
        <TechFeatures />
        <PerformanceData />
        <PricingPlans
          onLevelTest={() => {
            setBookingOpen(false)
            setLevelTestOpen(true)
          }}
        />
        <Testimonials />
        <FinalCTA />
        <Footer />
      </main>

      <BookingModal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        onComplete={handleBookingComplete}
        initialProgram={initialProgram}
      />
      <LevelTestModal
        open={levelTestOpen}
        onClose={() => setLevelTestOpen(false)}
        onComplete={handleLevelTestComplete}
      />
      <Toast message={toast} />
    </>
  )
}