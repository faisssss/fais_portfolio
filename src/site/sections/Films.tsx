import { useRef } from 'react'
import { TbPlayerPlayFilled } from 'react-icons/tb'
import type { Film } from '../../content/types'
import { videoThumbnail } from '../../content/video'
import { gsap, media, ScrollTrigger, useGSAP } from '../../lib/gsap'
import { SectionHeader } from '../SectionHeader'
import { usePlayVideo } from '../playVideo'
import { hideOnError } from '../hideOnError'

interface FilmsProps {
  id: string
  heading: string
  intro?: string
  films: Film[]
}

/**
 * Landscape video work. On large screens the section pins and the row of films slides sideways with the
 * scroll; each card settles into place as it crosses the screen. Phones get a simple vertical list.
 */
export function Films({ id, heading, intro, films }: FilmsProps) {
  const root = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const playVideo = usePlayVideo()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ desktop: media.desktop, motionOK: media.motionOK }, (context) => {
        const { desktop, motionOK } = context.conditions as { desktop: boolean; motionOK: boolean }
        if (!motionOK) return
        const cards = gsap.utils.toArray<HTMLElement>('[data-film]')

        if (!desktop) {
          cards.forEach((card) =>
            gsap.from(card, { opacity: 0, y: 40, duration: 0.9, scrollTrigger: { trigger: card, start: 'top 88%', once: true } }),
          )
          return
        }

        const trackEl = track.current!
        const distance = () => Math.max(0, trackEl.scrollWidth - window.innerWidth)
        const run = gsap
          .timeline({ defaults: { ease: 'none' } })
          .to(trackEl, { x: () => -distance() }, 0)
          .fromTo('[data-films-progress]', { scaleX: 0 }, { scaleX: 1 }, 0)

        ScrollTrigger.create({
          trigger: root.current,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: true,
          animation: run,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        })

        cards.forEach((card) => {
          gsap.fromTo(
            card.querySelector('[data-film-inner]'),
            { scale: 0.86, opacity: 0.35 },
            {
              scale: 1,
              opacity: 1,
              ease: 'none',
              scrollTrigger: { trigger: card, containerAnimation: run, start: 'left 100%', end: 'left 50%', scrub: true },
            },
          )
        })
      })
    },
    { scope: root },
  )

  if (!films.length) return null

  return (
    <section
      ref={root}
      id={id}
      tabIndex={-1}
      aria-labelledby={`${id}-title`}
      className="relative overflow-hidden bg-surface lg:motion-safe:h-svh"
    >
      <div
        ref={track}
        className={[
          'mx-auto grid max-w-[90rem] gap-10 px-5 py-24 sm:px-8 md:grid-cols-2 md:py-32 lg:motion-reduce:grid-cols-3 lg:px-12',
          'lg:motion-safe:mx-0 lg:motion-safe:flex lg:motion-safe:h-full lg:motion-safe:w-max lg:motion-safe:max-w-none lg:motion-safe:items-center lg:motion-safe:gap-10 lg:motion-safe:py-0 lg:motion-safe:pr-[10vw] lg:motion-safe:pl-[max(3rem,calc((100vw-90rem)/2+3rem))]',
        ].join(' ')}
      >
        <div className="max-w-md shrink-0 md:col-span-2 lg:motion-reduce:col-span-3 lg:motion-safe:w-[26rem]">
          <SectionHeader id={`${id}-title`} heading={heading} intro={intro} />
          <div aria-hidden="true" className="mt-10 hidden h-px w-48 overflow-hidden bg-line lg:motion-safe:block">
            <div data-films-progress className="h-full origin-left bg-accent" />
          </div>
        </div>

        {films.map((film, index) => {
          const thumb = film.thumbnail || videoThumbnail(film.url)
          return (
            <article key={`${film.url}-${index}`} data-film className="shrink-0 lg:motion-safe:w-[min(46rem,52vw)]">
              <button
                type="button"
                data-film-inner
                data-cursor="Play"
                onClick={() => playVideo({ url: film.url, title: film.title })}
                className="group block w-full text-left"
              >
                <span className="relative block aspect-video overflow-hidden rounded bg-elevated">
                  {thumb && (
                    <img onError={hideOnError}
                      src={thumb}
                      alt=""
                      loading="lazy"
                      className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  )}
                  <span className="absolute inset-0 bg-bg/20 transition-colors group-hover:bg-bg/0" />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-16 place-items-center rounded-full border border-fg/70 bg-bg/30 backdrop-blur-sm transition-transform group-hover:scale-110">
                      <TbPlayerPlayFilled aria-hidden="true" className="size-5" />
                    </span>
                  </span>
                  {film.duration && (
                    <span className="absolute right-3 bottom-3 rounded bg-bg/80 px-2 py-1 text-xs tabular-nums">{film.duration}</span>
                  )}
                </span>
                <span className="mt-5 flex items-baseline justify-between gap-4">
                  <span className="font-serif text-3xl md:text-4xl">{film.title}</span>
                  <span className="text-sm text-muted tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                </span>
                {film.role && <span className="mt-1 block text-sm text-muted">{film.role}</span>}
              </button>
            </article>
          )
        })}
      </div>
    </section>
  )
}
