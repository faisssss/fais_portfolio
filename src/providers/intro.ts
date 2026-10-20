import { createContext, useContext } from 'react'
import { prefersReducedMotion } from '../lib/gsap'

const STORAGE_KEY = 'faisal:boot-seen'

/** True once the boot intro has revealed the page (or immediately if it doesn't play). */
export const IntroContext = createContext(true)

export const useIntroDone = () => useContext(IntroContext)

/** The boot intro plays once per browser session and never for reduced-motion users. */
export function shouldPlayIntro() {
  if (prefersReducedMotion()) return false
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) !== '1'
  } catch {
    return true
  }
}

export function markIntroSeen() {
  try {
    window.sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); the intro just plays again next time.
  }
}
