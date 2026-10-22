import 'sanity/bundle.css'
import { Studio } from 'sanity'
import { isSanityConfigured } from '../content/sanity'
import { studioConfig } from './config'

/** Shown at /admin until the Sanity project ID has been added to the site's settings. */
function SetupNotice() {
  return (
    <main style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24, background: '#0c0c0b', color: '#ecebe6', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 560, lineHeight: 1.6 }}>
        <h1 style={{ fontSize: 28, margin: '0 0 12px' }}>The admin panel isn't connected yet</h1>
        <p style={{ color: '#a8a79f' }}>
          Create a free project at sanity.io, then add its project ID to this site as the <code>VITE_SANITY_PROJECT_ID</code>{' '}
          environment variable and redeploy. The README's “Connect the admin panel” section has the steps.
        </p>
        <p>
          <a href="/" style={{ color: '#e0a458' }}>
            ← Back to the site
          </a>
        </p>
      </div>
    </main>
  )
}

export default function AdminApp() {
  if (!isSanityConfigured()) return <SetupNotice />
  return (
    <div style={{ height: '100vh' }}>
      <Studio config={studioConfig} />
    </div>
  )
}
