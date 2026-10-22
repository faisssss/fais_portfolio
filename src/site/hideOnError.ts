import type { SyntheticEvent } from 'react'

/** Hide an image that fails to load, so the dark placeholder shows instead of a broken-image icon. */
export const hideOnError = (event: SyntheticEvent<HTMLImageElement>) => {
  event.currentTarget.style.visibility = 'hidden'
}
