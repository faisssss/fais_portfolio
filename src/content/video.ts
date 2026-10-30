/** Works out what kind of video link was pasted and how to embed it. */

export type VideoInfo =
  | { kind: 'youtube'; id: string; embed: string; background: string; thumbnail: string }
  | { kind: 'vimeo'; id: string; embed: string; background: string; thumbnail: string }
  | { kind: 'instagram'; id: string; embed: string }
  | { kind: 'link'; href: string }

const YOUTUBE = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([\w-]{11})/i
const VIMEO = /vimeo\.com\/(?:video\/|channels\/[\w-]+\/|groups\/[\w-]+\/videos\/)?(\d+)/i
const INSTAGRAM = /instagram\.com\/(?:[\w.]+\/)?(?:reel|reels|p|tv)\/([\w-]+)/i

/** True for a link to one specific Instagram reel/post (not a profile), which can play inside the site. */
export const isInstagramReel = (url: string) => INSTAGRAM.test(url)

/** Silent looping background version of a YouTube/Vimeo link, starting `start` seconds in. */
export function backgroundVideo(url: string, start = 0): string | null {
  const info = parseVideo(url)
  if (!('background' in info)) return null
  const from = Math.max(0, Math.floor(start))
  if (!from) return info.background
  return info.kind === 'youtube' ? `${info.background}&start=${from}` : `${info.background}#t=${from}s`
}

export function parseVideo(url: string): VideoInfo {
  const yt = url.match(YOUTUBE)
  if (yt) {
    const id = yt[1]
    return {
      kind: 'youtube',
      id,
      embed: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1&playsinline=1`,
      background: `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=0&playsinline=1&rel=0&modestbranding=1&disablekb=1`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    }
  }
  const vm = url.match(VIMEO)
  if (vm) {
    const id = vm[1]
    return {
      kind: 'vimeo',
      id,
      embed: `https://player.vimeo.com/video/${id}?autoplay=1&dnt=1`,
      background: `https://player.vimeo.com/video/${id}?background=1&dnt=1`,
      thumbnail: `https://vumbnail.com/${id}.jpg`,
    }
  }
  const ig = url.match(INSTAGRAM)
  if (ig) {
    return { kind: 'instagram', id: ig[1], embed: `https://www.instagram.com/reel/${ig[1]}/embed` }
  }
  return { kind: 'link', href: url }
}

export const videoThumbnail = (url: string) => {
  const info = parseVideo(url)
  return 'thumbnail' in info ? info.thumbnail : undefined
}
