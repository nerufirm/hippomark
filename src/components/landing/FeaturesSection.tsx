import { FeatureCard } from '../ui/FeatureCard'
import { LANDING_CONTENT } from '../../data/content'

export function FeaturesSection() {
  const { features } = LANDING_CONTENT

  return (
    <section className="bg-surface-low px-8 py-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <h2 className="text-[2rem] font-bold text-on-surface tracking-[-0.02em] text-center">
          {features.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.items.map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  )
}
