// A link to another route of the page that keeps the current query string, so the `utm_content` naming the Ad Variant
// survives a trip to the privacy policy and back: the Visitor returns to the First Screen their Ad opened, and every
// Funnel Event keeps reporting the `ad_variant` they see (README.md#funnel).
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'

export type QueryKeepingLinkProps = {
  /** The route's path, without a query string. */
  pathname: string
  className?: string
  /** Opens the route in a new tab, so a half-filled Lead Form stays as it is. */
  opensInNewTab?: boolean
  children: ReactNode
}

/**
 * A router link to `pathname` carrying the current `?…`.
 *
 * ```tsx
 * // on /?utm_content=money
 * <QueryKeepingLink pathname="/ochrana-osobnich-udaju">zásady</QueryKeepingLink>
 * // <a href="/ochrana-osobnich-udaju?utm_content=money">zásady</a>
 * ```
 */
export const QueryKeepingLink = ({ pathname, className, opensInNewTab = false, children }: QueryKeepingLinkProps) => {
  const { search } = useLocation()

  return (
    <Link to={{ pathname, search }} className={className} {...(opensInNewTab && { target: '_blank', rel: 'noopener' })}>
      {children}
    </Link>
  )
}
