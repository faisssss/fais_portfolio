/** Shared class strings for buttons and tags, so every section uses the same look. */

const buttonBase =
  'inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-medium transition-[background-color,color,border-color] duration-200 md:text-base'

export const buttonPrimary = `${buttonBase} bg-accent text-bg hover:bg-[#a3f0aa]`

export const buttonGhost = `${buttonBase} border border-line-strong bg-surface/60 text-fg backdrop-blur hover:border-accent/60 hover:text-accent`

export const chip =
  'inline-flex items-center gap-1.5 rounded-md border border-line bg-elevated/60 px-2.5 py-1 font-mono text-xs text-fg/85'

export const container = 'mx-auto w-full max-w-6xl px-5 sm:px-8'
