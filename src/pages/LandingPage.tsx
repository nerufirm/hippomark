import { useEffect } from 'react'
import { HeroSection } from '../components/landing/HeroSection'
import { FeaturesSection } from '../components/landing/FeaturesSection'
import { PerksSection } from '../components/landing/PerksSection'
import { CtaSection } from '../components/landing/CtaSection'
import { Footer } from '../components/layout/Footer'

export function LandingPage() {
  useEffect(() => {
    document.title = 'HippoMark — Keep your favorites afloat'
  }, [])

  return (
    <main>
      <HeroSection />
      <FeaturesSection />
      <PerksSection />
      <CtaSection />
      <Footer />
    </main>
  )
}
