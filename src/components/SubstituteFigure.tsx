// A Substitute's label, Ticker or TER in its relation's colour, so a closest alternative never looks like a Twin: only a
// Twin is set in `brand` (design-identity.md#colour, docs/strategy.md#twins). Base UI's `render` picks the element and
// its size, so the Fund Picker's answer and the Twin table each keep their own markup.
import { useRender } from '@base-ui/react/use-render'
import type { ReactElement, ReactNode } from 'react'
import { colorClassNameByRelation } from '@lib/colorClassNameByRelation.ts'
import type { SubstituteRelation } from '@/types.ts'

export type SubstituteFigureProps = {
  relation: SubstituteRelation
  /** The element the figure renders as, with its own size class: `<p className="text-ticker" />`. */
  render: ReactElement
  children: ReactNode
}

/**
 * The figure on the element `render` gives it, in the relation's colour.
 *
 * ```tsx
 * <SubstituteFigure relation="twin" render={<p className="text-ticker" />}>SPYL</SubstituteFigure>
 * // <p class="text-brand text-ticker">SPYL</p>
 * <SubstituteFigure relation="closest-alternative" render={<span className="text-fact" />}>0,22 % ročně</SubstituteFigure>
 * // <span class="text-heading text-fact">0,22 % ročně</span>
 * ```
 */
export const SubstituteFigure = ({ relation, render, children }: SubstituteFigureProps) => {
  // Base UI concatenates the colour with the `render` element's own classes. It never goes through `cn`, which doesn't
  // know the page's type scale and would drop a `text-*` size beside a text colour (src/lib/utils.ts).
  return useRender({ render, props: { className: colorClassNameByRelation[relation], children } })
}
