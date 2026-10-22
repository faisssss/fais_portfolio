import SplitText from '../components/reactbits/SplitText'
import { sectionHeading } from './ui'

interface SectionHeaderProps {
  id: string
  heading: string
  intro?: string
  className?: string
}

/** Section heading revealed word by word (React Bits SplitText) with an optional intro line. */
export function SectionHeader({ id, heading, intro, className }: SectionHeaderProps) {
  return (
    <header className={className}>
      <SplitText
        tag="h2"
        id={id}
        text={heading}
        textAlign="left"
        splitType="words"
        effect="rise"
        mask
        delay={70}
        duration={1.1}
        threshold={0.15}
        rootMargin="0px"
        className={sectionHeading}
      />
      {intro && <p className="mt-5 max-w-xl text-base text-muted md:text-lg">{intro}</p>}
    </header>
  )
}
