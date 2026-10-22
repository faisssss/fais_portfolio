import { TbBrandInstagram, TbBrandVimeo, TbBrandYoutube } from 'react-icons/tb'
import type { Portfolio } from '../content/types'

/** Icon links for whichever social profiles are filled in. */
export function SocialLinks({ data, className = '' }: { data: Portfolio; className?: string }) {
  const links = [
    { label: 'Instagram', href: data.instagram, Icon: TbBrandInstagram },
    { label: 'YouTube', href: data.youtube, Icon: TbBrandYoutube },
    { label: 'Vimeo', href: data.vimeo, Icon: TbBrandVimeo },
  ].filter((link): link is typeof link & { href: string } => !!link.href)

  if (!links.length) return null
  return (
    <ul className={`flex items-center gap-1 ${className}`}>
      {links.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="grid size-11 place-items-center rounded-full text-muted transition-colors hover:bg-elevated hover:text-fg"
          >
            <Icon aria-hidden="true" className="size-5" />
          </a>
        </li>
      ))}
    </ul>
  )
}
