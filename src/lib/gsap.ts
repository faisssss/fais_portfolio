import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { TextPlugin } from 'gsap/TextPlugin'

// Register every plugin once, before any component uses it.
gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText, TextPlugin)

// Mobile browsers resize the viewport when the address bar shows/hides; don't recalculate on that.
ScrollTrigger.config({ ignoreMobileResize: true })

gsap.defaults({ ease: 'power3.out', duration: 0.8 })

/** Media queries shared by every `gsap.matchMedia()` call so breakpoints stay consistent. */
export const media = {
  motionOK: '(prefers-reduced-motion: no-preference)',
  reduceMotion: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023.98px)',
} as const

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia(media.reduceMotion).matches

export { gsap, ScrollTrigger, SplitText, useGSAP }
