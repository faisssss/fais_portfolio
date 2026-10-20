# Portfolio site — design spec

Date: 2026-10-20 · Status: approved in chat ("here is the resume, lets see what you build")

## Goal

A one-page portfolio for Mohammed Faisal, built from the resume they shared (`Resume2.pdf`). It should
look professional, carry a light coding theme, and show deliberate, well-structured use of
the three libraries named in `CLAUDE.md`: GSAP, Lenis and React Bits.

Success means:

- Every fact on the page comes from the resume; nothing is invented.
- Animations are smooth and purposeful, and the page reads fully with motion disabled.
- Works on phones (heavy effects reduced or off) and passes typecheck, lint and build.

## Content decisions

- Contact shows email, GitHub and LinkedIn. The phone number stays off the public site.
- The LinkedIn link in the PDF is broken (LaTeX turned it into a local-file link); the site
  uses `https://www.linkedin.com/in/mohammed-faisal-09135125b`.
- All content lives in `src/data/resume.ts` so it can be edited without touching components.
- No resume PDF is bundled (it contains the phone number). A download button appears only if
  `resumeUrl` is set.

## Stack

Vite + React + TypeScript + Tailwind CSS v4. `gsap` + `@gsap/react`, `lenis`, `motion` (needed by
some React Bits components), `react-icons`, self-hosted fonts via Fontsource (Geist, JetBrains Mono).
Static build with a relative `base` so it can be hosted from any path.

## Visual language

Dark, GitHub-dark–like surfaces with one mint accent (`#7ee787`) and syntax colours used
sparingly inside code panels. Geist for text, JetBrains Mono for code accents. Coding motifs:
file-name tabs, line numbers, a `git log` timeline, a terminal-style contact block and an
editor status bar. Code styling is an accent, not a full fake IDE.

## Page structure

| # | Section | Motif | Main effects |
|---|---------|-------|--------------|
| 0 | Boot intro | terminal boot log | GSAP timeline, skippable, once per session, skipped for reduced motion |
| 1 | Hero | `whoami` prompt | React Bits `FaultyTerminal` background, `DecryptedText` name, `TextType` roles, `Magnet` CTAs, scroll-scrubbed exit |
| 2 | About | `about.ts` editor panel | `ScrollReveal` summary, `CountUp` quick facts, `SplitText` heading |
| 3 | Skills | `stack.json` | `SpotlightCard` groups, `LogoLoop` tech strip with scroll boost |
| 4 | Journey | `git log --graph` | branch line scrubbed with ScrollTrigger (transform only), commits revealed in sequence |
| 5 | Projects | `projects/` | pinned horizontal scroll on desktop, vertical stack on mobile (`gsap.matchMedia`) |
| 6 | Contact | `contact.sh` terminal | typed prompt, copy-email action, `Magnet` CTA |
| 7 | Footer | editor status bar | live scroll position via `useLenis` |

Navigation: editor-style file tabs on desktop with the active tab driven by ScrollTrigger and a
scroll-progress bar; React Bits `StaggeredMenu` on mobile. `ClickSpark` adds subtle click feedback.

## Library usage rules (from CLAUDE.md)

- **GSAP**: plugins registered once in `src/lib/gsap.ts`. All component animations use
  `useGSAP` with a `scope` ref; delayed handlers use `contextSafe`. Animate transforms and
  opacity only. `gsap.matchMedia()` gates motion on `prefers-reduced-motion` and screen size.
- **Lenis**: `ReactLenis root` with `options.autoRaf: false`; GSAP's ticker drives `lenis.raf`,
  `ScrollTrigger.update` runs on every Lenis scroll, `gsap.ticker.lagSmoothing(0)`. Anchor
  navigation uses `lenis.scrollTo`. Lenis's `respectReducedMotion` (default on) disables smoothing.
- **React Bits**: TypeScript + Tailwind variants copied into `src/components/reactbits/` with the
  licence notice. Adapted to the site: theme colours, project fonts, semantic tags, `useGSAP`
  instead of raw effects where they create ScrollTriggers, and accessibility fixes (`inert`,
  Escape to close) on the mobile menu.

## Accessibility and performance

Skip link, landmarks, one `h1`, visible focus styles, `aria-hidden` on decorative canvases,
`sr-only` text behind animated text. Nothing is hidden by CSS before JavaScript runs.
WebGL background pauses offscreen and runs at DPR 1. No pinning on small screens. Keyboard focus
inside the horizontal projects track scrolls the page to the focused card.

## Verification

`npm run lint`, `npm run build` (includes `tsc -b`). Headless Chromium screenshots at
1440×900 and 390×844, with and without `prefers-reduced-motion`, plus a console-error check.
