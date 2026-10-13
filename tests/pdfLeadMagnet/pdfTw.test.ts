// Tests the Lead Magnet PDF's `pdfTw`: the page's Tailwind class names resolve to react-pdf styles in the light palette,
// and a class it can't resolve fails the build instead of being dropped.
import { describe, expect, it } from 'vitest'
import { pdfTw } from '../../src/pdfLeadMagnet/pdfTw.ts'

describe('pdfTw', () => {
  it('resolves a colour role to its light value', () => {
    expect(pdfTw('text-brand')).toEqual({ color: '#00666c' })
  })

  it('resolves a hyphenated colour role to its own value, not its prefix', () => {
    expect(pdfTw('text-block-foreground bg-block')).toEqual({ color: '#ffffff', backgroundColor: '#06322f' })
    expect(pdfTw('text-muted-foreground')).toEqual({ color: '#5c6f6e' })
  })

  it('resolves a colour role on one side of a border', () => {
    expect(pdfTw('border-t-2 border-t-heading')).toEqual({ borderTopWidth: 2, borderTopColor: '#06322f' })
  })

  it('sets a type role with its weight, and its tracking relative to its own size', () => {
    const titleStyle = pdfTw('text-title')

    expect(titleStyle.fontWeight).toBe(900)
    expect(Number(titleStyle.letterSpacing) / Number(titleStyle.fontSize)).toBeCloseTo(-0.045)
  })

  it('throws on a class it cannot resolve', () => {
    expect(() => pdfTw('text-brand text-brnd')).toThrow('text-brnd')
  })

  it("throws on a font-family class, which can't carry the Czech glyphs' fallback", () => {
    expect(() => pdfTw('font-sans')).toThrow('font-sans')
  })
})
