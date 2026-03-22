interface FeatureCardProps {
  icon: string
  title: string
  description: string
}

export function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-surface-lowest rounded-2xl p-8 shadow-[0_8px_32px_rgba(26,28,31,0.04)] flex flex-col gap-4">
      <span className="text-4xl" role="img" aria-hidden="true">{icon}</span>
      <h3 className="text-xl font-semibold text-on-surface tracking-tight">{title}</h3>
      <p className="text-base text-on-surface-variant leading-relaxed">{description}</p>
    </div>
  )
}
