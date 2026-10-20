import { useLenis } from 'lenis/react'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, useGSAP } from '../../lib/gsap'
import { markIntroSeen } from '../../providers/intro'

const LINES = [
  { status: 'boot', text: 'portfolio v2026.10 — tty1' },
  { status: ' ok ', text: 'mounting /home/faisal' },
  { status: ' ok ', text: 'loading stack: python · flask · mysql · c++ · java' },
  { status: ' ok ', text: 'indexing ./projects (3 found)' },
  { status: ' ok ', text: 'starting portfolio.service' },
]

interface BootIntroProps {
  /** Called as the overlay starts to lift, so the hero can animate in underneath it. */
  onReveal: () => void
  /** Called when the overlay has fully left the screen. */
  onFinish: () => void
}

/**
 * A ~2 second terminal boot sequence shown on the first visit of a session.
 * One GSAP timeline: log lines stagger in, a progress bar fills, then the overlay slides away.
 * Any key, click or the Skip button fast-forwards it.
 */
export function BootIntro({ onReveal, onFinish }: BootIntroProps) {
  const root = useRef<HTMLDivElement>(null)
  const callbacks = useRef({ onReveal, onFinish })
  useLayoutEffect(() => {
    callbacks.current = { onReveal, onFinish }
  })
  const lenis = useLenis()

  // Hold page scroll while the overlay is up.
  useEffect(() => {
    if (!lenis) return
    lenis.scrollTo(0, { immediate: true, force: true })
    lenis.stop()
    return () => lenis.start()
  }, [lenis])

  useGSAP(
    (_context, contextSafe) => {
      markIntroSeen()

      const tl = gsap.timeline({
        defaults: { ease: 'power2.out' },
        onComplete: () => callbacks.current.onFinish(),
      })

      tl.from('[data-boot-line]', { autoAlpha: 0, x: -10, duration: 0.26, stagger: 0.12 })
        .from('[data-boot-bar]', { scaleX: 0, duration: 0.85, ease: 'power1.inOut' }, 0)
        .from('[data-boot-welcome]', { autoAlpha: 0, y: 6, duration: 0.3 }, '>-0.05')
        .addLabel('lift', '+=0.2')
        .call(() => callbacks.current.onReveal(), [], 'lift')
        .to('[data-boot-content]', { autoAlpha: 0, y: -24, duration: 0.4, ease: 'power2.in' }, 'lift')
        .to(root.current, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 'lift+=0.1')

      const skip = contextSafe!(() => {
        if (tl.progress() < 1) tl.timeScale(5)
      })
      window.addEventListener('keydown', skip)
      window.addEventListener('pointerdown', skip)
      return () => {
        window.removeEventListener('keydown', skip)
        window.removeEventListener('pointerdown', skip)
      }
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-bg will-change-transform"
      aria-hidden="true"
    >
      <div className="bg-dot-grid absolute inset-0 opacity-60" />
      <div data-boot-content className="relative w-full max-w-xl px-6 font-mono text-[13px] leading-7 sm:text-sm">
        <ul>
          {LINES.map((line) => (
            <li key={line.text} data-boot-line className="flex gap-3 whitespace-nowrap">
              <span className={line.status === 'boot' ? 'text-number' : 'text-accent'}>[{line.status}]</span>
              <span className="truncate text-muted">{line.text}</span>
            </li>
          ))}
        </ul>
        <div className="mt-5 h-px w-full overflow-hidden bg-line">
          <div data-boot-bar className="h-full origin-left bg-accent" />
        </div>
        <p data-boot-welcome className="mt-5 text-fg">
          <span className="text-accent">❯</span> welcome<span className="ml-1 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-accent" />
        </p>
      </div>
      <button
        type="button"
        tabIndex={-1}
        className="absolute right-5 bottom-5 rounded-md border border-line px-3 py-1.5 font-mono text-xs text-subtle transition-colors hover:text-fg"
      >
        skip ↵
      </button>
    </div>
  )
}
