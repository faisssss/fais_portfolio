import { samplePortfolio } from './sample'
import { isSanityConfigured, PORTFOLIO_ID, sanityConfig } from './sanity'
import type { Photo, Portfolio, Section } from './types'

const QUERY = `*[_id == $id][0]{
  name, role, location, statement, heroVideo, email, whatsapp, instagram, youtube, vimeo,
  "heroPoster": heroPoster.asset->url,
  sections[]{
    _key, _type, heading, navLabel, intro, body, bio, tools,
    "portrait": portrait.asset->url,
    photos[]{
      alt, caption, category,
      "src": asset->url,
      "width": asset->metadata.dimensions.width,
      "height": asset->metadata.dimensions.height
    },
    films[]{ title, role, url, duration, "thumbnail": thumbnail.asset->url },
    reels[]{ title, url, "cover": cover.asset->url },
    services[]{ title, text }
  }
}`

/** Sanity's image CDN resizes on the fly; ask for web-friendly sizes. */
const sized = (url: string | undefined, width: number) => (url ? `${url}?w=${width}&auto=format&q=80` : undefined)

type Raw = Omit<Portfolio, 'sections'> & { sections?: (Section & Record<string, unknown>)[] | null }

function normalise(raw: Raw): Portfolio {
  const sections = (raw.sections ?? []).map((section) => {
    const s = section as Section & { photos?: Photo[]; portrait?: string }
    if (s._type === 'gallery') {
      return {
        ...s,
        photos: (s.photos ?? [])
          .filter((p) => p?.src)
          .map((p) => ({ ...p, src: sized(p.src, 1600)!, width: p.width || 1200, height: p.height || 800, alt: p.alt || p.caption || '' })),
      }
    }
    if (s._type === 'films') return { ...s, films: (s.films ?? []).filter((f) => f?.url), }
    if (s._type === 'reels') return { ...s, reels: (s.reels ?? []).filter((r) => r?.url).map((r) => ({ ...r, cover: sized(r.cover, 720) })) }
    if (s._type === 'services') return { ...s, services: s.services ?? [] }
    if (s._type === 'about') return { ...s, portrait: sized(s.portrait, 1000), tools: s.tools ?? [] }
    return s
  })
  return { ...raw, heroPoster: sized(raw.heroPoster, 1920), sections: sections as Section[] }
}

/**
 * Shefin's published Portfolio from Sanity, or the sample content when the admin panel
 * isn't connected yet / nothing has been published.
 */
export async function loadPortfolio(): Promise<Portfolio> {
  if (!isSanityConfigured()) return samplePortfolio
  try {
    // Sanity's read API over plain fetch (the full client library would add ~80 KB to the public site).
    const { projectId, dataset, apiVersion } = sanityConfig
    const params = new URLSearchParams({ query: QUERY, $id: JSON.stringify(PORTFOLIO_ID), perspective: 'published' })
    const response = await fetch(`https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?${params}`)
    if (!response.ok) throw new Error(`Sanity responded ${response.status}`)
    const raw = ((await response.json()) as { result: Raw | null }).result
    if (!raw?.name) return samplePortfolio
    return normalise(raw)
  } catch (error) {
    console.warn('Could not load content from Sanity, showing sample content instead.', error)
    return samplePortfolio
  }
}
