// Tests Chapter 3's Czech tax rules, which the Lead Magnet PDF and the content a Lead unlocks both read, so each figure
// reads the same in both, with its Data Source.
import { describe, expect, it } from 'vitest'
import { czechTaxFacts, czechTaxSources } from '@data/czechTaxFacts.ts'
import { czechDividendTaxSource, czechTaxFigures } from '@data/figures.ts'

/** A non-breaking space, which the page's Czech amounts put between digit groups and before the unit. */
const NBSP = '\u00a0'

describe('czechTaxFacts', () => {
  it('lists the four rules in the PDF’s order', () => {
    expect(czechTaxFacts.map((czechTaxFact) => czechTaxFact.label)).toEqual([
      'Časový test',
      'Malé prodeje',
      'Strop časového testu',
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
      figure: `do 100${NBSP}000${NBSP}Kč ročně`,
      explanation: `Když za rok prodáte cenné papíry celkem nejvýš za 100${NBSP}000${NBSP}Kč, příjem je osvobozený i bez časového testu.`,
      source: czechTaxFigures.yearlyIncomeExemption.source,
    })
  })

  it('states that the holding-period test exempts any amount, citing the same provision', () => {
    expect(czechTaxFacts[2]).toEqual({
      label: 'Strop časového testu',
      figure: 'žádný',
      explanation: 'Časový test osvobodí příjem z prodeje v jakékoli výši, i kdyby šlo o desítky milionů korun.',
      source: czechTaxFigures.holdingPeriodExemption.source,
    })
  })

  it('answers dividends with the accumulating Twin, citing the provision that taxes a foreign fund’s dividends', () => {
    expect(czechTaxFacts[3]).toEqual({
      label: 'Dividendy',
      figure: 'akumulační dvojče',
      explanation:
        'Distribuční fond vyplácí dividendy a ty patří každý rok do přiznání. Akumulační dvojče je rovnou investuje, takže dividendy k přiznání nemáte.',
      source: czechDividendTaxSource,
    })
  })
})

describe('czechTaxSources', () => {
  it('cites each provision of the income tax act once, though the holding-period test backs two rules', () => {
    expect(czechTaxSources.map((source) => source.name)).toEqual([
      'Zákon o daních z příjmů, § 4 odst. 1 písm. u)',
      'Zákon o daních z příjmů, § 4 odst. 1 písm. t)',
      'Zákon o daních z příjmů, § 8 odst. 1 písm. a) a odst. 4',
    ])
  })
})
