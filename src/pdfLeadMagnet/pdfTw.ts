// The Lead Magnet PDF's Tailwind: the page's class names (`text-brand`, `border-t-heading`, `text-title`) turned into
// react-pdf styles by react-pdf-tailwind, in the light palette src/design/tokens.ts mirrors (ADR-0003). It corrects two
// habits of the library: a hyphenated colour role (`text-block-foreground`) would resolve to its prefix's colour
// (`block`), and a class it can't resolve would only log a warning. Here such a class throws, which fails the build.
import { createTw } from 'react-pdf-tailwind'
import { lightColourByRole, type ColourRole } from '@/design/tokens.ts'

/** The react-pdf style a list of classes resolves to. */
export type PdfStyle = ReturnType<ReturnType<typeof createTw>>

/** A type role (design-identity.md#type) at the PDF's A4 scale, in points. Tracking is in `em`, as on the page. */
type PdfTypeRole = { sizePt: number; lineHeight: number; trackingEm?: number; fontWeight?: number }

// The page's roles that the PDF sets, scaled for print. Weights and tracking are the page's own.
const pdfTypeRoleByName: Record<string, PdfTypeRole> = {
  headline: { sizePt: 25, lineHeight: 0.95, trackingEm: -0.045, fontWeight: 900 },
  difference: { sizePt: 26, lineHeight: 0.95, trackingEm: -0.05, fontWeight: 900 },
  title: { sizePt: 14, lineHeight: 1.05, trackingEm: -0.045, fontWeight: 900 },
  fact: { sizePt: 10.5, lineHeight: 1.2, fontWeight: 700 },
  body: { sizePt: 9.5, lineHeight: 1.45 },
  label: { sizePt: 8, lineHeight: 1.35, fontWeight: 700 },
  note: { sizePt: 7, lineHeight: 1.4 },
}

/**
 * A colour role as react-pdf-tailwind can look it up: the library splits a class on `-`, so a role keeps none.
 *
 * ```ts
 * toLookupColourName('block-foreground') // 'blockForeground'
 * toLookupColourName('brand')            // 'brand'
 * ```
 */
const toLookupColourName = (colourRole: ColourRole): string =>
  colourRole.replaceAll(/-(\w)/g, (_hyphenAndLetter, letter: string) => letter.toUpperCase())

const colourRoles = Object.keys(lightColourByRole) as ColourRole[]

// The longest first, so `text-muted-foreground` is matched as `muted-foreground`, never as `foreground`.
const hyphenatedColourRoles = colourRoles
  .filter((colourRole) => colourRole.includes('-'))
  .toSorted((first, second) => second.length - first.length)

/**
 * A class with its hyphenated colour role renamed to the name react-pdf-tailwind looks up.
 *
 * ```ts
 * toLookupClassName('text-block-foreground') // 'text-blockForeground'
 * toLookupClassName('border-t-2')            // 'border-t-2'
 * ```
 */
const toLookupClassName = (className: string): string => {
  const colourRole = hyphenatedColourRoles.find((hyphenatedColourRole) =>
    className.endsWith(`-${hyphenatedColourRole}`),
  )

  return colourRole ? `${className.slice(0, -colourRole.length)}${toLookupColourName(colourRole)}` : className
}

const resolveClassNames = createTw({
  colors: Object.fromEntries(
    colourRoles.map((colourRole) => [toLookupColourName(colourRole), lightColourByRole[colourRole]]),
  ),
  // No family class: react-pdf-tailwind keeps only the first family of a list, which would drop the latin-ext
  // fallback that carries the Czech glyphs. The Document sets the family list once (registerPdfFonts.ts).
  fontFamily: {},
  fontSize: Object.fromEntries(
    Object.entries(pdfTypeRoleByName).map(([roleName, { sizePt, lineHeight, trackingEm, fontWeight }]) => [
      roleName,
      [
        sizePt,
        {
          lineHeight,
          // react-pdf-tailwind reads `em` as `rem`, so the tracking is set in points of the role's own size.
          ...(trackingEm === undefined ? {} : { letterSpacing: sizePt * trackingEm }),
          ...(fontWeight === undefined ? {} : { fontWeight }),
        },
      ],
    ]),
  ),
})

/**
 * The react-pdf style for a list of Tailwind classes, in the page's tokens. Throws on a class it can't resolve.
 *
 * ```ts
 * pdfTw('text-brand')                      // { color: '#00666c' }
 * pdfTw('text-block-foreground bg-block')  // { color: '#ffffff', backgroundColor: '#06322f' }
 * pdfTw('text-brnd')                       // throws: Unknown class "text-brnd"
 * ```
 */
export const pdfTw = (classNames: string): PdfStyle => {
  const lookupClassNames = classNames
    .split(/\s+/)
    .filter(Boolean)
    .map((className) => {
      const lookupClassName = toLookupClassName(className)
      if (Object.keys(resolveClassNames(lookupClassName)).length === 0) {
        throw new Error(`Unknown class "${className}" in the Lead Magnet PDF`)
      }
      return lookupClassName
    })

  return resolveClassNames(lookupClassNames.join(' '))
}
