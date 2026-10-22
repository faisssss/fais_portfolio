import { useLenis } from 'lenis/react'
import { useRef, type MouseEvent } from 'react'
import { StaggeredMenu } from '../components/reactbits/StaggeredMenu'
import type { Portfolio } from '../content/types'
import { useScrollTo } from '../hooks/useScrollTo'
import { gsap, prefersReducedMotion, ScrollTrigger, useGSAP } from '../lib/gsap'

export interface NavLink {
  id: string
  label: string
}

interface HeaderProps {
  data: Portfolio
  links: NavLink[]
  contactId?: string
}

/**
 * Desktop: a quiet bar that slides away while scrolling down and returns when scrolling up.
 * Phones: React Bits StaggeredMenu, which pauses Lenis while it's open.
 */
export function Header({ data, links, contactId }: HeaderProps) {
  const bar = useRef<HTMLElement>(null)
  const scrollTo = useScrollTo()
  const lenis = useLenis()

  useGSAP(
    () => {
      const el = bar.current
      if (!el) return
      const show = gsap.quickTo(el, 'yPercent', { duration: 0.45, ease: 'power3.out' })
      ScrollTrigger.create({
        start: 0,
        end: 'max',
        refreshPriority: -1, // created before the pinned sections further down
        onUpdate: (self) => {
          const y = self.scroll()
          el.toggleAttribute('data-scrolled', y > 40)
          if (!prefersReducedMotion()) show(y > 200 && self.direction === 1 ? -110 : 0)
        },
      })
    },
    { scope: bar },
  )

  const go = (id: string) => (event: MouseEvent) => {
    event.preventDefault()
    scrollTo(id)
  }

  return (
    <>
      <header
        ref={bar}
        className="fixed inset-x-0 top-0 z-40 hidden transition-[background-color,backdrop-filter] duration-500 data-[scrolled]:bg-bg/75 data-[scrolled]:backdrop-blur-lg lg:block"
      >
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-8 px-12 py-5">
          <a href="#top" onClick={go('top')} className="font-serif text-[1.75rem] leading-none">
            {data.name}
          </a>
          <nav aria-label="Sections" className="flex items-center gap-8 text-sm">
            {links.map((link) => (
              <a key={link.id} href={`#${link.id}`} onClick={go(link.id)} className="text-fg/80 transition-colors hover:text-accent">
                {link.label}
              </a>
            ))}
            {contactId && (
              <a
                href={`#${contactId}`}
                onClick={go(contactId)}
                className="rounded-full border border-fg/40 px-5 py-2.5 transition-colors hover:border-accent hover:text-accent"
              >
                Get in touch
              </a>
            )}
          </nav>
        </div>
      </header>

      <div className="lg:hidden">
        <StaggeredMenu
          isFixed
          position="right"
          colors={['#e0a458', '#1d1d1b']}
          accentColor="#e0a458"
          menuButtonColor="#ecebe6"
          openMenuButtonColor="#ecebe6"
          items={links.map((link) => ({ label: link.label, ariaLabel: `Go to ${link.label}`, link: `#${link.id}` }))}
          socialItems={[
            ...(data.instagram ? [{ label: 'Instagram', link: data.instagram }] : []),
            ...(data.youtube ? [{ label: 'YouTube', link: data.youtube }] : []),
            ...(data.email ? [{ label: 'Email', link: `mailto:${data.email}` }] : []),
          ]}
          displaySocials
          displayItemNumbering
          logo={
            <a href="#top" onClick={go('top')} className="font-serif text-2xl leading-none text-fg">
              {data.name}
            </a>
          }
          onMenuOpen={() => lenis?.stop()}
          onMenuClose={() => lenis?.start()}
          onItemSelect={(item) => scrollTo(item.link.slice(1))}
        />
      </div>
    </>
  )
}
