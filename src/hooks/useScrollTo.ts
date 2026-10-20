import { useLenis } from 'lenis/react'
import { useCallback } from 'react'

/**
 * Smooth-scrolls to a section through Lenis, then moves keyboard focus there
 * so screen-reader and keyboard users land in the same place as the viewport.
 */
export function useScrollTo() {
  const lenis = useLenis()

  return useCallback(
    (id: string) => {
      const target = id === 'top' ? document.body : document.getElementById(id)
      if (!target) return

      const focus = () => {
        if (target instanceof HTMLElement && target !== document.body) target.focus({ preventScroll: true })
      }

      if (lenis) {
        lenis.scrollTo(id === 'top' ? 0 : target, { duration: 1.4, onComplete: focus })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
        focus()
      }
    },
    [lenis],
  )
}
