import { useLenis } from 'lenis/react'
import { useRef, type FocusEvent } from 'react'
import { TbArrowUpRight } from 'react-icons/tb'
import { projects } from '../../data/resume'
import { gsap, media, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { EditorWindow } from '../ui/EditorWindow'
import { SectionHeading } from '../ui/SectionHeading'
import { chip } from '../ui/styles'

export function Projects() {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const pin = useRef<ScrollTrigger | null>(null)
  const lenis = useLenis()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ desktop: media.desktop, motionOK: media.motionOK }, (context) => {
        const { desktop, motionOK } = context.conditions as { desktop: boolean; motionOK: boolean }
        if (!motionOK) return

        if (!desktop) {
          // Phones and tablets: a plain vertical list with simple reveals, no pinning.
          gsap.utils.toArray<HTMLElement>('[data-project]').forEach((card) => {
            gsap.from(card, { opacity: 0, y: 48, duration: 0.9, scrollTrigger: { trigger: card, start: 'top 85%', once: true } })
          })
          return
        }

        const trackEl = track.current!
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth)

        // Pinned horizontal scroll: vertical scroll distance drives the track's x (and the progress bar).
        // Everything in this timeline is linear so it can also act as the containerAnimation below.
        const run = gsap
          .timeline({ defaults: { ease: 'none' } })
          .to(trackEl, { x: () => -distance() }, 0)
          .fromTo('[data-projects-progress]', { scaleX: 0 }, { scaleX: 1 }, 0)

        pin.current = ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true, // Lenis already smooths the scroll, so no extra scrub lag
          animation: run,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        })

        // Each card swings into place as it travels across the viewport.
        gsap.utils.toArray<HTMLElement>('[data-project]').forEach((card) => {
          gsap.fromTo(
            card.querySelector('[data-project-inner]'),
            { rotateY: -16, scale: 0.9, autoAlpha: 0.3, transformPerspective: 1400, transformOrigin: '0% 50%' },
            {
              rotateY: 0,
              scale: 1,
              autoAlpha: 1,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: run, start: 'left 100%', end: 'left 55%', scrub: true },
            },
          )
        })

        return () => {
          pin.current = null
        }
      })
    },
    { scope: root },
  )

  // Keyboard users tabbing to a link inside an off-screen card: scroll the page so that card is in view.
  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const st = pin.current
    const card = (event.target as HTMLElement).closest<HTMLElement>('[data-project]')
    if (!st || !card || !lenis) return
    const maxX = st.end - st.start
    const x = Math.min(maxX, Math.max(0, card.offsetLeft - (window.innerWidth - card.offsetWidth) / 2))
    lenis.scrollTo(st.start + x, { immediate: true })
  }

  return (
    <section
      id="projects"
      ref={root}
      tabIndex={-1}
      aria-labelledby="projects-title"
      className="relative overflow-hidden lg:motion-safe:h-svh"
    >
      <div
        ref={track}
        onFocus={handleFocus}
        className={[
          // Phones, tablets and reduced motion: a normal grid inside the page container
          'mx-auto grid max-w-6xl gap-6 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32 lg:motion-reduce:grid-cols-3',
          // Desktop with motion: one long row that the pinned ScrollTrigger slides sideways
          'lg:motion-safe:mx-0 lg:motion-safe:flex lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:items-center lg:motion-safe:gap-10 lg:motion-safe:py-0 lg:motion-safe:pr-[12vw] lg:motion-safe:pl-[max(2rem,calc((100vw-72rem)/2+2rem))]',
        ].join(' ')}
      >
        <div className="max-w-xl shrink-0 md:col-span-2 lg:motion-reduce:col-span-3 lg:motion-safe:w-[26rem]">
          <SectionHeading
            index="04"
            file="ls ./projects"
            title="Selected projects"
            id="projects-title"
            description="Things I've built — from NLP to computer vision to everyday automation."
          />
          <div className="-mt-4 hidden items-center gap-4 font-mono text-xs text-subtle lg:motion-safe:flex" aria-hidden="true">
            <span>scroll</span>
            <span className="relative h-px w-40 overflow-hidden bg-line">
              <span data-projects-progress className="absolute inset-0 origin-left bg-accent" />
            </span>
            <span>{String(projects.length).padStart(2, '0')}</span>
          </div>
        </div>

        {projects.map((project, i) => (
          <article
            key={project.slug}
            data-project
            aria-labelledby={`project-${project.slug}`}
            className="shrink-0 lg:motion-safe:w-[min(34rem,42vw)]"
          >
            <div data-project-inner className="h-full">
              <EditorWindow
                spotlight
                title={project.file}
                className="h-full"
                bodyClassName="flex flex-1 flex-col p-6 md:p-8"
                badge={
                  project.status && (
                    <span className="rounded-full border border-prop/40 bg-prop/10 px-2 py-0.5 font-mono text-[11px] text-prop">
                      {project.status}
                    </span>
                  )
                }
              >
                <span
                  aria-hidden="true"
                  className="font-mono text-5xl leading-none font-bold text-transparent [-webkit-text-stroke:1px_rgb(240_246_252/0.22)] md:text-6xl"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 id={`project-${project.slug}`} className="mt-5 text-2xl font-semibold tracking-tight text-fg md:text-3xl">
                  {project.title}
                </h3>
                <p className="mt-3 text-muted">{project.summary}</p>
                <ul className="mt-6 space-y-2.5 text-sm text-fg/85">
                  {project.points.map((point) => (
                    <li key={point} className="flex gap-3">
                      <span aria-hidden="true" className="text-accent">
                        ▹
                      </span>
                      {point}
                    </li>
                  ))}
                </ul>
                <ul className="mt-auto flex flex-wrap gap-2 pt-8" aria-label="Built with">
                  {project.stack.map((tech) => (
                    <li key={tech} className={chip}>
                      {tech}
                    </li>
                  ))}
                </ul>
                {project.links && project.links.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-4">
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-sm text-accent hover:underline"
                      >
                        {link.label}
                        <TbArrowUpRight aria-hidden="true" />
                      </a>
                    ))}
                  </div>
                )}
              </EditorWindow>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
