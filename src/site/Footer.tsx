import { TbArrowUp } from 'react-icons/tb'
import type { Portfolio } from '../content/types'
import { useScrollTo } from '../hooks/useScrollTo'
import { SocialLinks } from './SocialLinks'
import { container } from './ui'

const YEAR = new Date().getFullYear()

export function Footer({ data }: { data: Portfolio }) {
  const scrollTo = useScrollTo()
  return (
    <footer className="border-t border-line">
      <div className={`${container} flex flex-wrap items-center justify-between gap-6 py-10 text-sm text-muted`}>
        <p>
          © {YEAR} {data.name} · {data.role}
        </p>
        <div className="flex items-center gap-4">
          <SocialLinks data={data} />
          <button
            type="button"
            onClick={() => scrollTo('top')}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 transition-colors hover:border-fg hover:text-fg"
          >
            <TbArrowUp aria-hidden="true" className="size-4" />
            Back to top
          </button>
        </div>
      </div>
    </footer>
  )
}
