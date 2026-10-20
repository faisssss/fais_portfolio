import { useLenis } from 'lenis/react'
import { useRef } from 'react'
import { TbArrowUp, TbCheck, TbGitBranch } from 'react-icons/tb'
import { contact, profile } from '../../data/resume'
import { useScrollTo } from '../../hooks/useScrollTo'

/** Roughly how many "lines" one screen of scrolling is worth, for the live Ln counter. */
const PX_PER_LINE = 24
const YEAR = new Date().getFullYear()

/**
 * Footer + an editor-style status bar. The "Ln" readout follows the Lenis scroll position
 * through useLenis, writing straight to the DOM so scrolling never re-renders React.
 */
export function StatusBar() {
  const lineRef = useRef<HTMLSpanElement>(null)
  const percentRef = useRef<HTMLSpanElement>(null)
  const scrollTo = useScrollTo()

  useLenis((lenis) => {
    if (lineRef.current) lineRef.current.textContent = String(Math.floor(lenis.animatedScroll / PX_PER_LINE) + 1)
    if (percentRef.current) percentRef.current.textContent = `${Math.round(lenis.progress * 100)}%`
  })

  return (
    <footer className="relative border-t border-line bg-surface/40 lg:pb-7">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-12 sm:px-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-lg font-semibold text-fg">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">
            {profile.degree} · <a className="hover:text-accent" href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>
        <p className="font-mono text-xs text-subtle">
          © {YEAR} {profile.name}. Built with React, GSAP, Lenis &amp; React Bits.
        </p>
      </div>

      {/* Status bar: fixed to the bottom on large screens, like an IDE */}
      <div className="flex h-7 items-center justify-between bg-[#0f3a1f] px-3 font-mono text-[11px] text-[#c9f7cf] lg:fixed lg:inset-x-0 lg:bottom-0 lg:z-40">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <TbGitBranch aria-hidden="true" className="size-3.5" />
            main
          </span>
          <span className="hidden items-center gap-1 sm:flex">
            <TbCheck aria-hidden="true" className="size-3.5" />0 problems
          </span>
        </div>
        <div className="flex items-center gap-4" aria-hidden="true">
          <span>
            Ln <span ref={lineRef}>1</span>, Col 1
          </span>
          <span ref={percentRef} className="hidden sm:inline">
            0%
          </span>
          <span className="hidden md:inline">UTF-8</span>
          <span className="hidden md:inline">TypeScript JSX</span>
        </div>
        <button
          type="button"
          onClick={() => scrollTo('top')}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 transition-colors hover:bg-white/10"
        >
          <TbArrowUp aria-hidden="true" className="size-3.5" />
          top
        </button>
      </div>
    </footer>
  )
}
