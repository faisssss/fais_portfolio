import AnimatedContent from '../../components/reactbits/AnimatedContent'
import type { Service } from '../../content/types'
import { SectionHeader } from '../SectionHeader'
import { container } from '../ui'

interface ServicesProps {
  id: string
  heading: string
  intro?: string
  services: Service[]
}

/** Numbered list of services; rows stagger in (React Bits AnimatedContent) and slide on hover. */
export function Services({ id, heading, intro, services }: ServicesProps) {
  if (!services.length) return null
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={`${container} py-24 md:py-32`}>
      <SectionHeader id={`${id}-title`} heading={heading} intro={intro} className="mb-12 md:mb-16" />
      <AnimatedContent stagger={0.1} distance={40} duration={0.9} threshold={0.15} className="border-t border-line">
        {services.map((service, index) => (
          <div
            key={`${service.title}-${index}`}
            className="group grid gap-3 border-b border-line py-8 md:grid-cols-[6rem_1fr_1fr] md:items-baseline md:gap-8 md:py-10"
          >
            <span className="text-sm text-accent tabular-nums">{String(index + 1).padStart(2, '0')}</span>
            <h3 className="font-serif text-4xl font-normal transition-transform duration-500 ease-out group-hover:translate-x-3 md:text-5xl">
              {service.title}
            </h3>
            {service.text && <p className="max-w-md text-base text-muted md:text-lg">{service.text}</p>}
          </div>
        ))}
      </AnimatedContent>
    </section>
  )
}
