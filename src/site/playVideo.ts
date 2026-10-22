import { createContext, useContext } from 'react'

export interface VideoRequest {
  url: string
  title: string
}

export const PlayContext = createContext<(video: VideoRequest) => void>(() => {})

/** Opens a YouTube / Vimeo / Instagram link in the site's video player (other links open in a new tab). */
export const usePlayVideo = () => useContext(PlayContext)
