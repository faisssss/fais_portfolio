import { useLenis } from 'lenis/react'
import { useMemo, useState } from 'react'
import Masonry, { type MasonryItem } from '../../components/reactbits/Masonry'
import type { Photo } from '../../content/types'
import { cn } from '../../lib/cn'
import { SectionHeader } from '../SectionHeader'
import { container } from '../ui'

interface GalleryProps {
  id: string
  heading: string
  intro?: string
  photos: Photo[]
}

const ALL = 'All'

/**
 * Photo grid built on React Bits Masonry: images rise in as they enter, zoom on hover and open in its
 * lightbox (arrow keys / swipe). Category buttons filter the grid and the tiles glide to their new spots.
 */
export function Gallery({ id, heading, intro, photos }: GalleryProps) {
  const lenis = useLenis()
  const [filter, setFilter] = useState(ALL)

  const categories = useMemo(() => {
    const names = [...new Set(photos.map((p) => p.category?.trim()).filter((c): c is string => !!c))]
    return names.length > 1 ? [ALL, ...names] : []
  }, [photos])

  const items = useMemo<MasonryItem[]>(
    () =>
      photos
        .map((photo, index) => ({ photo, index }))
        .filter(({ photo }) => filter === ALL || photo.category?.trim() === filter)
        .map(({ photo, index }) => ({
          id: index,
          img: photo.src,
          width: photo.width,
          height: photo.height,
          title: photo.caption,
          description: photo.category,
          alt: photo.alt,
        })),
    [photos, filter],
  )

  if (!photos.length) return null

  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className={`${container} py-24 md:py-32`}>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-8 md:mb-14">
        <SectionHeader id={`${id}-title`} heading={heading} intro={intro} />
        {categories.length > 0 && (
          <div role="group" aria-label="Filter photos" className="flex flex-wrap gap-2">
            {categories.map((name) => (
              <button
                key={name}
                type="button"
                aria-pressed={filter === name}
                onClick={() => setFilter(name)}
                className={cn(
                  'min-h-11 rounded-full border px-5 text-sm transition-colors',
                  filter === name ? 'border-fg bg-fg text-bg' : 'border-line text-fg hover:border-fg/60',
                )}
              >
                {name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div data-cursor-group="View">
        <Masonry
          items={items}
          columnWidth={340}
          gap={14}
          radius={4}
          animateFrom="bottom"
          stagger={0.06}
          duration={0.8}
          blurToFocus
          revealOnScroll
          hoverEffect="zoom"
          captions="hover"
          parallax={0.35}
          lightbox
          draggable={false}
          onLightboxChange={(open) => (open ? lenis?.stop() : lenis?.start())}
        />
      </div>
    </section>
  )
}
