/** The shape the site renders. Sample content and Sanity content are both mapped into this. */

export interface Photo {
  src: string
  width: number
  height: number
  alt: string
  caption?: string
  category?: string
}

export interface Film {
  title: string
  role?: string
  url: string
  duration?: string
  /** Optional custom thumbnail; otherwise one is derived from the video link */
  thumbnail?: string
}

export interface Reel {
  title: string
  url: string
  cover?: string
}

export interface Service {
  title: string
  text?: string
}

interface SectionBase {
  _key: string
  heading: string
  /** Short label for the menu; empty hides the section from the menu */
  navLabel?: string
  intro?: string
}

export type Section =
  | (SectionBase & { _type: 'gallery'; photos: Photo[] })
  | (SectionBase & { _type: 'films'; films: Film[] })
  | (SectionBase & { _type: 'reels'; reels: Reel[] })
  | (SectionBase & { _type: 'services'; services: Service[] })
  | (SectionBase & { _type: 'about'; portrait?: string; bio?: string; tools?: string[] })
  | (SectionBase & { _type: 'textBlock'; body?: string })
  | (SectionBase & { _type: 'contact'; body?: string })

export interface Portfolio {
  name: string
  role: string
  location?: string
  statement?: string
  heroVideo?: string
  /** Seconds into the showreel where the silent background loop starts (skips intros and credits). */
  heroStart?: number
  heroPoster?: string
  email?: string
  whatsapp?: string
  instagram?: string
  youtube?: string
  vimeo?: string
  sections: Section[]
  /** True while showing the built-in sample content instead of Shefin's own */
  isSample?: boolean
}
