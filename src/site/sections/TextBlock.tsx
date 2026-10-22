import { SectionHeader } from '../SectionHeader'
import { container, paragraphs } from '../ui'

interface TextBlockProps {
  id: string
  heading: string
  intro?: string
  body?: string
}

/** A free heading + text section Shefin can add anywhere from /admin. */
export function TextBlock({ id, heading, intro, body }: TextBlockProps) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={`${container} py-24 md:py-32`}>
      <div className="grid gap-10 lg:grid-cols-2">
        <SectionHeader id={`${id}-title`} heading={heading} intro={intro} />
        <div className="space-y-5 text-lg leading-relaxed text-fg/90 md:text-xl">
          {paragraphs(body).map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  )
}
