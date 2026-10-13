// The Page every route renders all of its content inside: the one centred column with the 16 px gutter
// (design-identity.md#layout). It alone sets the column's width, so no Section, Footer or route sets its own.
import type { ReactNode } from 'react'

export type PageArgs = { children: ReactNode }

/**
 * Everything one route renders, centred in a column at most 36 rem wide and 16 px in from the screen's edges.
 *
 * ```tsx
 * <Page><main>…</main><Footer /></Page>
 * // <div class="mx-auto max-w-xl px-4"><main>…</main><footer id="footer">…</footer></div>
 * ```
 */
export const Page = ({ children }: PageArgs) => {
  return <div className="mx-auto max-w-xl px-4">{children}</div>
}
