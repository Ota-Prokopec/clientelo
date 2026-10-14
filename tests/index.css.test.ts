// Tests that src/index.css gives every colour role a light and a dark value (design-identity.md#colour).
import type { Container, Root } from 'postcss'
import { describe, expect, it } from 'vitest'
import { indexCssStylesheet, isDarkRootRule, listThemeColourRoleNames } from './indexCssStylesheet.ts'

/** A colour mode the page follows from `prefers-color-scheme`. */
type ColourMode = 'light' | 'dark'

/**
 * The custom properties a container declares directly.
 *
 * ```css
 * :root { --brand: #00666c; --heading: #06322f; } → ['--brand', '--heading']
 * ```
 */
const listCustomPropertyNames = (container: Container): string[] => {
  return (container.nodes ?? []).flatMap((childNode) =>
    childNode.type === 'decl' && childNode.prop.startsWith('--') ? [childNode.prop] : [],
  )
}

/**
 * The custom properties the stylesheet's `:root` rules declare for one colour mode, colour roles and `--radius` alike.
 *
 * ```css
 * :root { --brand: #00666c; }                                          → light: ['--brand']
 * :root, [data-palette='light'] { --brand: #00666c; }                  → light: ['--brand']
 * @media (prefers-color-scheme: dark) { :root { --brand: #7fd0c9; } } → dark: ['--brand']
 * ```
 */
const listCustomPropertyNamesForMode = (stylesheet: Root, colourMode: ColourMode): string[] => {
  const customPropertyNames: string[] = []
  stylesheet.walkRules((rule) => {
    if (!rule.selectors.includes(':root')) return
    if (isDarkRootRule(rule) === (colourMode === 'dark')) customPropertyNames.push(...listCustomPropertyNames(rule))
  })
  return customPropertyNames
}

describe('index.css colour roles', () => {
  const themeColourRoleNames = listThemeColourRoleNames(indexCssStylesheet)

  it("maps design-identity.md's roles beyond shadcn's", () => {
    expect(themeColourRoleNames).toEqual(
      expect.arrayContaining(['--heading', '--brand', '--signal', '--block', '--block-foreground', '--primary-hover']),
    )
  })

  it.each<ColourMode>(['light', 'dark'])('gives every role the theme maps a %s value', (colourMode) => {
    const customPropertyNamesForMode = listCustomPropertyNamesForMode(indexCssStylesheet, colourMode)
    expect(themeColourRoleNames.filter((roleName) => !customPropertyNamesForMode.includes(roleName))).toEqual([])
  })
})
