import { defineArrayMember, defineField, defineType, type UrlRule } from 'sanity'
import { samplePortfolio } from '../content/sample'
import { parseVideo } from '../content/video'

/* Field definitions for the /admin editor. Titles and descriptions are written for Shefin, not developers. */

const videoLink = (rule: UrlRule) =>
  rule.custom((value: unknown) => {
    if (!value) return true
    if (typeof value !== 'string' || !/^https?:\/\//.test(value)) return 'Paste the full link, starting with https://'
    return parseVideo(value).kind === 'link' ? 'This should be a YouTube, Vimeo or Instagram link' : true
  })

const sectionBasics = [
  defineField({ name: 'heading', title: 'Heading', type: 'string', validation: (rule) => rule.required() }),
  defineField({
    name: 'navLabel',
    title: 'Menu label',
    type: 'string',
    description: 'Short name shown in the top menu. Leave empty to keep this section out of the menu.',
  }),
  defineField({ name: 'intro', title: 'Intro line', type: 'text', rows: 2, description: 'Optional sentence under the heading.' }),
]

const sectionPreview = (type: string) => ({
  select: { title: 'heading' },
  prepare: ({ title }: { title?: string }) => ({ title: title || 'Untitled section', subtitle: type }),
})

const gallery = defineType({
  name: 'gallery',
  title: 'Photo gallery',
  type: 'object',
  fields: [
    ...sectionBasics,
    defineField({
      name: 'photos',
      title: 'Photos',
      type: 'array',
      description: 'Drag photos here. Drag to reorder. The category becomes a filter button above the gallery.',
      options: { layout: 'grid' },
      of: [
        defineArrayMember({
          type: 'image',
          options: { hotspot: true },
          fields: [
            defineField({ name: 'category', title: 'Category', type: 'string', description: 'e.g. Portraits, Weddings, Events' }),
            defineField({ name: 'caption', title: 'Caption', type: 'string' }),
            defineField({ name: 'alt', title: 'Description for screen readers', type: 'string' }),
          ],
        }),
      ],
    }),
  ],
  preview: sectionPreview('Photo gallery'),
})

const films = defineType({
  name: 'films',
  title: 'Films (YouTube / Vimeo)',
  type: 'object',
  fields: [
    ...sectionBasics,
    defineField({
      name: 'films',
      title: 'Films',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'film',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'url', title: 'Video link', type: 'url', description: 'Paste a YouTube or Vimeo link.', validation: (rule) => videoLink(rule).required() }),
            defineField({ name: 'role', title: 'Your role', type: 'string', description: 'e.g. Shot & edited, Colour graded' }),
            defineField({ name: 'duration', title: 'Length', type: 'string', description: 'e.g. 3:42' }),
            defineField({ name: 'thumbnail', title: 'Custom thumbnail (optional)', type: 'image', description: 'Leave empty to use the video’s own thumbnail.' }),
          ],
          preview: { select: { title: 'title', subtitle: 'url', media: 'thumbnail' } },
        }),
      ],
    }),
  ],
  preview: sectionPreview('Films'),
})

const reels = defineType({
  name: 'reels',
  title: 'Instagram reels',
  type: 'object',
  fields: [
    ...sectionBasics,
    defineField({
      name: 'reels',
      title: 'Reels',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'reel',
          fields: [
            defineField({ name: 'title', title: 'Title', type: 'string', validation: (rule) => rule.required() }),
            defineField({
              name: 'url',
              title: 'Instagram link',
              type: 'url',
              description: 'Paste the reel’s link (Share → Copy link). The account and reel must be public.',
              validation: (rule) => rule.required(),
            }),
            defineField({ name: 'cover', title: 'Cover image', type: 'image', description: 'A still from the reel. Shown until someone presses play.' }),
          ],
          preview: { select: { title: 'title', subtitle: 'url', media: 'cover' } },
        }),
      ],
    }),
  ],
  preview: sectionPreview('Reels'),
})

const services = defineType({
  name: 'services',
  title: 'Services',
  type: 'object',
  fields: [
    ...sectionBasics,
    defineField({
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'service',
          fields: [
            defineField({ name: 'title', title: 'Service', type: 'string', validation: (rule) => rule.required() }),
            defineField({ name: 'text', title: 'Description', type: 'text', rows: 2 }),
          ],
        }),
      ],
    }),
  ],
  preview: sectionPreview('Services'),
})

const about = defineType({
  name: 'about',
  title: 'About',
  type: 'object',
  fields: [
    ...sectionBasics,
    defineField({ name: 'portrait', title: 'Portrait', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'bio', title: 'Bio', type: 'text', rows: 8, description: 'Leave an empty line between paragraphs.' }),
    defineField({ name: 'tools', title: 'Gear & software', type: 'array', of: [defineArrayMember({ type: 'string' })], options: { layout: 'tags' } }),
  ],
  preview: sectionPreview('About'),
})

const textBlock = defineType({
  name: 'textBlock',
  title: 'Heading & text',
  type: 'object',
  fields: [...sectionBasics, defineField({ name: 'body', title: 'Text', type: 'text', rows: 6 })],
  preview: sectionPreview('Heading & text'),
})

const contact = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'object',
  fields: [...sectionBasics, defineField({ name: 'body', title: 'Text', type: 'text', rows: 3 })],
  preview: sectionPreview('Contact'),
})

/** Pre-fills a brand-new Portfolio with the sample text and video links (photos must be uploaded). */
const key = (prefix: string, i: number) => `${prefix}${i}`
const initialSections = samplePortfolio.sections.map((section) => {
  switch (section._type) {
    case 'gallery':
      return { _key: section._key, _type: 'gallery', heading: section.heading, navLabel: section.navLabel, intro: section.intro, photos: [] }
    case 'films':
      return {
        ...section,
        films: section.films.map((f, i) => ({ _key: key('film', i), _type: 'film', title: f.title, role: f.role, url: f.url, duration: f.duration })),
      }
    case 'reels':
      return { ...section, reels: section.reels.map((r, i) => ({ _key: key('reel', i), _type: 'reel', title: r.title, url: r.url })) }
    case 'services':
      return { ...section, services: section.services.map((s, i) => ({ _key: key('service', i), _type: 'service', ...s })) }
    case 'about':
      return { _key: section._key, _type: 'about', heading: section.heading, navLabel: section.navLabel, bio: section.bio, tools: section.tools }
    default:
      return section
  }
})

const portfolio = defineType({
  name: 'portfolio',
  title: 'Portfolio',
  type: 'document',
  groups: [
    { name: 'intro', title: 'Name & intro', default: true },
    { name: 'sections', title: 'Sections' },
    { name: 'contact', title: 'Contact & social' },
  ],
  initialValue: {
    name: samplePortfolio.name,
    role: samplePortfolio.role,
    statement: samplePortfolio.statement,
    heroVideo: samplePortfolio.heroVideo,
    sections: initialSections,
  },
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', group: 'intro', validation: (rule) => rule.required() }),
    defineField({ name: 'role', title: 'What you do', type: 'string', group: 'intro', description: 'e.g. Photographer & video editor' }),
    defineField({ name: 'location', title: 'City', type: 'string', group: 'intro' }),
    defineField({ name: 'statement', title: 'Intro statement', type: 'text', rows: 3, group: 'intro', description: 'The large sentence under the showreel.' }),
    defineField({
      name: 'heroVideo',
      title: 'Showreel link',
      type: 'url',
      group: 'intro',
      description: 'YouTube or Vimeo link. It plays silently on a loop behind your name.',
      validation: videoLink,
    }),
    defineField({ name: 'heroPoster', title: 'Showreel cover image', type: 'image', group: 'intro', description: 'Shown while the video loads, and instead of it for visitors who turn off animations.' }),
    defineField({
      name: 'sections',
      title: 'Sections',
      type: 'array',
      group: 'sections',
      description: 'Add, remove and drag sections to change the page. Each one can have its own heading.',
      of: [
        defineArrayMember({ type: 'gallery' }),
        defineArrayMember({ type: 'films' }),
        defineArrayMember({ type: 'reels' }),
        defineArrayMember({ type: 'services' }),
        defineArrayMember({ type: 'about' }),
        defineArrayMember({ type: 'textBlock' }),
        defineArrayMember({ type: 'contact' }),
      ],
    }),
    defineField({ name: 'email', title: 'Email', type: 'string', group: 'contact', validation: (rule) => rule.email() }),
    defineField({ name: 'whatsapp', title: 'WhatsApp number', type: 'string', group: 'contact', description: 'With country code, digits only, e.g. 919876543210' }),
    defineField({ name: 'instagram', title: 'Instagram profile link', type: 'url', group: 'contact' }),
    defineField({ name: 'youtube', title: 'YouTube channel link', type: 'url', group: 'contact' }),
    defineField({ name: 'vimeo', title: 'Vimeo profile link', type: 'url', group: 'contact' }),
  ],
  preview: { select: { title: 'name', subtitle: 'role' } },
})

export const schemaTypes = [portfolio, gallery, films, reels, services, about, textBlock, contact]
