import { useRef, useState } from 'react'
import { gsap, useGSAP } from '../lib/gsap'

/**
 * A soft follower dot that grows into a "View" / "Play" label over work (elements with data-cursor).
 * Decoration only: the system cursor stays visible, and it's off for touch screens and reduced motion.
 */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null)
  const [label, setLabel] = useState('')

  useGSAP(
    () => {
      const el = root.current
      if (!el) return
      const mm = gsap.matchMedia()
      mm.add('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)', () => {
        gsap.set(el, { xPercent: -50, yPercent: -50, autoAlpha: 0 })
        const x = gsap.quickTo(el, 'x', { duration: 0.45, ease: 'power3.out' })
        const y = gsap.quickTo(el, 'y', { duration: 0.45, ease: 'power3.out' })
        let current = ''

        const onMove = (event: PointerEvent) => {
          x(event.clientX)
          y(event.clientY)
          const target = (event.target as Element | null)?.closest<HTMLElement>('[data-cursor]')
          const next = target?.dataset.cursor ?? ''
          if (next !== current) {
            current = next
            setLabel(next)
            gsap.to(el, { scale: next ? 1 : 0.18, autoAlpha: 1, duration: 0.35, ease: 'power3.out', overwrite: 'auto' })
          }
        }
        const onLeave = () => gsap.to(el, { autoAlpha: 0, duration: 0.2, overwrite: 'auto' })

        gsap.set(el, { scale: 0.18 })
        window.addEventListener('pointermove', onMove, { passive: true })
        document.documentElement.addEventListener('pointerleave', onLeave)
        return () => {
          window.removeEventListener('pointermove', onMove)
          document.documentElement.removeEventListener('pointerleave', onLeave)
        }
      })
    },
    { scope: root },
  )

  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none invisible fixed top-0 left-0 z-[90] grid size-20 place-items-center rounded-full bg-fg text-[13px] font-medium tracking-wide text-bg"
    >
      <span className={label ? 'opacity-100' : 'opacity-0'}>{label}</span>
    </div>
  )
}
