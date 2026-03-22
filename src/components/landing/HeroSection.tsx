import { useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import hippoSvg from '../../assets/hippo.svg'
import { LANDING_CONTENT } from '../../data/content'

export function HeroSection() {
  const navigate = useNavigate()
  const { hero } = LANDING_CONTENT

  return (
    <section className="bg-surface px-8 py-24 lg:py-32">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Copy */}
        <div className="flex flex-col gap-8">
          <span className="inline-flex items-center self-start bg-primary-fixed text-primary text-xs font-medium uppercase tracking-[0.05em] px-4 py-2 rounded-full">
            {hero.badge}
          </span>
          <h1 className="text-[3.5rem] font-bold text-on-surface leading-[1.1] tracking-[-0.02em]">
            {hero.headline}
          </h1>
          <p className="text-lg text-on-surface-variant leading-[1.6] max-w-lg">
            {hero.subheadline}
          </p>
          <p className="text-base text-on-surface-variant leading-[1.6]">
            {hero.body}
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/app')}>
              {hero.ctaPrimary}
            </Button>
            <Button variant="ghost" size="lg" onClick={() => navigate('/dashboard')}>
              {hero.ctaSecondary}
            </Button>
          </div>
        </div>

        {/* Right: Hippo illustration */}
        <div className="flex justify-center lg:justify-end">
          <img
            src={hippoSvg}
            alt="HippoMark mascot — a friendly hippo holding a bookmark"
            className="w-full max-w-sm lg:max-w-md"
          />
        </div>
      </div>
    </section>
  )
}
