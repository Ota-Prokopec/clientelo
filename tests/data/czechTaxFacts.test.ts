// Tests Chapter 3's Czech tax rules, which the Lead Magnet PDF and the content a Lead unlocks both read, so each figure
// reads the same in both, with its Data Source.
import { describe, expect, it } from 'vitest'
import { czechTaxFacts, czechTaxSources } from '../../src/data/czechTaxFacts.ts'
import { czechTaxFigures } from '../../src/data/figures.ts'

/** A non-breaking space, which the page's Czech amounts put between digit groups and before the unit. */
const nbsp = '\u00a0'

describe('czechTaxFacts', () => {
  it('lists the four rules in the PDF’s order', () => {
    expect(czechTaxFacts.map((czechTaxFact) => czechTaxFact.label)).toEqual([
      'Časový test',
      'Malé prodeje',
      'Strop osvobození',
      'Dividendy',
    ])
  })

  it('states the holding-period test in years, citing the income tax act', () => {
    expect(czechTaxFacts[0]).toEqual({
      label: 'Časový test',
      figure: 'více než 3 roky',
      explanation: 'Držíte-li fond déle než 3 roky, příjem z jeho prodeje je od daně osvobozený.',
      source: czechTaxFigures.holdingPeriodExemption.source,
    })
  })

  it('states the yearly exemption for small sales in Kč', () => {
    expect(czechTaxFacts[1]).toEqual({
      label: 'Malé prodeje',
      figure: `do 100${nbsp}000${nbsp}Kč ročně`,
      explanation: `Když za rok prodáte cenné papíry celkem nejvýš za 100${nbsp}000${nbsp}Kč, příjem je osvobozený i bez časového testu.`,
      source: czechTaxFigures.yearlyIncomeExemption.source,
    })
  })

  it('states the cap on income the holding-period test exempts', () => {
    expect(czechTaxFacts[2]).toEqual({
      label: 'Strop osvobození',
      figure: `40${nbsp}000${nbsp}000${nbsp}Kč ročně`,
      explanation: `Časový test osvobodí příjem z prodeje nejvýš 40${nbsp}000${nbsp}000${nbsp}Kč za rok. Co je nad tuto hranici, zdaníte.`,
      source: czechTaxFigures.exemptIncomeCap.source,
    })
  })

  it('answers dividends with the accumulating Twin, a rule with no figure to cite', () => {
    expect(czechTaxFacts[3]).toEqual({
      label: 'Dividendy',
      figure: 'akumulační dvojče',
      explanation:
        'Distribuční fond vyplácí dividendy a ty patří každý rok do přiznání. Akumulační dvojče je rovnou investuje, takže dividendy k přiznání nemáte.',
      source: null,
    })
  })
})

describe('czechTaxSources', () => {
  it('cites the income tax act once, though three of the rules come from it', () => {
    expect(czechTaxSources.map((source) => source.name)).toEqual(['Zákon o daních z příjmů, § 4'])
  })
})
