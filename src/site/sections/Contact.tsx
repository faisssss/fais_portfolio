import { useId, useState, type FormEvent } from 'react'
import { TbArrowUpRight, TbBrandWhatsapp } from 'react-icons/tb'
import Magnet from '../../components/reactbits/Magnet'
import type { Portfolio } from '../../content/types'
import { SectionHeader } from '../SectionHeader'
import { buttonOutline, buttonSolid, container } from '../ui'
import { SocialLinks } from '../SocialLinks'

interface ContactProps {
  id: string
  heading: string
  intro?: string
  body?: string
  data: Portfolio
}

const field =
  'w-full rounded border border-line bg-surface px-4 py-3.5 text-base text-fg placeholder:text-muted/70 focus:border-accent focus:outline-none'

/**
 * Big email link, WhatsApp and socials, plus an enquiry form. The form has no server: it opens the
 * visitor's email app with the message filled in, so nothing can get lost.
 */
export function Contact({ id, heading, intro, body, data }: ContactProps) {
  const formId = useId()
  const [sent, setSent] = useState(false)

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!data.email) return
    const form = new FormData(event.currentTarget)
    const name = String(form.get('name') ?? '')
    const from = String(form.get('email') ?? '')
    const message = String(form.get('message') ?? '')
    const subject = `Enquiry from ${name || 'the website'}`
    const text = `${message}\n\n— ${name}${from ? ` (${from})` : ''}`
    window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`
    setSent(true)
  }

  return (
    <section id={id} tabIndex={-1} aria-labelledby={`${id}-title`} className="border-t border-line">
      <div className={`${container} grid gap-16 py-24 md:py-32 lg:grid-cols-2`}>
        <div>
          <SectionHeader id={`${id}-title`} heading={heading} intro={intro} />
          {body && <p className="mt-6 max-w-md text-lg text-muted">{body}</p>}
          {data.email && (
            <Magnet padding={50} magnetStrength={6} wrapperClassName="mt-10">
              <a
                href={`mailto:${data.email}`}
                className="group inline-flex items-center gap-2 font-serif text-[clamp(1.75rem,4vw,3rem)] break-all underline decoration-line decoration-1 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent"
              >
                {data.email}
                <TbArrowUpRight aria-hidden="true" className="size-7 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </Magnet>
          )}
          <div className="mt-10 flex flex-wrap items-center gap-3">
            {data.whatsapp && (
              <a href={`https://wa.me/${data.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className={buttonOutline}>
                <TbBrandWhatsapp aria-hidden="true" className="size-5" />
                WhatsApp
              </a>
            )}
            <SocialLinks data={data} />
          </div>
        </div>

        {data.email && (
          <form onSubmit={onSubmit} aria-label="Send an enquiry" className="flex flex-col gap-5 self-end">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm text-muted" htmlFor={`${formId}-name`}>
                Name
                <input id={`${formId}-name`} name="name" autoComplete="name" required className={field} />
              </label>
              <label className="flex flex-col gap-2 text-sm text-muted" htmlFor={`${formId}-email`}>
                Email
                <input id={`${formId}-email`} name="email" type="email" autoComplete="email" className={field} />
              </label>
            </div>
            <label className="flex flex-col gap-2 text-sm text-muted" htmlFor={`${formId}-message`}>
              What do you have in mind?
              <textarea id={`${formId}-message`} name="message" rows={5} required className={`${field} resize-y`} />
            </label>
            <div className="flex flex-wrap items-center gap-4">
              <button type="submit" className={buttonSolid}>
                Send enquiry
              </button>
              <p role="status" className="text-sm text-muted">
                {sent ? 'Your email app should open with the message ready to send.' : 'Opens your email app with the message filled in.'}
              </p>
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
