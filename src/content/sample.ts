import type { Photo, Portfolio, Section } from './types'

/**
 * Placeholder content so the site looks full before Shefin adds his own work.
 * Photos come from Lorem Picsum (Unsplash images), films are the Blender Foundation's
 * freely licensed open movies, and reels point to well-known photographers' Instagram profiles.
 * None of it is Shefin's work: it is replaced as soon as the Portfolio is published in /admin.
 */

const pic = (id: number, width: number, height: number, category: string, caption: string): Photo => ({
  src: `https://picsum.photos/id/${id}/${width}/${height}`,
  width,
  height,
  alt: `Sample photo: ${caption}`,
  caption,
  category,
})

const photos: Photo[] = [
  pic(1015, 1200, 800, 'Landscape', 'River valley'),
  pic(1027, 800, 1200, 'Portraits', 'Portrait study'),
  pic(1036, 1200, 800, 'Landscape', 'Winter light'),
  pic(1047, 900, 1200, 'Urban', 'City street'),
  pic(1039, 1200, 900, 'Nature', 'Falls'),
  pic(1062, 900, 1200, 'Portraits', 'Companion'),
  pic(1043, 1200, 800, 'Travel', 'Coastline'),
  pic(1067, 800, 1100, 'Urban', 'Night city'),
  pic(1018, 1200, 800, 'Landscape', 'Ridge line'),
  pic(1044, 900, 1200, 'Travel', 'Cliffside'),
  pic(1050, 1200, 800, 'Travel', 'Shore'),
  pic(1057, 900, 1200, 'Nature', 'Forest floor'),
  pic(1016, 1200, 900, 'Landscape', 'Canyon'),
  pic(1035, 800, 1200, 'Nature', 'Mist'),
  pic(1040, 1200, 800, 'Urban', 'Old town'),
  pic(1019, 900, 1200, 'Nature', 'Highlands'),
]

const sections: Section[] = [
  {
    _key: 'work',
    _type: 'gallery',
    heading: 'Photography',
    navLabel: 'Photography',
    intro: 'A selection of recent frames. Tap any photo to see it full screen.',
    photos,
  },
  {
    _key: 'films',
    _type: 'films',
    heading: 'Films & edits',
    navLabel: 'Films',
    intro: 'Music videos, short films and brand edits. Click to watch.',
    films: [
      { title: 'Tears of Steel', role: 'Sample · Blender Studio open movie', url: 'https://www.youtube.com/watch?v=R6MlUcmOul8', duration: '12:14' },
      { title: 'Sintel', role: 'Sample · Blender Studio open movie', url: 'https://www.youtube.com/watch?v=eRsGyueVLvQ', duration: '14:48' },
      { title: 'Big Buck Bunny', role: 'Sample · hosted on Vimeo', url: 'https://vimeo.com/1084537', duration: '9:56' },
      { title: 'Cosmos Laundromat', role: 'Sample · Blender Studio open movie', url: 'https://www.youtube.com/watch?v=Y-rmzh0PI3c', duration: '12:10' },
      { title: 'Spring', role: 'Sample · Blender Studio open movie', url: 'https://www.youtube.com/watch?v=WhWc3b3KhnY', duration: '7:44' },
    ],
  },
  {
    _key: 'reels',
    _type: 'reels',
    heading: 'Reels',
    navLabel: 'Reels',
    intro: 'Short vertical edits made for Instagram.',
    // Reels must be links to real public reels; add them in /admin (with a cover image each).
    reels: [],
  },
  {
    _key: 'services',
    _type: 'services',
    heading: 'What I do',
    navLabel: 'Services',
    services: [
      { title: 'Photography', text: 'Portraits, events, travel and product shoots.' },
      { title: 'Video editing', text: 'Music videos, reels, YouTube and event films, cut to the rhythm of the story.' },
      { title: 'Colour grading', text: 'A consistent, cinematic look across photos and footage.' },
    ],
  },
  {
    _key: 'about',
    _type: 'about',
    heading: 'About',
    navLabel: 'About',
    portrait: 'https://picsum.photos/id/1005/900/1125',
    bio: 'This is sample text. Shefin can write a short bio here from the admin panel: who he is, where he works, and the kind of stories he likes to tell.\n\nA second paragraph can cover his approach, favourite projects or clients.',
    tools: ['Camera', 'Editing software', 'Colour grading'],
  },
  {
    _key: 'contact',
    _type: 'contact',
    heading: "Let's make something.",
    navLabel: 'Contact',
    body: 'Available for shoots, edits and collaborations. Send a message and I will get back to you.',
  },
]

export const samplePortfolio: Portfolio = {
  name: 'Shefin Shafi',
  role: 'Photographer & video editor',
  statement:
    'I photograph people and places, and cut footage into stories that feel like they were always meant to be told that way.',
  heroVideo: 'https://www.youtube.com/watch?v=R6MlUcmOul8',
  heroStart: 45,
  heroPoster: 'https://picsum.photos/id/1036/1920/1080',
  email: 'shefin@example.com',
  sections,
  isSample: true,
}
