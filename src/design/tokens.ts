// The design identity's light palette and font (docs/specifications/design-identity.md), mirrored from src/index.css
// for the Lead Magnet PDF: react-pdf-tailwind's createTw() takes its theme as a JS object and can't read `@theme`
// (ADR-0003). The PDF is light-only, so only the light values are here. tests/design/tokens.test.ts fails when this
// file and src/index.css drift apart, so change a mirrored token in both in the same commit.

/** Every colour role's light value, keyed by its name in src/index.css without the `--`. */
export const lightColourByRole = {
  background: '#ffffff',
  foreground: '#13302e',
  card: '#ffffff',
  'card-foreground': '#13302e',
  popover: '#ffffff',
  'popover-foreground': '#13302e',
  primary: '#b23132',
  'primary-foreground': '#ffffff',
  secondary: '#eef5f5',
  'secondary-foreground': '#06322f',
  muted: '#eef5f5',
  'muted-foreground': '#5c6f6e',
  accent: '#e2eeee',
  'accent-foreground': '#06322f',
  destructive: '#8f2728',
  border: '#dce8e7',
  input: '#dce8e7',
  ring: '#00666c',
  'primary-hover': '#8f2728',
  heading: '#06322f',
  brand: '#00666c',
  signal: '#b23132',
  block: '#06322f',
  'block-foreground': '#ffffff',
}

/** A colour role, by its name in src/index.css without the `--`. */
export type ColourRole = keyof typeof lightColourByRole

/** The page's one family, `--font-sans`, under the name the PDF registers its files as. */
export const fontFamilyByRole = { sans: 'Schibsted Grotesk' }

/** The static weights src/index.css loads from Fontsource, which the PDF embeds too. */
export const fontWeights = [400, 700, 900]
