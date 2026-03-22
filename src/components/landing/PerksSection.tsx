import { LANDING_CONTENT } from '../../data/content'

export function PerksSection() {
  const { perks } = LANDING_CONTENT

  return (
    <section className="bg-surface px-8 py-24">
      <div className="max-w-7xl mx-auto flex flex-col gap-16">
        <h2 className="text-[2rem] font-bold text-on-surface tracking-[-0.02em]">
          {perks.title}
        </h2>
        <div className="flex flex-col gap-8">
          {perks.items.map((item) => (
            <div key={item.label} className="flex items-start gap-6">
              <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                {item.icon}
              </span>
              <div className="flex flex-col gap-1">
                <span className="font-semibold text-on-surface text-lg">{item.label}</span>
                <span className="text-on-surface-variant leading-[1.6]">{item.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
