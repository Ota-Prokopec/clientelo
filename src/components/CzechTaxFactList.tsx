// Chapter 3 unlocked on the page: the Czech tax rules, read from the same module as the Lead Magnet PDF's Chapter 3.
// The PDF sets them two to a row, which a 375 px screen can't hold with their explanations, so here each is a ruled row
// (design-identity.md#layout): a small grey label over its bold figure, then what it means for the Lead.
import { czechTaxFacts, czechTaxSources } from '@data/czechTaxFacts.ts'
import { DataSourceNote } from './DataSourceNote.tsx'
import { RuledFact } from './RuledFact.tsx'

/**
 * The four tax rules a Czech holder of a Twin needs, with their Data Source.
 *
 * ```tsx
 * <CzechTaxFactList />
 * // Časový test / více než 3 roky / Držíte-li fond déle než 3 roky, … · Malé prodeje / do 100 000 Kč ročně / … ·
 * // Strop osvobození … · Dividendy / akumulační dvojče / … · Zdroj: Zákon o daních z příjmů, § 4 (zatím neověřeno)
 * ```
 */
export const CzechTaxFactList = () => {
  return (
    <div className="grid gap-4">
      <dl className="grid gap-4">
        {czechTaxFacts.map(({ label, figure, explanation }) => (
          <RuledFact key={label} label={label} value={figure} explanation={explanation} />
        ))}
      </dl>
      <DataSourceNote sources={czechTaxSources} />
    </div>
  )
}
