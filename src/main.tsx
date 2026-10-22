import { lazy, StrictMode, Suspense } from 'react'
import { createRoot } from 'react-dom/client'

// /admin loads the Sanity editor; everything else is the public site. Each is its own bundle.
const isAdmin = window.location.pathname.replace(/\/+$/, '').startsWith('/admin')
const Root = isAdmin ? lazy(() => import('./admin/AdminApp')) : lazy(() => import('./site/SiteApp'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={null}>
      <Root />
    </Suspense>
  </StrictMode>,
)
