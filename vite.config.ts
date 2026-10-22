import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Absolute paths: the /admin route must still find /assets/… when loaded directly.
  base: '/',
  plugins: [react(), tailwindcss()],
  build: {
    // The /admin editor (Sanity Studio) is large by nature; it loads only on /admin, never on the public site.
    chunkSizeWarningLimit: 4000,
  },
})
