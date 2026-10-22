/** Shared class strings and helpers for the public site. */

export const container = 'mx-auto w-full max-w-[90rem] px-5 sm:px-8 lg:px-12'

export const pillButton =
  'inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-medium transition-colors md:text-base'

export const buttonSolid = `${pillButton} bg-accent text-bg hover:bg-[#ecb877]`
export const buttonOutline = `${pillButton} border border-fg/40 text-fg hover:border-accent hover:text-accent`

export const sectionHeading = 'font-serif text-[clamp(2.75rem,7vw,6rem)] leading-[0.95] font-normal tracking-[-0.02em]'

/** URL-friendly id for a section, unique by falling back to its key. */
export const sectionId = (label: string | undefined, key: string) =>
  (label || key)
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || key

export const paragraphs = (text?: string) =>
  (text ?? '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
