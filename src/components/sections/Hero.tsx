import { useRef, useState } from 'react'
import { TbBrandGithub, TbBrandLinkedin, TbMail } from 'react-icons/tb'
import { contact, profile } from '../../data/resume'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrollTo } from '../../hooks/useScrollTo'
import { gsap, media, useGSAP } from '../../lib/gsap'
import { useIntroDone } from '../../providers/intro'
import DecryptedText from '../reactbits/DecryptedText'
import FaultyTerminal from '../reactbits/FaultyTerminal'
import Magnet from '../reactbits/Magnet'
import TextType from '../reactbits/TextType'
import { buttonGhost, buttonPrimary, container } from '../ui/styles'

const socials = [
  { label: 'GitHub', href: contact.github.href, Icon: TbBrandGithub },
  { label: 'LinkedIn', href: contact.linkedin.href, Icon: TbBrandLinkedin },
  { label: 'Email', href: `mailto:${contact.email}`, Icon: TbMail },
]

export function Hero() {
  const root = useRef<HTMLElement>(null)
  const introDone = useIntroDone()
  // Whether the boot intro is covering the page on this load (decides how the background appears).
  const [introPlaying] = useState(!introDone)
  const scrollTo = useScrollTo()
  const small = useMediaQuery('(max-width: 767px)')
  const reduced = useMediaQuery(media.reduceMotion)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add(media.motionOK, () => {
        const reveal = gsap.utils.toArray<HTMLElement>('[data-hero-reveal]')

        // Hidden under the boot overlay until it starts to lift.
        if (!introDone) {
          gsap.set(reveal, { autoAlpha: 0, y: 28 })
          gsap.set('[data-hero-bg-inner]', { autoAlpha: 0, scale: 1.08 })
          return
        }

        gsap.fromTo(
          reveal,
          { autoAlpha: 0, y: 28 },
          { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.09, delay: 0.1, ease: 'power3.out' },
        )
        if (introPlaying) {
          gsap.fromTo(
            '[data-hero-bg-inner]',
            { autoAlpha: 0, scale: 1.08 },
            { autoAlpha: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
          )
        }
        gsap.fromTo('[data-scroll-cue]', { autoAlpha: 0 }, { autoAlpha: 1, delay: 1.4, duration: 0.6 })
        gsap.to('[data-scroll-cue-dot]', { y: 10, repeat: -1, yoyo: true, duration: 0.9, ease: 'sine.inOut' })

        // Leaving the hero: copy drifts up and fades, the terminal recedes. Scrubbed to the scroll position.
        gsap
          .timeline({
            scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
          })
          .to('[data-hero-content]', { yPercent: -22, opacity: 0, ease: 'none' }, 0)
          .to('[data-hero-bg]', { scale: 1.1, autoAlpha: 0.2, ease: 'none' }, 0)
          .to('[data-scroll-cue]', { autoAlpha: 0, ease: 'none', duration: 0.2 }, 0)
      })
    },
    { scope: root, dependencies: [introDone], revertOnUpdate: true },
  )

  return (
    <section
      id="top"
      ref={root}
      aria-label="Introduction"
      className="relative isolate flex min-h-svh items-center overflow-hidden"
    >
      {/* Background: React Bits FaultyTerminal tinted with the accent, softened by gradients */}
      <div data-hero-bg className="absolute inset-0 -z-10" aria-hidden="true">
        <div data-hero-bg-inner className="absolute inset-0">
          <FaultyTerminal
            className="absolute inset-0"
            tint="#7ee787"
            brightness={0.5}
            scale={1.5}
            gridMul={[2, 1]}
            digitSize={1.25}
            glyphs="characters"
            timeScale={0.45}
            scanlineIntensity={0.35}
            glitchAmount={1}
            flickerAmount={0.5}
            noiseAmp={0.85}
            curvature={0.06}
            glow={0.55}
            mouseReact
            mouseStrength={0.3}
            mouseGlow={0.7}
            vignette={0.35}
            clickEffect="none"
            pageLoadAnimation={!introPlaying}
            dpr={small ? 0.75 : 1}
          />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_28%_50%,rgb(7_9_13/0.92),rgb(7_9_13/0.55)_55%,rgb(7_9_13/0.15))]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-bg" />
      </div>

      <div data-hero-content className={`${container} pt-28 pb-24`}>
        <p data-hero-reveal className="font-mono text-sm text-muted">
          <span className="text-accent">{profile.handle}@portfolio</span>
          <span className="text-fg">:</span>
          <span className="text-number">~</span>
          <span className="text-fg">$</span> whoami
        </p>

        <h1
          data-hero-reveal
          className="mt-5 text-[clamp(3rem,10.5vw,8rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-fg"
        >
          <DecryptedText
            text={profile.name}
            animateOn={introDone ? 'view' : 'click'}
            sequential
            revealDirection="start"
            speed={42}
            characters="01<>/{}[]#$%&*=+;:ABCDEFabcdef"
            encryptedClassName="text-accent/80"
          />
        </h1>

        <div data-hero-reveal className="mt-7 min-h-[1.75em] font-mono text-lg text-fg/90 md:text-2xl">
          {introDone && !reduced ? (
            <TextType
              as="p"
              text={[...profile.roles]}
              prefix="> "
              prefixColor="var(--color-accent)"
              typingSpeed={42}
              deletingSpeed={22}
              pauseDuration={2200}
              initialDelay={600}
              cursorStyle="block"
              cursorColor="var(--color-accent)"
              deleteMode="select"
            />
          ) : (
            <p>
              <span className="text-accent">&gt; </span>
              {profile.roles[0]}
            </p>
          )}
        </div>

        <p data-hero-reveal className="mt-6 max-w-xl text-base text-muted md:text-lg">
          {profile.degree} · {profile.college}
        </p>

        <div data-hero-reveal className="mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
          <Magnet padding={70} magnetStrength={4}>
            <a
              href="#projects"
              className={buttonPrimary}
              onClick={(event) => {
                event.preventDefault()
                scrollTo('projects')
              }}
            >
              View projects
            </a>
          </Magnet>
          <Magnet padding={70} magnetStrength={4}>
            <a
              href="#contact"
              className={buttonGhost}
              onClick={(event) => {
                event.preventDefault()
                scrollTo('contact')
              }}
            >
              Get in touch
            </a>
          </Magnet>
          <ul className="ml-1 flex items-center gap-1">
            {socials.map(({ label, href, Icon }) => (
              <li key={label}>
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  aria-label={label}
                  className="grid size-11 place-items-center rounded-lg text-muted transition-colors hover:bg-elevated hover:text-accent"
                >
                  <Icon className="size-5" aria-hidden="true" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p
          data-hero-reveal
          className="mt-12 inline-flex items-center gap-2.5 rounded-full border border-accent/25 bg-accent/10 px-3.5 py-1.5 font-mono text-xs text-accent"
        >
          <span className="relative flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex size-2 rounded-full bg-accent" />
          </span>
          {profile.openTo}
        </p>
      </div>

      {/* Mouse affordance only: keyboard and screen-reader users already have the section nav */}
      <a
        href="#about"
        data-scroll-cue
        tabIndex={-1}
        aria-hidden="true"
        onClick={(event) => {
          event.preventDefault()
          scrollTo('about')
        }}
        className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[11px] tracking-widest text-subtle uppercase transition-colors hover:text-fg sm:flex"
      >
        scroll
        <span className="flex h-8 w-5 justify-center rounded-full border border-line-strong pt-1.5" aria-hidden="true">
          <span data-scroll-cue-dot className="size-1 rounded-full bg-accent" />
        </span>
      </a>
    </section>
  )
}
