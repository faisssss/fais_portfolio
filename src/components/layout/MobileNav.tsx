import { useLenis } from 'lenis/react'
import { contact, profile, sections } from '../../data/resume'
import { useScrollTo } from '../../hooks/useScrollTo'
import { StaggeredMenu } from '../reactbits/StaggeredMenu'

const items = sections.map(({ id, label }) => ({ label, ariaLabel: `Go to ${label}`, link: `#${id}` }))

const socialItems = [
  { label: 'GitHub', link: contact.github.href },
  { label: 'LinkedIn', link: contact.linkedin.href },
  { label: 'Email', link: `mailto:${contact.email}` },
]

/** Phones and tablets: React Bits StaggeredMenu. Lenis pauses while it's open and handles the jump after. */
export function MobileNav() {
  const lenis = useLenis()
  const scrollTo = useScrollTo()

  return (
    <div className="lg:hidden">
      <StaggeredMenu
        isFixed
        position="right"
        colors={['#7ee787', '#161b22']}
        accentColor="#7ee787"
        menuButtonColor="#e6edf3"
        openMenuButtonColor="#e6edf3"
        items={items}
        socialItems={socialItems}
        displaySocials
        displayItemNumbering
        logo={
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault()
              scrollTo('top')
            }}
            className="flex items-center gap-2 font-mono text-sm text-fg"
          >
            <span className="grid size-7 place-items-center rounded-md border border-accent/40 bg-accent/10 text-xs text-accent">
              &gt;_
            </span>
            ~/{profile.handle}
          </a>
        }
        onMenuOpen={() => lenis?.stop()}
        onMenuClose={() => lenis?.start()}
        onItemSelect={(item) => scrollTo(item.link.slice(1))}
      />
    </div>
  )
}
