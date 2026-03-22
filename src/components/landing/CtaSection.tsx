import { useNavigate } from 'react-router-dom'
import { LANDING_CONTENT } from '../../data/content'

export function CtaSection() {
  const navigate = useNavigate()
  const { cta } = LANDING_CONTENT

  return (
    <section className="bg-gradient-to-br from-primary to-primary-container px-8 py-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-8 text-center">
        <h2 className="text-[2rem] font-bold text-white tracking-[-0.02em]">
          {cta.headline}
        </h2>
        <p className="text-white/80 text-lg leading-[1.6]">{cta.sub}</p>
        <button
          onClick={() => navigate('/app')}
          className="bg-white text-primary font-semibold px-8 py-4 rounded-full text-lg hover:bg-surface-low transition-colors duration-200"
        >
          {cta.button}
        </button>
      </div>
    </section>
  )
}
