import { useRef, useState } from 'react'
import { TbBrandGithub, TbBrandLinkedin } from 'react-icons/tb'
import { contact, profile, sections, type SectionId } from '../../data/resume'
import { useScrollTo } from '../../hooks/useScrollTo'
import { cn } from '../../lib/cn'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../../lib/gsap'

/** File-type dot colour per tab, like an editor's file icons. */
const tabColors: Record<SectionId, string> = {
  about: 'bg-number',
  skills: 'bg-prop',
  journey: 'bg-fn',
  projects: 'bg-accent',
  contact: 'bg-keyword',
}

/**
 * Desktop navigation styled as editor tabs. ScrollTrigger tracks which section is in view,
 * a GSAP tween slides the active-tab marker, and a scrubbed bar shows overall progress.
 */
export function Navbar() {
  const root = useRef<HTMLElement>(null)
  const [active, setActive] = useState<SectionId | null>(null)
  const scrollTo = useScrollTo()

  // Scroll-linked pieces: created once.
  useGSAP(
    () => {
      gsap.fromTo(
        '[data-nav-progress]',
        { scaleX: 0 },
        { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3, refreshPriority: -1 } },
      )

      sections.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return
        ScrollTrigger.create({
          trigger: el,
          start: 'top 45%',
          end: 'bottom 45%',
          // Created before the pinned projects section exists further down, so refresh these last.
          refreshPriority: -1,
          onToggle: (self) => {
            if (self.isActive) setActive(id)
            else if (id === sections[0].id && self.direction < 0) setActive(null)
          },
        })
      })
    },
    { scope: root },
  )

  // Slide the marker under the active tab (transform only: x + scaleX of a 100px bar).
  useGSAP(
    () => {
      const marker = root.current?.querySelector<HTMLElement>('[data-tab-marker]')
      const tab = active ? root.current?.querySelector<HTMLElement>(`[data-tab="${active}"]`) : null
      if (!marker) return
      const duration = prefersReducedMotion() ? 0 : 0.5
      if (!tab) {
        gsap.to(marker, { autoAlpha: 0, duration: duration / 2, overwrite: 'auto' })
        return
      }
      gsap.to(marker, {
        x: tab.offsetLeft,
        scaleX: tab.offsetWidth / 100,
        autoAlpha: 1,
        duration,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    },
    { scope: root, dependencies: [active] },
  )

  return (
    <header
      ref={root}
      className="fixed inset-x-0 top-0 z-40 hidden border-b border-line bg-bg/75 backdrop-blur-xl lg:block"
    >
      <div className="mx-auto flex h-12 max-w-7xl items-stretch px-4">
        <a
          href="#top"
          onClick={(event) => {
            event.preventDefault()
            scrollTo('top')
          }}
          className="mr-4 flex items-center gap-2 pr-4 font-mono text-sm text-fg"
        >
          <span className="grid size-6 place-items-center rounded-md border border-accent/40 bg-accent/10 text-[11px] text-accent">
            &gt;_
          </span>
          ~/{profile.handle}
        </a>

        <nav aria-label="Sections" className="relative flex-1">
          <ul className="flex h-full">
            {sections.map(({ id, file, label }) => (
              <li key={id} className="flex">
                <a
                  href={`#${id}`}
                  data-tab={id}
                  aria-label={label}
                  aria-current={active === id ? 'location' : undefined}
                  onClick={(event) => {
                    event.preventDefault()
                    scrollTo(id)
                  }}
                  className={cn(
                    'flex items-center gap-2 border-r border-line px-4 font-mono text-[13px] transition-colors first:border-l',
                    active === id ? 'bg-surface text-fg' : 'text-muted hover:bg-surface/60 hover:text-fg',
                  )}
                >
                  <span aria-hidden="true" className={cn('size-1.5 rounded-full', tabColors[id])} />
                  {file}
                </a>
              </li>
            ))}
          </ul>
          <span
            data-tab-marker
            aria-hidden="true"
            className="pointer-events-none invisible absolute top-0 left-0 h-[2px] w-[100px] origin-left bg-accent"
          />
        </nav>

        <div className="flex items-center gap-1">
          <a
            href={contact.github.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <TbBrandGithub className="size-[18px]" aria-hidden="true" />
          </a>
          <a
            href={contact.linkedin.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="grid size-9 place-items-center rounded-md text-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <TbBrandLinkedin className="size-[18px]" aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="h-px overflow-hidden bg-transparent">
        <div data-nav-progress className="h-full origin-left bg-gradient-to-r from-accent/40 via-accent to-accent" />
      </div>
    </header>
  )
}
