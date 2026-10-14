// A heading inside the privacy policy, set on a 2 px rule like a Section's label (design-identity.md#layout).
import type { ReactNode } from 'react'

export type PolicyHeadingProps = { children: ReactNode }

/**
 * A heading inside the policy, set on a 2 px rule like a Section's label.
 *
 * ```tsx
 * <PolicyHeading>Proč</PolicyHeading> // <h2>Proč</h2>
 * ```
 */
export const PolicyHeading = ({ children }: PolicyHeadingProps) => {
  return <h2 className="mt-4 border-t-2 border-heading pt-1.5 text-fact text-heading">{children}</h2>
}
