// Tests that src/design/tokens.ts mirrors src/index.css: every colour role's light value, the font family and the
// weights the page loads, so the Lead Magnet PDF can't drift from the page's look (ADR-0003).
import type { Root } from 'postcss'
import { describe, expect, it } from 'vitest'
import { fontFamilyByRole, fontWeights, lightColourByRole } from '@/design/tokens.ts'
import { indexCssStylesheet, isDarkRootRule, listThemeColourRoleNames } from '../indexCssStylesheet.ts'

/**
 * The value each custom property has in the light `:root` rule, keyed by its name without the `--`.
 *
 * ```css
 * :root, [data-palette='light'] { --brand: #00666c; } → { brand: '#00666c' }
 * @media (prefers-color-scheme: dark) { :root { --brand: #7fd0c9; } } → ignored
 * ```
 */
const readLightValueByCustomPropertyName = (stylesheet: Root): Map<string, string> => {
  const lightValueByCustomPropertyName = new Map<string, string>()
  stylesheet.walkRules((rule) => {
    if (!rule.selectors.includes(':root') || isDarkRootRule(rule)) return
    rule.walkDecls(/^--/, (declaration) => {
      lightValueByCustomPropertyName.set(declaration.prop.slice(2), declaration.value)
    })
  })
  return lightValueByCustomPropertyName
}

/**
 * The first family of a `@theme` font token, unquoted: the one the page renders with.
 *
 * ```css
 * @theme { --font-sans: 'Schibsted Grotesk', system-ui, sans-serif; } → 'Schibsted Grotesk'
 * ```
 */
const readFirstFontFamily = (stylesheet: Root, fontTokenName: string): string | undefined => {
  let firstFontFamily: string | undefined
  stylesheet.walkAtRules('theme', (themeAtRule) => {
    themeAtRule.walkDecls(fontTokenName, (fontDeclaration) => {
      firstFontFamily = fontDeclaration.value
        .split(',')[0]
        ?.trim()
        .replaceAll(/^['"]|['"]$/g, '')
    })
  })
  return firstFontFamily
}

/**
 * The font weights the stylesheet loads from Fontsource, in import order.
 *
 * ```css
 * @import '@fontsource/schibsted-grotesk/400.css'; @import '@fontsource/schibsted-grotesk/700.css'; → [400, 700]
 * ```
 */
const listImportedFontWeights = (stylesheet: Root): number[] => {
  const importedFontWeights: number[] = []
  stylesheet.walkAtRules('import', (importAtRule) => {
    const importedFontWeight = /@fontsource\/[\w-]+\/(\d{3})\.css/.exec(importAtRule.params)?.[1]
    if (importedFontWeight) importedFontWeights.push(Number(importedFontWeight))
  })
  return importedFontWeights
}

describe('tokens.ts', () => {
  it("mirrors the light value of every colour role index.css's theme maps", () => {
    const lightValueByCustomPropertyName = readLightValueByCustomPropertyName(indexCssStylesheet)
    const lightValueByThemeColourRole = Object.fromEntries(
      listThemeColourRoleNames(indexCssStylesheet).map((roleName) => [
        roleName.slice(2),
        lightValueByCustomPropertyName.get(roleName.slice(2)),
      ]),
    )

    expect(lightColourByRole).toEqual(lightValueByThemeColourRole)
  })

  it('mirrors the font family the page renders with', () => {
    expect(fontFamilyByRole.sans).toBe(readFirstFontFamily(indexCssStylesheet, '--font-sans'))
  })

  it('mirrors the font weights the page loads', () => {
    expect(fontWeights).toEqual(listImportedFontWeights(indexCssStylesheet))
  })
})
