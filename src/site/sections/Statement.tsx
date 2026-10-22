import ScrollReveal from '../../components/reactbits/ScrollReveal'
import { container } from '../ui'

/** The large intro sentence, revealed word by word as it scrolls through (React Bits ScrollReveal). */
export function Statement({ text }: { text: string }) {
  return (
    <section aria-label="Introduction" className={`${container} py-28 md:py-44`}>
      <ScrollReveal
        as="p"
        containerClassName="max-w-5xl"
        textClassName="font-serif text-[clamp(2rem,4.6vw,4.25rem)] leading-[1.1] tracking-[-0.01em] text-fg"
        baseOpacity={0.12}
        blurStrength={6}
        baseRotation={0}
        wordAnimationEnd="bottom 60%"
      >
        {text}
      </ScrollReveal>
    </section>
  )
}
