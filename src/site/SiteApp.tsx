import '@fontsource-variable/inter'
import '@fontsource/instrument-serif'
import 'lenis/dist/lenis.css'
import '../index.css'
import '../lib/gsap'

import { useEffect, useState } from 'react'
import { loadPortfolio } from '../content/load'
import type { Portfolio, Section } from '../content/types'
import { SmoothScroll } from '../providers/SmoothScroll'
import TargetCursor from '../components/reactbits/TargetCursor'
import { Footer } from './Footer'
import { Header, type NavLink } from './Header'
import { About } from './sections/About'
import { Contact } from './sections/Contact'
import { Films } from './sections/Films'
import { Gallery } from './sections/Gallery'
import { Hero } from './sections/Hero'
import { Reels } from './sections/Reels'
import { Services } from './sections/Services'
import { Statement } from './sections/Statement'
import { TextBlock } from './sections/TextBlock'
import { sectionId } from './ui'
import { VideoProvider } from './VideoModal'

function renderSection(section: Section, id: string, data: Portfolio) {
  const common = { id, heading: section.heading, intro: section.intro }
  switch (section._type) {
    case 'gallery':
      return <Gallery {...common} photos={section.photos} />
    case 'films':
      return <Films {...common} films={section.films} />
    case 'reels':
      return <Reels {...common} reels={section.reels} />
    case 'services':
      return <Services {...common} services={section.services} />
    case 'about':
      return <About {...common} portrait={section.portrait} bio={section.bio} tools={section.tools} />
    case 'textBlock':
      return <TextBlock {...common} body={section.body} />
    case 'contact':
      return <Contact {...common} body={section.body} data={data} />
    default:
      return null
  }
}

/** Sections with nothing to show (an empty gallery, no reels yet) are left out, menu link included. */
function hasContent(section: Section) {
  switch (section._type) {
    case 'gallery':
      return section.photos.length > 0
    case 'films':
      return section.films.length > 0
    case 'reels':
      return section.reels.length > 0
    case 'services':
      return section.services.length > 0
    default:
      return true
  }
}

function Site({ data }: { data: Portfolio }) {
  const placed = data.sections.filter(hasContent).map((section) => ({ section, id: sectionId(section.navLabel || section.heading, section._key) }))
  const links: NavLink[] = placed
    .filter(({ section }) => section.navLabel && section._type !== 'contact')
    .map(({ section, id }) => ({ id, label: section.navLabel! }))
  const contactId = placed.find(({ section }) => section._type === 'contact')?.id
  const firstId = placed[0]?.id

  useEffect(() => {
    document.title = `${data.name} · ${data.role}`
  }, [data.name, data.role])

  return (
    <VideoProvider>
      <a href="#main" className="sr-only fixed top-3 left-3 z-[95] rounded-full bg-accent px-5 py-2.5 font-medium text-bg focus:not-sr-only">
        Skip to content
      </a>
      {data.isSample && (
        <p className="pointer-events-none fixed bottom-4 left-1/2 z-30 w-max max-w-[calc(100vw-2rem)] -translate-x-1/2 rounded-full bg-accent px-4 py-2 text-center text-xs font-medium text-bg shadow-lg">
          Sample photos &amp; videos<span className="hidden sm:inline"> — to be replaced with Shefin’s own work</span>
        </p>
      )}
      <Header data={data} links={links} contactId={contactId} />
      <main id="main" tabIndex={-1}>
        <Hero data={data} workId={firstId} />
        {data.statement && <Statement text={data.statement} />}
        {placed.map(({ section, id }) => (
          <div key={section._key}>{renderSection(section, id, data)}</div>
        ))}
      </main>
      <Footer data={data} />
      <TargetCursor
        targetSelector="[data-cursor-label], [data-cursor-group] [role='listitem']"
        cursorColor="#f2efe9"
        size={30}
        cornerSize={10}
        thickness={2.5}
        padding={8}
        dotSize={5}
        spinDuration={6}
        hoverDuration={0.25}
      />
      <div aria-hidden="true" className="film-grain pointer-events-none fixed inset-0 z-[80] opacity-[0.05]" />
    </VideoProvider>
  )
}

export default function SiteApp() {
  const [data, setData] = useState<Portfolio | null>(null)

  useEffect(() => {
    let active = true
    loadPortfolio().then((portfolio) => {
      if (active) setData(portfolio)
    })
    return () => {
      active = false
    }
  }, [])

  return <SmoothScroll>{data ? <Site data={data} /> : <div className="h-svh bg-bg" aria-busy="true" />}</SmoothScroll>
}
