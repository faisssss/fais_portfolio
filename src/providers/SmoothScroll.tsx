import { ReactLenis, useLenis, type LenisRef } from 'lenis/react'
import { useEffect, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../lib/gsap'

/** Runs ScrollTrigger's update on every Lenis scroll event so triggers stay in sync with the smoothed position. */
function ScrollTriggerSync() {
  useLenis(ScrollTrigger.update)
  return null
}

/**
 * Lenis smooth scrolling for the whole page, driven by GSAP's ticker
 * (autoRaf is off so Lenis and ScrollTrigger update on the same frame).
 * Lenis honours prefers-reduced-motion by default (respectReducedMotion), so smoothing turns off there.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<LenisRef>(null)

  useEffect(() => {
    const update = (time: number) => lenisRef.current?.lenis?.raf(time * 1000)
    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    // Web fonts and late layout (content loading, the masonry grid sizing itself) change the page height
    // after ScrollTriggers are created; recalculate their positions whenever it changes.
    let cancelled = false
    document.fonts?.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh()
    })
    let timer = 0
    let lastHeight = document.body.scrollHeight
    const observer = new ResizeObserver(() => {
      const height = document.body.scrollHeight
      if (Math.abs(height - lastHeight) < 2) return
      lastHeight = height
      window.clearTimeout(timer)
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150)
    })
    observer.observe(document.body)

    return () => {
      cancelled = true
      observer.disconnect()
      window.clearTimeout(timer)
      gsap.ticker.remove(update)
      gsap.ticker.lagSmoothing(500, 33)
    }
  }, [])

  return (
    <ReactLenis root ref={lenisRef} options={{ autoRaf: false, lerp: 0.1, stopInertiaOnNavigate: true }}>
      <ScrollTriggerSync />
      {children}
    </ReactLenis>
  )
}
