# Mohammed Faisal — portfolio

A one-page portfolio site built from the resume, with a light "code editor" theme: file-name tabs, a
`git log` timeline, a terminal contact block and an editor status bar. Animations use
[GSAP](https://gsap.com), smooth scrolling uses [Lenis](https://github.com/darkroomengineering/lenis),
and several effects come from [React Bits](https://reactbits.dev).

## Run it

```bash
npm install
npm run dev       # local dev server
npm run build     # typecheck + production build into dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

The build is static and uses relative asset paths, so `dist/` can be hosted anywhere
(GitHub Pages, Netlify, Vercel, a sub-folder).

## Editing the content

Everything the site says lives in [`src/data/resume.ts`](src/data/resume.ts): profile, contact links,
skills, the journey timeline and projects. Components only read from that file.

- **Project links**: add `links: [{ label: 'GitHub', href: '…' }]` to a project and the card shows them.
- **Resume download**: put the PDF in `public/` and set `profile.resumeUrl` (e.g. `'./resume.pdf'`).
  It's off by default because the PDF includes a phone number.

## How the libraries are used

**Lenis** — [`src/providers/SmoothScroll.tsx`](src/providers/SmoothScroll.tsx)
`ReactLenis` wraps the app with `autoRaf: false`; GSAP's ticker calls `lenis.raf()`,
`ScrollTrigger.update` runs on every Lenis scroll (`useLenis`), and `lagSmoothing(0)` keeps them in step.
Navigation scrolls with `lenis.scrollTo()` and then moves focus to the section
([`useScrollTo`](src/hooks/useScrollTo.ts)). The mobile menu and the boot intro pause Lenis while open.
Lenis's `respectReducedMotion` turns smoothing off for reduced-motion users.

**GSAP** — plugins are registered once in [`src/lib/gsap.ts`](src/lib/gsap.ts)
(ScrollTrigger, SplitText, TextPlugin, `useGSAP`). Every component animates through `useGSAP` with a
`scope` ref, and motion is gated with `gsap.matchMedia()` so reduced-motion users get a static page.
Highlights:

- Boot intro: a single timeline with labels; any key or click fast-forwards it.
- Hero: staggered reveal after the intro, plus a scrubbed scroll-out.
- About: the editor window tilts into place (scrub), code lines type in, quick facts count up.
- Journey: the branch line is a scrubbed `scaleY`, each commit has its own timeline.
- Projects: a pinned horizontal scroll on desktop. The track tween is also the `containerAnimation`
  for each card's entrance. Phones and tablets get a normal vertical list instead.
- Contact: TextPlugin types `./contact.sh`, then the output prints line by line.
- Nav: ScrollTrigger tracks the active section; the tab marker slides with `x` + `scaleX`.

Only `transform` and `opacity` are animated.

**React Bits** — copied into [`src/components/reactbits/`](src/components/reactbits) (TypeScript +
Tailwind versions) and adapted to the site:

| Component | Used for | Adaptations |
|-----------|----------|-------------|
| FaultyTerminal | hero background | canvas created per mount (fixes a blank WebGL context under StrictMode) |
| DecryptedText | hero name | plain `span` instead of `motion.span` (drops the motion dependency) |
| TextType | typed roles | uses the shared GSAP instance |
| SplitText | section headings | `id` prop for `aria-labelledby` |
| ScrollReveal | about paragraph | `useGSAP`, configurable tag (was always `h2`), screen-reader copy |
| CountUp | quick facts | GSAP tween + ScrollTrigger instead of motion's `animate`/`useInView` |
| SpotlightCard | skills, projects | theme tokens; radius/padding left to the caller |
| LogoLoop | tech strip | — (uses its scroll-velocity boost) |
| AnimatedContent | staggered card reveals | `useGSAP` instead of a manual `gsap.context` |
| Magnet | call-to-action buttons | — |
| ClickSpark | click feedback | — |
| StaggeredMenu | mobile navigation | `useGSAP` + `contextSafe`, dark theme, `inert` when closed, Escape/focus handling, Lenis-aware navigation |

React Bits is MIT + Commons Clause; its licence is kept in
[`src/components/reactbits/LICENSE.md`](src/components/reactbits/LICENSE.md).

## Accessibility

Skip link, landmark elements, one `h1`, and `aria-labelledby` on each section.
Animated text keeps a plain screen-reader copy. Reveals that contain links fade with `opacity`
rather than `visibility`, so they stay reachable by keyboard before they've animated in.
With `prefers-reduced-motion` the page renders fully without the intro, pinning or scroll effects.

## Project layout

```
src/
  data/resume.ts            all content
  lib/gsap.ts               plugin registration + shared media queries
  providers/                Lenis smooth scroll, intro state
  hooks/                    useScrollTo, useMediaQuery
  components/
    layout/                 boot intro, desktop tabs, mobile menu, status bar
    sections/               hero, about, skills, journey, projects, contact
    ui/                     editor window, section heading, icons, shared classes
    reactbits/              adapted React Bits components
docs/superpowers/specs/     design spec
```
