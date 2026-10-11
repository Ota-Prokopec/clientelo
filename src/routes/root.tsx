// The layout every route renders inside. The landing page has no navigation: its only way forward is the Lead Form.
import { Outlet } from 'react-router'

/**
 * Renders the matched route with no chrome around it.
 *
 * ```tsx
 * // `/` → <Home />, `/ochrana-osobnich-udaju` → <PrivacyPolicy />
 * ```
 */
export default function Root() {
  return <Outlet />
}
