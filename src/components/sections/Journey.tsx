import { useRef } from 'react'
import { journey } from '../../data/resume'
import { gsap, media, useGSAP } from '../../lib/gsap'
import { SectionHeading } from '../ui/SectionHeading'
import { chip, container } from '../ui/styles'

/** A stable 7-character "commit hash" (FNV-1a) so each entry keeps the same hash between renders. */
const shortHash = (text: string) => {
  let hash = 0x811c9dc5
  for (let i = 0; i < text.length; i++) {
    hash ^= text.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(16).padStart(8, '0').slice(0, 7)
}

export function Journey() {
  const root = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motionOK, () => {
        // The branch line grows with the scroll position (scaleY, so no layout work).
        gsap.fromTo(
          '[data-rail]',
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: { trigger: '[data-log]', start: 'top 70%', end: 'bottom 70%', scrub: 0.5 },
          },
        )

        // Each commit: the node pops, the card slides in, then its bullet points follow.
        gsap.utils.toArray<HTMLElement>('[data-commit]').forEach((commit) => {
          gsap
            .timeline({ scrollTrigger: { trigger: commit, start: 'top 78%', once: true } })
            .from(commit.querySelector('[data-dot]'), { scale: 0, duration: 0.5, ease: 'back.out(2.6)' })
            .from(commit.querySelector('[data-card]'), { autoAlpha: 0, x: 40, duration: 0.8 }, 0.05)
            .from(commit.querySelectorAll('[data-point], [data-tag]'), { autoAlpha: 0, y: 10, duration: 0.45, stagger: 0.05 }, 0.3)
        })
      })
    },
    { scope: root },
  )

  return (
    <section id="journey" ref={root} tabIndex={-1} aria-labelledby="journey-title" className="relative py-24 md:py-32">
      <div className={container}>
        <SectionHeading
          index="03"
          file="journey.log"
          title="Experience & education"
          id="journey-title"
          description="Read it like git log: newest first."
        />

        <div data-log className="relative max-w-4xl">
          <div aria-hidden="true" className="absolute top-4 bottom-4 left-[11px] w-px bg-line md:left-[15px]">
            <div data-rail className="absolute inset-y-0 -left-px w-[3px] origin-top rounded-full bg-gradient-to-b from-accent via-accent/80 to-number/60" />
          </div>

          <ol className="space-y-8 md:space-y-10">
            {journey.map((commit) => {
              const hash = shortHash(commit.title + commit.org)
              return (
                <li key={hash} data-commit className="relative pl-10 md:pl-16">
                  <span
                    data-dot
                    aria-hidden="true"
                    className="absolute top-6 left-0 grid size-6 place-items-center rounded-full border border-accent/50 bg-bg md:size-8"
                  >
                    <span className={`size-2.5 rounded-full ${commit.kind === 'work' ? 'bg-accent' : 'bg-number'}`} />
                  </span>

                  <article data-card className="rounded-xl border border-line bg-surface/80 p-5 backdrop-blur-sm md:p-7">
                    <p className="font-mono text-xs text-muted md:text-sm">
                      <span className="text-prop">commit {hash}</span>
                      {commit.refs && (
                        <>
                          {' '}
                          (<span className="text-accent">{commit.refs}</span>)
                        </>
                      )}
                    </p>
                    {commit.date && (
                      <p className="mt-1 font-mono text-xs text-muted md:text-sm">
                        <span className="text-subtle">Date:</span> {commit.date}
                      </p>
                    )}

                    <h3 className="mt-4 text-xl font-semibold tracking-tight text-fg md:text-2xl">
                      <span className="mr-2 font-mono text-sm font-normal text-fn md:text-base">{commit.type}:</span>
                      {commit.title}
                    </h3>
                    <p className="mt-1 text-muted">{commit.org}</p>

                    <ul className="mt-5 space-y-2.5">
                      {commit.points.map((point) => (
                        <li key={point} data-point className="flex gap-3 text-fg/85">
                          <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-accent/70" />
                          {point}
                        </li>
                      ))}
                    </ul>

                    {commit.tags && (
                      <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tools used">
                        {commit.tags.map((tag) => (
                          <li key={tag} data-tag className={chip}>
                            {tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                </li>
              )
            })}
          </ol>
        </div>
      </div>
    </section>
  )
}
