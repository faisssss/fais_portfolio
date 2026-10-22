# Shefin Shafi portfolio — design spec

Date: 2026-10-22 · Status: agreed in chat; replaces the earlier test portfolio.

## Goal

A portfolio for Shefin Shafi, photographer and video editor, that he can keep up to date himself
without code. Blueprint: https://claude.ai/artifact/LPuum8ceBeFkn1FLg3Ut87

## Decisions

- **Admin:** Sanity Studio embedded at `/admin`, with login by Google/email handled by Sanity. One singleton
  `portfolio` document holds settings plus an ordered array of section blocks (gallery, films, reels,
  services, about, heading & text, contact) that he can add, remove, reorder and retitle.
- **Videos:** links only (YouTube, Vimeo, Instagram reels), detected from the URL. Instagram's player
  loads on click; reels need a cover image.
- **Content before setup:** built-in samples (Lorem Picsum photos, Blender open movies, links to famous
  photographers' Instagram profiles), clearly flagged on the page. New Portfolio documents start
  pre-filled with the sample text and links.
- **Contact form:** no server; it composes an email in the visitor's mail app.
- **Look:** dark and cinematic (#0c0c0b ground, warm #e0a458 accent), Instrument Serif headings with Inter for body text.
- **Motion:** GSAP + Lenis + React Bits (Masonry, SplitText, ScrollReveal, AnimatedContent, Magnet,
  StaggeredMenu); reduced motion and phones get a calmer, unpinned version.
- **Hosting:** Vercel (SPA rewrite for `/admin`); the public bundle excludes the Studio.
