# Animation & Scroll Libraries

When writing animation, scroll, or UI-effect code, use these libraries and check their official sources before writing code. Do not rely on memory for API details — fetch the repo/docs if unsure, since APIs change between versions.

## Libraries

- **GSAP** (animations, timelines, ScrollTrigger)
  - Repo: https://github.com/greensock/GSAP
  - Docs: https://gsap.com/docs/v3/
- **Lenis** (smooth scrolling)
  - Repo: https://github.com/darkroomengineering/lenis
- **React Bits** (ready-made animated React components)
  - Repo: https://github.com/DavidHDev/react-bits
  - Site: https://reactbits.dev

## Rules

### GSAP
- Install with `npm install gsap`. All GSAP plugins (ScrollTrigger, SplitText, etc.) ship in the main `gsap` package.
- Always register plugins before use: `gsap.registerPlugin(ScrollTrigger)`.
- In React, use the `useGSAP` hook from `@gsap/react` (not plain `useEffect`) so animations are cleaned up automatically. Pass a `scope` ref to keep selectors local to the component.
- Prefer animating `transform` and `opacity` (x, y, scale, rotation, autoAlpha) for performance; avoid animating layout properties like width/top/left.
- Respect `prefers-reduced-motion` (use `gsap.matchMedia()`).

### Lenis
- Install with `npm install lenis` (the old `@studio-freight/lenis` package is deprecated).
- Import the CSS: `import 'lenis/dist/lenis.css'`.
- In React, use `ReactLenis` from `lenis/react` at the app root.
- When used with GSAP ScrollTrigger, sync them and let GSAP's ticker drive Lenis:
  ```js
  lenis.on('scroll', ScrollTrigger.update)
  gsap.ticker.add((time) => lenis.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)
  ```
  (With `ReactLenis`, set `autoRaf: false` and do the same via its ref.)
- Destroy the Lenis instance on unmount if created manually.

### React Bits
- Check https://reactbits.dev for an existing component before building a custom effect from scratch.
- Components are copied into the project (via the CLI command shown on each component page, or copy-paste), not imported from an npm package. Pick the variant that matches the project (JS/TS, CSS/Tailwind).
- Install any dependencies the component lists (often `gsap`, `motion`, or `three`).
- After adding a component, adapt props, colours and text to fit the site rather than leaving demo defaults.

### General
- Keep animations subtle and purposeful; make sure the site still works and reads well with animations disabled.
- Test on mobile — reduce or disable heavy scroll effects on small screens if they hurt performance.
