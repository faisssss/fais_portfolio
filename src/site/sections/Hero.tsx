import { useRef, useState } from 'react'
import { TbArrowDown, TbPlayerPlayFilled } from 'react-icons/tb'
import type { Portfolio } from '../../content/types'
import { parseVideo } from '../../content/video'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { useScrollTo } from '../../hooks/useScrollTo'
import { gsap, media, SplitText, useGSAP } from '../../lib/gsap'
import Magnet from '../../components/reactbits/Magnet'
import { usePlayVideo } from '../playVideo'
import { buttonOutline, buttonSolid, container } from '../ui'
import { hideOnError } from '../hideOnError'

interface HeroProps {
  data: Portfolio
  /** id of the first section, for the "View work" button */
  workId?: string
}

/**
 * Full-screen showreel playing silently behind the name. The name rises in letter by letter,
 * and scrolling away slowly pushes into the footage while the copy lifts off.
 */
export function Hero({ data, workId }: HeroProps) {
  const root = useRef<HTMLElement>(null)
  const playVideo = usePlayVideo()
  const scrollTo = useScrollTo()
  const reduced = useMediaQuery(media.reduceMotion)
  const [videoReady, setVideoReady] = useState(false)

  const reel = data.heroVideo ? parseVideo(data.heroVideo) : null
  const backgroundSrc = reel && 'background' in reel && !reduced ? reel.background : null

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motionOK, () => {
        const split = SplitText.create('[data-hero-name]', { type: 'chars', mask: 'chars' })
        gsap
          .timeline({ delay: 0.1 })
          .from('[data-hero-media]', { scale: 1.18, autoAlpha: 0, duration: 2, ease: 'power2.out' }, 0)
          .from(split.chars, { yPercent: 115, duration: 1.2, stagger: 0.035, ease: 'power4.out' }, 0.25)
          .from('[data-hero-fade]', { opacity: 0, y: 18, duration: 0.9, stagger: 0.1 }, 0.9)

        gsap
          .timeline({ scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true } })
          .to('[data-hero-zoom]', { scale: 1.12, ease: 'none' }, 0)
          .to('[data-hero-shade]', { opacity: 0.9, ease: 'none' }, 0)
          .to('[data-hero-content]', { yPercent: -18, opacity: 0, ease: 'none' }, 0)

        return () => split.revert()
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} id="top" aria-label="Showreel" className="relative isolate flex h-svh min-h-[560px] items-end overflow-hidden">
      <div data-hero-zoom className="absolute inset-0 -z-10" aria-hidden="true">
        <div data-hero-media className="absolute inset-0 bg-elevated">
          {data.heroPoster && <img onError={hideOnError} src={data.heroPoster} alt="" className="absolute inset-0 size-full object-cover" />}
          {backgroundSrc && (
            <iframe
              src={backgroundSrc}
              title="Showreel (background)"
              tabIndex={-1}
              allow="autoplay; encrypted-media"
              onLoad={() => window.setTimeout(() => setVideoReady(true), 1200)}
              className={`pointer-events-none absolute top-1/2 left-1/2 h-[56.25vw] min-h-full w-[177.78svh] min-w-full -translate-x-1/2 -translate-y-1/2 border-0 transition-opacity duration-1000 ${videoReady ? 'opacity-100' : 'opacity-0'}`}
            />
          )}
        </div>
        <div data-hero-shade className="absolute inset-0 bg-bg opacity-30" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgb(12_12_11/0.55)_0%,transparent_30%,transparent_45%,rgb(12_12_11/0.92)_100%)]" />
      </div>

      <div data-hero-content className={`${container} pb-12 md:pb-16`}>
        <p data-hero-fade className="mb-5 text-xs font-medium tracking-[0.18em] text-accent uppercase md:text-sm">
          {data.role}
          {data.location ? ` · ${data.location}` : ''}
        </p>
        <h1 data-hero-name className="font-serif text-[clamp(4rem,15vw,14rem)] leading-[0.85] font-normal tracking-[-0.03em]">
          {data.name}
        </h1>
        <div data-hero-fade className="mt-10 flex flex-wrap items-center gap-3">
          {data.heroVideo && (
            <Magnet padding={60} magnetStrength={4}>
              <button
                type="button"
                className={buttonSolid}
                onClick={() => playVideo({ url: data.heroVideo!, title: `${data.name} — showreel` })}
              >
                <TbPlayerPlayFilled aria-hidden="true" className="size-4" />
                Watch showreel
              </button>
            </Magnet>
          )}
          {workId && (
            <a
              href={`#${workId}`}
              className={buttonOutline}
              onClick={(event) => {
                event.preventDefault()
                scrollTo(workId)
              }}
            >
              View work
              <TbArrowDown aria-hidden="true" className="size-4" />
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
