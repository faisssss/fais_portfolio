import SplitText from '../reactbits/SplitText'

interface SectionHeadingProps {
  index: string
  file: string
  title: string
  id: string
  description?: string
}

/** "01 ── about.ts" kicker, a React Bits SplitText heading and an optional intro line. */
export function SectionHeading({ index, file, title, id, description }: SectionHeadingProps) {
  return (
    <header className="mb-12 md:mb-16">
      <p className="flex items-center gap-3 font-mono text-sm">
        <span className="text-accent">{index}</span>
        <span aria-hidden="true" className="h-px w-10 bg-accent/40" />
        <span className="text-muted">{file}</span>
      </p>
      <div className="mt-4">
        <SplitText
          tag="h2"
          id={id}
          text={title}
          textAlign="left"
          splitType="words, chars"
          effect="rise"
          mask
          delay={22}
          duration={0.9}
          threshold={0.15}
          rootMargin="0px"
          className="text-[clamp(2.25rem,6vw,4.5rem)] leading-[1.02] font-semibold tracking-[-0.035em] text-fg"
        />
      </div>
      {description && <p className="mt-5 max-w-2xl text-base text-muted md:text-lg">{description}</p>}
    </header>
  )
}
