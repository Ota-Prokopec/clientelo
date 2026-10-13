// The app's entry point: loads the self-hosted font and global styles, sets up Motion, and mounts the router.
import '@fontsource/schibsted-grotesk/400.css'
import '@fontsource/schibsted-grotesk/700.css'
import '@fontsource/schibsted-grotesk/900.css'
import { LazyMotion, MotionConfig } from 'motion/react'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router/dom'
import { router } from './router.tsx'
import './index.css'

/**
 * Loads Motion's domAnimation features from their own chunk, so they stay off the First Screen's critical path.
 *
 * ```ts
 * await loadMotionFeatures() // domAnimation
 * ```
 */
const loadMotionFeatures = () => import('./motionFeatures.ts').then((motionFeaturesModule) => motionFeaturesModule.default)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* Only `m.*` components animate, with the domAnimation features (ADR-0003); `strict` makes a `motion.*` one throw.
        reducedMotion="user" drops transforms for a Visitor who asks the system for reduced motion. */}
    <LazyMotion features={loadMotionFeatures} strict>
      <MotionConfig reducedMotion="user">
        <RouterProvider router={router} />
      </MotionConfig>
    </LazyMotion>
  </StrictMode>,
)
