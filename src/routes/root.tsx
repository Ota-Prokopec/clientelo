// The layout every route renders inside. The landing page has no navigation: its only way forward is the Lead Form.
import { Outlet, ScrollRestoration } from 'react-router'

/**
 * Renders the matched route with no chrome around it, and restores the scroll position per route: the privacy policy
 * opens at its top, and going back returns the Visitor to where they were on the landing page.
 *
 * ```tsx
 * // `/` → <Home />, `/ochrana-osobnich-udaju` → <PrivacyPolicy /> scrolled to the top
 * ```
 */
const Root = () => {
  return (
    <>
      <ScrollRestoration />
      <Outlet />
    </>
  )
}

export default Root
