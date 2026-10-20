import { Fragment, useRef, type ReactNode } from 'react'
import { profile, quickFacts } from '../../data/resume'
import { gsap, media, useGSAP } from '../../lib/gsap'
import CountUp from '../reactbits/CountUp'
import ScrollReveal from '../reactbits/ScrollReveal'
import { EditorWindow } from '../ui/EditorWindow'
import { SectionHeading } from '../ui/SectionHeading'
import { container } from '../ui/styles'

/* Tiny syntax-highlighting helpers for the about.ts panel */
const Kw = ({ children }: { children: ReactNode }) => <span className="text-keyword">{children}</span>
const Prop = ({ children }: { children: ReactNode }) => <span className="text-prop">{children}</span>
const Str = ({ children }: { children: ReactNode }) => <span className="text-string">&quot;{children}&quot;</span>
const Fn = ({ children }: { children: ReactNode }) => <span className="text-fn">{children}</span>
const Num = ({ children }: { children: ReactNode }) => <span className="text-number">{children}</span>


/** One entry per rendered line, formatted the way Prettier would print the object. */
const codeLines: ReactNode[] = [
  <span key="comment" className="text-comment">
    {'// about.ts — the short version'}
  </span>,
  <Fragment key="open">
    <Kw>const</Kw> <Fn>faisal</Fn> = {'{'}
  </Fragment>,
  <Fragment key="name">
    {'  '}
    <Prop>name</Prop>: <Str>{profile.name}</Str>,
  </Fragment>,
  <Fragment key="degree">
    {'  '}
    <Prop>degree</Prop>: <Str>{profile.degree}</Str>,
  </Fragment>,
  <Fragment key="college">
    {'  '}
    <Prop>college</Prop>: <Str>Jyothi Engineering College</Str>,
  </Fragment>,
  <Fragment key="batch">
    {'  '}
    <Prop>batch</Prop>: [<Num>2022</Num>, <Num>2026</Num>],
  </Fragment>,
  <Fragment key="focus">
    {'  '}
    <Prop>focus</Prop>: [<Str>web</Str>, <Str>backend</Str>, <Str>networking</Str>, <Str>security</Str>],
  </Fragment>,
  <Fragment key="open-to">
    {'  '}
    <Prop>openTo</Prop>: [<Str>internships</Str>, <Str>entry-level roles</Str>],
  </Fragment>,
  <Fragment key="traits">
    {'  '}
    <Prop>traits</Prop>: [
  </Fragment>,
  ...profile.traits.map((trait) => (
    <Fragment key={trait}>
      {'    '}
      <Str>{trait}</Str>,
    </Fragment>
  )),
  <Fragment key="traits-close">{'  ],'}</Fragment>,
  <Fragment key="close">{'};'}</Fragment>,
  <Fragment key="blank">&nbsp;</Fragment>,
  <Fragment key="export">
    <Kw>export default</Kw> faisal;
    <span data-code-caret className="ml-1 inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-accent/80" />
  </Fragment>,
]

export function About() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motionOK, () => {
        // The editor tilts up into place as it scrolls in (scrubbed, transform only)…
        gsap.fromTo(
          '[data-about-window]',
          { rotateX: 14, y: 60, transformPerspective: 1100, transformOrigin: '50% 100%' },
          {
            rotateX: 0,
            y: 0,
            ease: 'none',
            scrollTrigger: { trigger: '[data-about-window]', start: 'top bottom', end: 'top 45%', scrub: 0.6 },
          },
        )
        // …and its lines type in one after another.
        gsap.from('[data-code-line]', {
          autoAlpha: 0,
          x: -14,
          duration: 0.45,
          stagger: 0.06,
          ease: 'power2.out',
          scrollTrigger: { trigger: '[data-about-window]', start: 'top 72%', once: true },
        })
        gsap.to('[data-code-caret]', { autoAlpha: 0, repeat: -1, yoyo: true, duration: 0.55, ease: 'steps(1)' })

        // Quick facts rise in together; React Bits CountUp starts counting as each one enters.
        gsap.from('[data-fact]', {
          autoAlpha: 0,
          y: 24,
          duration: 0.7,
          stagger: 0.08,
          scrollTrigger: { trigger: '[data-facts]', start: 'top 88%', once: true },
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="about" ref={root} tabIndex={-1} aria-labelledby="about-title" className="relative py-24 md:py-32">
      <div className={container}>
        <SectionHeading index="01" file="about.ts" title="About me" id="about-title" />

        <div className="grid items-start gap-14 lg:grid-cols-2 lg:gap-16">
          <ScrollReveal
            as="p"
            textClassName="text-[clamp(1.35rem,2.3vw,1.9rem)] leading-[1.42] font-medium tracking-[-0.015em] text-fg"
            baseOpacity={0.14}
            blurStrength={5}
            baseRotation={1.5}
            wordAnimationEnd="bottom 55%"
            rotationEnd="bottom 60%"
          >
            {profile.summary}
          </ScrollReveal>

          <div data-about-window>
            <EditorWindow title="src/about.ts" bodyClassName="py-5 font-mono text-[13px] leading-6">
              <ol className="grid">
                {codeLines.map((line, i) => (
                  <li key={i} data-code-line className="grid grid-cols-[2.75rem_1fr] pr-4">
                    <span className="pr-4 text-right text-subtle/60 select-none" aria-hidden="true">
                      {i + 1}
                    </span>
                    <code className="break-words whitespace-pre-wrap text-fg/90">{line}</code>
                  </li>
                ))}
              </ol>
            </EditorWindow>
          </div>
        </div>

        <dl data-facts className="mt-16 grid grid-cols-2 gap-3 md:grid-cols-4">
          {quickFacts.map((fact) => (
            <div key={fact.label} data-fact className="flex flex-col-reverse rounded-xl border border-line bg-surface/60 p-5">
              <dt className="mt-1.5 font-mono text-xs text-muted">{fact.label}</dt>
              <dd className="text-4xl font-semibold tracking-tight text-fg tabular-nums">
                <CountUp to={fact.value} decimals={fact.decimals} duration={1.8} />
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
