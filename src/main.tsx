// The app's entry point: loads the self-hosted font and global styles, and mounts the router.
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from './router.tsx'
import '@fontsource-variable/bricolage-grotesque/opsz.css'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
