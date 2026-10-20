import { TbCertificate } from 'react-icons/tb'
import { certifications, skillGroups, techStrip } from '../../data/resume'
import AnimatedContent from '../reactbits/AnimatedContent'
import LogoLoop, { type LogoItem } from '../reactbits/LogoLoop'
import SpotlightCard from '../reactbits/SpotlightCard'
import { skillIcons } from '../ui/icons'
import { SectionHeading } from '../ui/SectionHeading'
import { chip, container } from '../ui/styles'

const logos: LogoItem[] = techStrip.map(({ name, icon }) => {
  const { Icon, color } = skillIcons[icon]
  return { node: <Icon aria-hidden="true" />, title: name, ariaLabel: name, hoverColor: color }
})

const card = 'h-full rounded-xl border border-line p-6'

/** Bento layout: the longest list and the certifications card take two columns so every row is full. */
const wide = new Set(['web'])

export function Skills() {
  return (
    <section id="skills" tabIndex={-1} aria-labelledby="skills-title" className="relative py-24 md:py-32">
      <div className="bg-dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,#000_20%,transparent_75%)]" />

      <div className={`${container} relative`}>
        <SectionHeading
          index="02"
          file="stack.json"
          title="Skills & tools"
          id="skills-title"
          description="Languages, frameworks and tools from my coursework, internship and projects."
        />
      </div>

      {/* React Bits LogoLoop: speeds up with scroll velocity (scrollBoost) and slows on hover */}
      <div className="relative py-4 text-muted">
        <LogoLoop
          logos={logos}
          speed={55}
          logoHeight={34}
          gap={56}
          labels="inline"
          hoverSpeed={12}
          scrollBoost={0.6}
          fadeOut
          fadeOutWidth={0.14}
          ariaLabel="Technologies I use"
        />
      </div>

      <div className={`${container} relative mt-14`}>
        {/* React Bits AnimatedContent staggers the cards in as the grid enters the viewport */}
        <AnimatedContent
          stagger={0.08}
          distance={48}
          duration={0.9}
          threshold={0.15}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {skillGroups.map((group) => (
            <SpotlightCard
              key={group.key}
              className={`${card} ${wide.has(group.key) ? 'lg:col-span-2' : ''}`}
              spotlightColor="#7ee787"
              intensity={0.09}
              borderGlow={0.65}
            >
              <p className="font-mono text-sm" aria-hidden="true">
                <span className="text-prop">&quot;{group.key}&quot;</span>
                <span className="text-subtle">: [</span>
              </p>
              <h3 className="mt-1 text-lg font-semibold text-fg">{group.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => {
                  const icon = item.icon ? skillIcons[item.icon] : null
                  return (
                    <li key={item.name} className={chip}>
                      {icon && <icon.Icon aria-hidden="true" className="size-3.5" style={{ color: icon.color }} />}
                      {item.name}
                    </li>
                  )
                })}
              </ul>
              {group.note && <p className="mt-4 font-mono text-xs text-subtle">{`// ${group.note}`}</p>}
              <p className="mt-4 font-mono text-sm text-subtle" aria-hidden="true">
                ],
              </p>
            </SpotlightCard>
          ))}

          <SpotlightCard className={`${card} sm:col-span-2`} spotlightColor="#7ee787" intensity={0.09} borderGlow={0.65}>
            <p className="font-mono text-sm" aria-hidden="true">
              <span className="text-prop">&quot;certifications&quot;</span>
              <span className="text-subtle">: [</span>
            </p>
            <h3 className="mt-1 text-lg font-semibold text-fg">Certifications</h3>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {certifications.map((cert) => (
                <li key={cert.name} className="flex gap-3">
                  <TbCertificate className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-medium text-fg">{cert.name}</span>
                    <span className="block font-mono text-xs text-muted">{cert.detail}</span>
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-sm text-subtle" aria-hidden="true">
              ]
            </p>
          </SpotlightCard>
        </AnimatedContent>
      </div>
    </section>
  )
}
