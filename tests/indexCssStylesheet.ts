// src/index.css parsed once, with the readers the tests of its theme share: which colour roles `@theme` maps, and
// which `:root` rule sets the dark values.
import postcss, { type AtRule, type Node, type Root, type Rule } from 'postcss'
import stylesheetSource from '../src/index.css?raw'

export const indexCssStylesheet: Root = postcss.parse(stylesheetSource)

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
export const isDarkRootRule = (rootRule: Rule): boolean =>
  isAtRule(rootRule.parent) &&
  rootRule.parent.name === 'media' &&
  /prefers-color-scheme:\s*dark/.test(rootRule.parent.params)

/**
 * The roles Tailwind's colour utilities read: what each `--color-*` in `@theme` points at.
 *
 * ```css
 * @theme inline { --color-brand: var(--brand); --font-sans: …; } → ['--brand']
 * ```
 */
export const listThemeColourRoleNames = (stylesheet: Root): string[] => {
  const roleNames: string[] = []
  stylesheet.walkAtRules('theme', (themeAtRule) => {
    themeAtRule.walkDecls(/^--color-/, (colourDeclaration) => {
      const roleName = /^var\((--[\w-]+)\)$/.exec(colourDeclaration.value)?.[1]
      if (roleName) roleNames.push(roleName)
    })
  })
  return roleNames
}
