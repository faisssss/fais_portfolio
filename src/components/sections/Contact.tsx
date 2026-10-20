import { useEffect, useRef, useState } from 'react'
import { TbArrowUpRight, TbCheck, TbCopy, TbDownload, TbMail } from 'react-icons/tb'
import { contact, profile } from '../../data/resume'
import { gsap, media, useGSAP } from '../../lib/gsap'
import Magnet from '../reactbits/Magnet'
import { EditorWindow } from '../ui/EditorWindow'
import { SectionHeading } from '../ui/SectionHeading'
import { buttonGhost, buttonPrimary, container } from '../ui/styles'

const COMMAND = './contact.sh'

const rows = [
  { key: 'email', label: contact.email, href: `mailto:${contact.email}` },
  { key: 'github', label: contact.github.label, href: contact.github.href },
  { key: 'linkedin', label: contact.linkedin.label, href: contact.linkedin.href },
]

const Prompt = () => (
  <>
    <span className="text-accent">{profile.handle}@portfolio</span>
    <span className="text-fg">:</span>
    <span className="text-number">~</span>
    <span className="text-fg">$ </span>
  </>
)

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}

export function Contact() {
  const root = useRef<HTMLElement>(null)
  const [copied, setCopied] = useState<'idle' | 'copied' | 'failed'>('idle')

  useEffect(() => {
    if (copied === 'idle') return
    const id = window.setTimeout(() => setCopied('idle'), 2200)
    return () => window.clearTimeout(id)
  }, [copied])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(media.motionOK, () => {
        // Terminal session: type the command (GSAP TextPlugin), then print the output line by line.
        gsap.set('[data-cmd]', { text: '' })
        gsap
          .timeline({ scrollTrigger: { trigger: '[data-terminal]', start: 'top 72%', once: true } })
          .to('[data-cmd]', { text: COMMAND, duration: COMMAND.length * 0.06, ease: 'none' }, 0.3)
          // opacity (not autoAlpha) so the links stay focusable before the reveal plays
          .from('[data-out]', { opacity: 0, y: 8, duration: 0.35, stagger: 0.13 }, '+=0.25')

        gsap.to('[data-caret]', { autoAlpha: 0, repeat: -1, yoyo: true, duration: 0.55, ease: 'steps(1)' })
      })
    },
    { scope: root },
  )

  const onCopy = async () => setCopied((await copyText(contact.email)) ? 'copied' : 'failed')

  return (
    <section id="contact" ref={root} tabIndex={-1} aria-labelledby="contact-title" className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-[radial-gradient(ellipse_60%_55%_at_50%_100%,rgb(126_231_135/0.10),transparent)]" />

      <div className={`${container} relative`}>
        <SectionHeading
          index="05"
          file="contact.sh"
          title="Get in touch"
          id="contact-title"
          description={profile.lookingFor}
        />

        <div className="grid items-start gap-10 lg:grid-cols-[1.25fr_0.75fr] lg:gap-14">
          <div data-terminal>
            <EditorWindow title="zsh — ~/contact" bodyClassName="p-5 font-mono text-[13px] leading-7 sm:p-7 sm:text-sm">
              <p>
                <Prompt />
                <span data-cmd className="text-fg">
                  {COMMAND}
                </span>
              </p>

              <div className="mt-3">
                <p data-out className="text-comment">
                  # reachable at
                </p>
                <dl className="mt-1 space-y-1">
                  {rows.map((row) => (
                    <div key={row.key} data-out className="grid grid-cols-[5.5rem_1fr] gap-2 sm:grid-cols-[6.5rem_1fr]">
                      <dt className="text-prop">{row.key}</dt>
                      <dd className="min-w-0">
                        <a
                          href={row.href}
                          target={row.href.startsWith('http') ? '_blank' : undefined}
                          rel={row.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="group inline-flex max-w-full items-center gap-1 break-all text-string underline-offset-4 hover:underline"
                        >
                          {row.label}
                          {row.href.startsWith('http') && (
                            <TbArrowUpRight aria-hidden="true" className="shrink-0 opacity-60 transition-opacity group-hover:opacity-100" />
                          )}
                        </a>
                      </dd>
                    </div>
                  ))}
                </dl>
                <p data-out className="mt-3 text-muted">
                  <span className="text-accent">✓</span> open to internships &amp; entry-level roles
                </p>
              </div>

              <p data-out className="mt-4">
                <Prompt />
                <span data-caret className="inline-block h-[1.1em] w-[0.55em] translate-y-[0.2em] bg-fg/80" />
              </p>
            </EditorWindow>
          </div>

          <div className="flex flex-col items-start gap-4">
            <p className="text-lg text-fg md:text-xl">
              Email is the quickest way to reach me. I&apos;d love to hear about internship and entry-level opportunities.
            </p>
            <div className="mt-2 flex flex-wrap gap-3">
              <Magnet padding={60} magnetStrength={4}>
                <a href={`mailto:${contact.email}`} className={buttonPrimary}>
                  <TbMail aria-hidden="true" className="size-5" />
                  Say hello
                </a>
              </Magnet>
              <button type="button" onClick={onCopy} className={buttonGhost}>
                {copied === 'copied' ? (
                  <TbCheck aria-hidden="true" className="size-5 text-accent" />
                ) : (
                  <TbCopy aria-hidden="true" className="size-5" />
                )}
                {copied === 'copied' ? 'Copied' : 'Copy email'}
              </button>
              {profile.resumeUrl && (
                <a href={profile.resumeUrl} download className={buttonGhost}>
                  <TbDownload aria-hidden="true" className="size-5" />
                  Resume
                </a>
              )}
            </div>
            <p role="status" aria-live="polite" className="min-h-5 font-mono text-xs text-muted">
              {copied === 'copied' && 'Email address copied to clipboard.'}
              {copied === 'failed' && `Couldn't copy automatically. The address is ${contact.email}.`}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
