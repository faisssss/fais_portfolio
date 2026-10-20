import type { ReactNode } from 'react'
import { cn } from '../../lib/cn'
import SpotlightCard from '../reactbits/SpotlightCard'

interface EditorWindowProps {
  /** File name (or shell title) shown in the title bar */
  title: string
  children: ReactNode
  /** Extra content on the right of the title bar, e.g. a status badge */
  badge?: ReactNode
  /** Wrap in a React Bits SpotlightCard so the frame lights up under the cursor */
  spotlight?: boolean
  className?: string
  bodyClassName?: string
}

/** A code-editor / terminal window frame: traffic lights, file name, body. */
export function EditorWindow({ title, children, badge, spotlight, className, bodyClassName }: EditorWindowProps) {
  const chrome = (
    <>
      <div className="flex items-center gap-3 border-b border-line bg-elevated/70 px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="size-2.5 rounded-full bg-[#ff5f57]/85" />
          <span className="size-2.5 rounded-full bg-[#febc2e]/85" />
          <span className="size-2.5 rounded-full bg-[#28c840]/85" />
        </div>
        <span className="truncate font-mono text-xs text-muted">{title}</span>
        {badge && <span className="ml-auto shrink-0">{badge}</span>}
      </div>
      <div className={bodyClassName}>{children}</div>
    </>
  )

  if (spotlight) {
    return (
      <SpotlightCard
        className={cn('flex flex-col rounded-xl', className)}
        spotlightColor="#7ee787"
        intensity={0.1}
        borderGlow={0.7}
        spotlightSize={320}
      >
        {chrome}
      </SpotlightCard>
    )
  }

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-line bg-surface shadow-[0_30px_80px_-40px_rgba(0,0,0,0.9)]',
        className,
      )}
    >
      {chrome}
    </div>
  )
}
