import { useRef } from 'react'
import { TbArrowLeft, TbArrowRight, TbArrowUpRight, TbBrandInstagram, TbPlayerPlayFilled } from 'react-icons/tb'
import type { Reel } from '../../content/types'
import { parseVideo } from '../../content/video'
import { gsap, media, useGSAP } from '../../lib/gsap'
import { SectionHeader } from '../SectionHeader'
import { usePlayVideo } from '../playVideo'
import { container } from '../ui'
import { hideOnError } from '../hideOnError'

interface ReelsProps {
  id: string
  heading: string
  intro?: string
  reels: Reel[]
}

/**
 * Vertical (9:16) Instagram reels in a horizontal strip. Instagram's player is only loaded when someone
 * presses play; links that aren't a specific reel (e.g. a profile) open Instagram in a new tab.
 */
export function Reels({ id, heading, intro, reels }: ReelsProps) {
  const root = useRef<HTMLElement>(null)
  const strip = useRef<HTMLUListElement>(null)
  const playVideo = usePlayVideo()

  useGSAP(
    () => {
      gsap.matchMedia().add(media.motionOK, () => {
        gsap.from('[data-reel]', {
          opacity: 0,
          x: 80,
          rotate: 2,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: strip.current, start: 'top 85%', once: true },
        })
      })
    },
    { scope: root },
  )

  const page = (direction: 1 | -1) => {
    const el = strip.current
    const card = el?.querySelector<HTMLElement>('[data-reel]')
    if (!el || !card) return
    el.scrollBy({ left: direction * (card.offsetWidth + 16) * 2, behavior: 'smooth' })
  }

  if (!reels.length) return null

  return (
    <section ref={root} id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="py-24 md:py-32">
      <div className={`${container} mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14`}>
        <SectionHeader id={`${id}-title`} heading={heading} intro={intro} />
        <div className="flex gap-2">
          <button type="button" aria-label="Previous reels" onClick={() => page(-1)} className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-fg">
            <TbArrowLeft aria-hidden="true" className="size-5" />
          </button>
          <button type="button" aria-label="Next reels" onClick={() => page(1)} className="grid size-12 place-items-center rounded-full border border-line transition-colors hover:border-fg">
            <TbArrowRight aria-hidden="true" className="size-5" />
          </button>
        </div>
      </div>

      <ul
        ref={strip}
        data-lenis-prevent-horizontal
        className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8 lg:scroll-px-12 lg:px-12"
      >
        {reels.map((reel, index) => {
          const isReel = parseVideo(reel.url).kind === 'instagram'
          const body = (
            <>
              <span className="absolute inset-0 bg-elevated">
                {reel.cover && (
                  <img onError={hideOnError} src={reel.cover} alt="" loading="lazy" className="size-full object-cover transition-transform duration-700 group-hover:scale-105" />
                )}
              </span>
              <span className="absolute inset-0 bg-[linear-gradient(180deg,rgb(0_0_0/0.35),transparent_30%,transparent_55%,rgb(0_0_0/0.75))]" />
              <TbBrandInstagram aria-hidden="true" className="absolute top-4 left-4 size-6" />
              <span className="absolute inset-0 grid place-items-center">
                <span className="grid size-14 place-items-center rounded-full bg-white/15 backdrop-blur-sm transition-transform group-hover:scale-110">
                  {isReel ? <TbPlayerPlayFilled aria-hidden="true" className="size-5" /> : <TbArrowUpRight aria-hidden="true" className="size-6" />}
                </span>
              </span>
              <span className="absolute inset-x-4 bottom-4 text-base font-medium">{reel.title}</span>
            </>
          )
          const card = 'group relative block aspect-[9/16] w-[clamp(220px,62vw,300px)] overflow-hidden rounded text-left'
          return (
            <li key={`${reel.url}-${index}`} data-reel className="shrink-0 snap-start">
              {isReel ? (
                <button type="button" data-cursor="Play" className={card} onClick={() => playVideo({ url: reel.url, title: reel.title })}>
                  {body}
                </button>
              ) : (
                <a href={reel.url} target="_blank" rel="noopener noreferrer" data-cursor="Open" className={card}>
                  {body}
                  <span className="sr-only"> (opens Instagram in a new tab)</span>
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
