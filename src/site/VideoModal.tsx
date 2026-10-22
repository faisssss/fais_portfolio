import { useLenis } from 'lenis/react'
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { TbX } from 'react-icons/tb'
import { parseVideo } from '../content/video'
import { gsap, media, useGSAP } from '../lib/gsap'
import { PlayContext, type VideoRequest } from './playVideo'

/**
 * One shared player: a native <dialog> (focus trap + Escape for free). The iframe only exists while
 * the dialog is open, so closing it stops playback. Lenis pauses so the page behind can't scroll.
 */
export function VideoProvider({ children }: { children: ReactNode }) {
  const [video, setVideo] = useState<VideoRequest | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)
  const lenis = useLenis()

  const play = useCallback((request: VideoRequest) => {
    if (parseVideo(request.url).kind === 'link') {
      window.open(request.url, '_blank', 'noopener,noreferrer')
      return
    }
    setVideo(request)
  }, [])

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    if (video && !el.open) {
      el.showModal()
      lenis?.stop()
    }
  }, [video, lenis])

  useGSAP(
    () => {
      if (!video) return
      gsap.matchMedia().add(media.motionOK, () => {
        gsap.fromTo('[data-player]', { autoAlpha: 0, y: 24, scale: 0.97 }, { autoAlpha: 1, y: 0, scale: 1, duration: 0.6, ease: 'power3.out' })
      })
    },
    { scope: dialog, dependencies: [video], revertOnUpdate: true },
  )

  const info = video ? parseVideo(video.url) : null
  const vertical = info?.kind === 'instagram'

  return (
    <PlayContext.Provider value={play}>
      {children}
      <dialog
        ref={dialog}
        aria-label={video ? `Video: ${video.title}` : 'Video player'}
        onClose={() => {
          setVideo(null)
          lenis?.start()
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close()
        }}
        className="m-0 h-dvh max-h-none w-screen max-w-none overflow-hidden bg-black/92 p-0 text-fg backdrop:bg-black/80 open:flex open:items-center open:justify-center"
        data-lenis-prevent
      >
        {info && 'embed' in info && (
          <div
            data-player
            className={
              vertical
                ? 'h-[min(88svh,760px)] w-[min(92vw,400px)]'
                : 'aspect-video w-[min(92vw,calc(84svh*16/9))]'
            }
          >
            <iframe
              src={info.embed}
              title={video!.title}
              allow="autoplay; fullscreen; picture-in-picture; encrypted-media; clipboard-write"
              className="size-full rounded-md border-0 bg-black"
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => dialog.current?.close()}
          aria-label="Close video"
          className="fixed top-4 right-4 grid size-12 place-items-center rounded-full bg-white/10 text-fg transition-colors hover:bg-white/20"
        >
          <TbX className="size-6" aria-hidden="true" />
        </button>
      </dialog>
    </PlayContext.Provider>
  )
}
