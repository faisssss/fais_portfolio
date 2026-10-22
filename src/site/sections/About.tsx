import { useRef } from 'react'
import { gsap, media, useGSAP } from '../../lib/gsap'
import { SectionHeader } from '../SectionHeader'
import { container, paragraphs } from '../ui'
import { hideOnError } from '../hideOnError'

interface AboutProps {
  id: string
  heading: string
  intro?: string
  portrait?: string
  bio?: string
  tools?: string[]
}

/** Portrait with a slow parallax drift inside its frame, beside the bio. */
export function About({ id, heading, intro, portrait, bio, tools = [] }: AboutProps) {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      gsap.matchMedia().add(media.motionOK, () => {
        gsap.fromTo(
          '[data-portrait]',
          { yPercent: -8, scale: 1.15 },
          { yPercent: 8, scale: 1.15, ease: 'none', scrollTrigger: { trigger: '[data-portrait-frame]', start: 'top bottom', end: 'bottom top', scrub: true } },
        )
        gsap.from('[data-about-copy] > *', {
          opacity: 0,
          y: 24,
          duration: 0.9,
          stagger: 0.1,
          scrollTrigger: { trigger: '[data-about-copy]', start: 'top 80%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={`${container} py-24 md:py-32`}>
      <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
        {portrait && (
          <div data-portrait-frame className="relative aspect-[4/5] overflow-hidden rounded bg-elevated">
            <img onError={hideOnError} data-portrait src={portrait} alt="" loading="lazy" className="absolute inset-0 size-full object-cover" />
          </div>
        )}
        <div>
          <SectionHeader id={`${id}-title`} heading={heading} intro={intro} className="mb-8" />
          <div data-about-copy className="space-y-5 text-lg leading-relaxed text-fg/90 md:text-xl">
            {paragraphs(bio).map((p, i) => (
              <p key={i} className={i > 0 ? 'text-muted' : undefined}>
                {p}
              </p>
            ))}
            {tools.length > 0 && (
              <ul className="flex flex-wrap gap-2 pt-4" aria-label="Gear and software">
                {tools.map((tool) => (
                  <li key={tool} className="rounded-full border border-line px-4 py-2 text-sm">
                    {tool}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
