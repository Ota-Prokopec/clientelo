// Chapter 3's Czech tax rules: the holding-period test, the 100 000 Kč yearly exemption, the test's lack of a cap, and
// dividends against an accumulating Twin. The Lead Magnet PDF and the content a Lead unlocks on the page both read them
// from here, so the two can't word a figure differently (ADR-0002).
import { formatAmount, formatYears } from '@lib/format.ts'
import { czechTaxFigures, listDistinctDataSources, type DataSource } from './figures.ts'

/** One tax rule a Czech holder of a Twin needs: what it is, its figure, and what it means for the Lead. */
export type CzechTaxFact = {
  label: string
  /** The figure as Czech copy, or the short answer for a rule with no figure: the Twin, or the cap the test lacks. */
  figure: string
  explanation: string
  /** The Data Source of the provision the rule states, or null for a rule with no provision to cite. */
  source: DataSource | null
}

const { holdingPeriodExemption, yearlyIncomeExemption } = czechTaxFigures
const holdingPeriod = formatYears(holdingPeriodExemption.value)
const yearlyIncome = formatAmount(yearlyIncomeExemption.value, yearlyIncomeExemption.unit)

/** The four rules, in the order Chapter 3 lists them. */
export const czechTaxFacts: CzechTaxFact[] = [
  {
    label: 'Časový test',
    figure: `více než ${holdingPeriod}`,
    explanation: `Držíte-li fond déle než ${holdingPeriod}, příjem z jeho prodeje je od daně osvobozený.`,
    source: holdingPeriodExemption.source,
  },
  {
    label: 'Malé prodeje',
    figure: `do ${yearlyIncome} ročně`,
    explanation: `Když za rok prodáte cenné papíry celkem nejvýš za ${yearlyIncome}, příjem je osvobozený i bez časového testu.`,
    source: yearlyIncomeExemption.source,
  },
  {
    label: 'Strop časového testu',
    figure: 'žádný',
    explanation: 'Časový test osvobodí příjem z prodeje v jakékoli výši, i kdyby šlo o desítky milionů korun.',
    source: holdingPeriodExemption.source,
  },
  {
    label: 'Dividendy',
    figure: 'akumulační dvojče',
    explanation:
      'Distribuční fond vyplácí dividendy a ty patří každý rok do přiznání. Akumulační dvojče je rovnou investuje, takže dividendy k přiznání nemáte.',
    source: null,
  },
]

/** The Data Sources of the rules' figures, each once, for the Data Source note under Chapter 3. */
export const czechTaxSources: DataSource[] = listDistinctDataSources(
  czechTaxFacts.flatMap((czechTaxFact) => czechTaxFact.source ?? []),
)
