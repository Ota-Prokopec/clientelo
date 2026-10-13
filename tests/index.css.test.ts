// Tests that src/index.css gives every colour role a light and a dark value (design-identity.md#colour).
import postcss, { type AtRule, type Container, type Node, type Root, type Rule } from 'postcss'
import { describe, expect, it } from 'vitest'
import stylesheetSource from '../src/index.css?raw'

const stylesheet = postcss.parse(stylesheetSource)

/** A colour mode the page follows from `prefers-color-scheme`. */
type ColourMode = 'light' | 'dark'

/**
 * Whether a stylesheet node is an at-rule, such as `@media` or `@theme`.
 *
 * ```ts
 * isAtRule(postcss.parse('@media print {}').first) // true
 * isAtRule(postcss.parse(':root {}').first)        // false
 * ```
 */
const isAtRule = (stylesheetNode: Node | undefined): stylesheetNode is AtRule => stylesheetNode?.type === 'atrule'

/**
 * Whether a `:root` rule sets the dark values: it sits in a `prefers-color-scheme: dark` media query.
 *
 * ```css
 * :root { … }                                          → false
 * @media (prefers-color-scheme: dark) { :root { … } } → true
 * ```
 */
const isDarkRootRule = (rootRule: Rule): boolean =>
  isAtRule(rootRule.parent) && rootRule.parent.name === 'media' && /prefers-color-scheme:\s*dark/.test(rootRule.parent.params)

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

/**
 * The roles Tailwind's colour utilities read: what each `--color-*` in `@theme` points at.
 *
 * ```css
 * @theme inline { --color-brand: var(--brand); --font-sans: …; } → ['--brand']
 * ```
 */
const listThemeColourRoleNames = (stylesheet: Root): string[] => {
  const roleNames: string[] = []
  stylesheet.walkAtRules('theme', (themeAtRule) => {
    themeAtRule.walkDecls(/^--color-/, (colourDeclaration) => {
      const roleName = /^var\((--[\w-]+)\)$/.exec(colourDeclaration.value)?.[1]
      if (roleName) roleNames.push(roleName)
    })
  })
  return roleNames
}

describe('index.css colour roles', () => {
  const themeColourRoleNames = listThemeColourRoleNames(stylesheet)

  it("maps design-identity.md's roles beyond shadcn's", () => {
    expect(themeColourRoleNames).toEqual(
      expect.arrayContaining(['--heading', '--brand', '--signal', '--block', '--block-foreground', '--primary-hover']),
    )
  })

  it.each<ColourMode>(['light', 'dark'])('gives every role the theme maps a %s value', (colourMode) => {
    const customPropertyNamesForMode = listCustomPropertyNamesForMode(stylesheet, colourMode)
    expect(themeColourRoleNames.filter((roleName) => !customPropertyNamesForMode.includes(roleName))).toEqual([])
  })
})
