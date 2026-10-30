# Shefin Shafi — portfolio

Photography and video-editing portfolio with a built-in admin panel at **`/admin`**, where Shefin can
change everything without touching code: photos, films, Instagram reels, services, every heading and
piece of text, and which sections appear (and in what order).

Until the admin panel is connected, the site shows **sample content**: photos from Lorem Picsum,
and the Blender Foundation's freely licensed open movies as films. The Reels section appears once real reel
links are added. A small "Sample photos & videos" notice shows while it does. None of it is
Shefin's work; it disappears as soon as he publishes his own.

## Run it

```bash
npm install
npm run dev       # local dev server → http://localhost:5173 (admin: /admin)
npm run build     # typecheck + production build into dist/
npm run preview   # serve the production build
npm run lint
```

On Windows PowerShell, use `npm.cmd` instead of `npm` if scripts are blocked.

## Connect the admin panel (one time, ~5 minutes)

The admin panel is [Sanity Studio](https://www.sanity.io), embedded in the site. Content and photos are
stored on Sanity's free plan; login is with Google or email, handled by Sanity.

1. **Create the project.** Sign up at [sanity.io](https://www.sanity.io), go to
   [sanity.io/manage](https://www.sanity.io/manage) → **Create new project**. Keep the dataset named
   `production` and **public** (the site reads published content without a login). Copy the **Project ID**.
2. **Allow the site to talk to it.** In the project: **API → CORS origins → Add origin**, and add each
   address the site runs on, with **Allow credentials** ticked:
   `http://localhost:5173` and your live address (e.g. `https://shefin.vercel.app`).
3. **Give the site the project ID.**
   - Locally: copy `.env.example` to `.env` and fill in `VITE_SANITY_PROJECT_ID`.
   - On Vercel: Project → **Settings → Environment Variables** → add `VITE_SANITY_PROJECT_ID`, then redeploy.
4. **Invite Shefin.** In sanity.io/manage → **Members → Invite**, using his email, with the
   *Administrator* or *Editor* role.
5. **First edit.** Open `/admin`, log in, click **Portfolio**. It starts pre-filled with the sample text and
   video links. Upload photos, replace the links, then press **Publish**. The live site switches from the
   samples to his content right away (no redeploy needed).

### What Shefin can do in `/admin`

- **Name & intro:** name, title, city, intro sentence, showreel link (YouTube/Vimeo) and its cover image.
- **Sections:** add, remove and drag to reorder: *Photo gallery*, *Films*, *Instagram reels*, *Services*,
  *About*, *Heading & text*, *Contact*. Each has its own heading, intro line and menu label.
- **Photos:** drag images in; each can have a category (becomes a filter button), caption and description.
  Sanity resizes them automatically, so full-size camera files are fine.
- **Videos:** paste a YouTube or Vimeo link for films and the showreel (with an optional start time to skip
  intros). Reels take a link to one public Instagram reel (not a profile) plus a cover image, since Instagram
  doesn't provide one; they play inside the site, no Instagram login needed.
- **Contact & social:** email, WhatsApp number, Instagram / YouTube / Vimeo links.

## Deploy

Import the repo on [Vercel](https://vercel.com) (framework preset: **Vite**, build `npm run build`,
output `dist`). `vercel.json` routes `/admin` to the app. Add the environment variable from step 3 above.

## How it's built

React + TypeScript + Tailwind CSS v4, built with Vite.

- **Lenis** ([`src/providers/SmoothScroll.tsx`](src/providers/SmoothScroll.tsx)): smooth scrolling driven by
  GSAP's ticker (`autoRaf: false`), synced to ScrollTrigger. It pauses while the menu, the photo lightbox or
  the video player is open, and honours reduced-motion settings.
- **GSAP** ([`src/lib/gsap.ts`](src/lib/gsap.ts) registers ScrollTrigger and SplitText once): all animation
  runs through `useGSAP` with scoped refs and `gsap.matchMedia()` for reduced motion and screen size.
  - Hero: the name rises in letter by letter, and scrolling pushes into the silent showreel.
  - Films: pinned horizontal scroll on large screens, with cards settling in via `containerAnimation`.
  - Also: reels slide in, the portrait drifts (parallax), the header hides while scrolling down, and a focus-frame cursor (React Bits **TargetCursor**) snaps around photos and films.
- **React Bits** ([`src/components/reactbits/`](src/components/reactbits)), adapted to the site:
  **Masonry** (photo grid, hover zoom, lightbox, animated filtering), **SplitText** (section headings),
  **ScrollReveal** (intro sentence), **AnimatedContent** (services), **Magnet** (buttons) and
  **StaggeredMenu** (mobile menu) and **TargetCursor** (cursor). React Bits is MIT + Commons Clause; its licence is in that folder.

Content flows through one shape ([`src/content/types.ts`](src/content/types.ts)): Sanity data is fetched
with a single GROQ query ([`src/content/load.ts`](src/content/load.ts)) and falls back to the samples in
[`src/content/sample.ts`](src/content/sample.ts). The admin fields are defined in
[`src/admin/schema.ts`](src/admin/schema.ts). The public site never downloads the admin code.
