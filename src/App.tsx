import { useCallback, useState } from 'react'
import { BootIntro } from './components/layout/BootIntro'
import { MobileNav } from './components/layout/MobileNav'
import { Navbar } from './components/layout/Navbar'
import { StatusBar } from './components/layout/StatusBar'
import ClickSpark from './components/reactbits/ClickSpark'
import { About } from './components/sections/About'
import { Contact } from './components/sections/Contact'
import { Hero } from './components/sections/Hero'
import { Journey } from './components/sections/Journey'
import { Projects } from './components/sections/Projects'
import { Skills } from './components/sections/Skills'
import { IntroContext, shouldPlayIntro } from './providers/intro'
import { SmoothScroll } from './providers/SmoothScroll'

export default function App() {
  const [bootVisible, setBootVisible] = useState(() => {
    const play = shouldPlayIntro()
    // The intro starts at the top of the page, so don't let the browser restore an old scroll position.
    if (play && 'scrollRestoration' in history) history.scrollRestoration = 'manual'
    return play
  })
  const [introDone, setIntroDone] = useState(!bootVisible)

  const handleReveal = useCallback(() => setIntroDone(true), [])
  const handleFinish = useCallback(() => setBootVisible(false), [])

  return (
    <SmoothScroll>
      <IntroContext.Provider value={introDone}>
        <ClickSpark sparkColor="#7ee787" sparkSize={9} sparkRadius={22} sparkCount={9} duration={420}>
          <a
            href="#main"
            className="sr-only fixed top-3 left-3 z-[70] rounded-md bg-accent px-4 py-2 font-medium text-bg focus:not-sr-only"
          >
            Skip to content
          </a>

          <Navbar />
          <MobileNav />

          <main id="main" tabIndex={-1}>
            <Hero />
            <About />
            <Skills />
            <Journey />
            <Projects />
            <Contact />
          </main>

          <StatusBar />
        </ClickSpark>

        {bootVisible && <BootIntro onReveal={handleReveal} onFinish={handleFinish} />}
      </IntroContext.Provider>
    </SmoothScroll>
  )
}
