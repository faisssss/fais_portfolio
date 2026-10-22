/** Sanity project settings, read from environment variables (see README → "Connect the admin panel"). */
export const sanityConfig = {
  projectId: (import.meta.env.VITE_SANITY_PROJECT_ID as string | undefined)?.trim() || '',
  dataset: (import.meta.env.VITE_SANITY_DATASET as string | undefined)?.trim() || 'production',
  apiVersion: '2025-02-19',
}

export const isSanityConfigured = () => /^[a-z0-9-]+$/.test(sanityConfig.projectId)

/** The single document Shefin edits in /admin. */
export const PORTFOLIO_ID = 'portfolio'
