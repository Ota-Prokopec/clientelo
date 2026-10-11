// The Key Insight Section (docs/strategy.md#key-insight): why the Visitor's app won't sell them VOO, and why its Twin is no worse.
import { DataSourceNote } from '../components/DataSourceNote.tsx'
import { findEtf, findUcitsEtf, usEstateTaxThreshold } from '../data/figures.ts'
import { formatAmount, formatPercent } from '../format.ts'
import styles from './Section.module.css'

/**
 * Explains the PRIIPs block, the Twin, and what the Twin saves a Czech investor.
 *
 * ```tsx
 * <KeyInsight /> // <section id="key-insight">…</section>
 * ```
 */
export function KeyInsight() {
  const voo = findEtf('VOO')
  const spyl = findUcitsEtf('SPYL')

  return (
    <section id="key-insight" className={styles.section}>
      <h2 className={styles.heading}>Proč vám aplikace VOO neprodá?</h2>
      <p>
        Pravidla EU (nařízení PRIIPs) dovolují prodat fond drobnému investorovi, jen když k němu existuje dokument KID.
        Američtí emitenti jako Vanguard ho nevydávají. XTB, Trading 212 ani Revolut vám proto VOO ani SPY
        nenabízejí.
      </p>
      <p>
        K oběma ale existuje evropské dvojče: fond registrovaný v Irsku, který sleduje stejný index. Často za
        stejný poplatek: {spyl.ticker} i {voo.ticker} stojí {formatPercent(spyl.terPercent)} ročně. Vaše aplikace ho
        nabízí, jen vám neřekne proč.
      </p>
      <ul className={styles.points}>
        <li>
          <strong>Stejný index.</strong> S&amp;P 500 jsou pořád tytéž americké firmy, ať fond sídlí v USA, nebo
          v Irsku.
        </li>
        <li>
          <strong>Žádná americká dědická daň.</strong> U fondu z USA by vašim dědicům hrozila americká daň z majetku
          nad {formatAmount(usEstateTaxThreshold.value, usEstateTaxThreshold.unit)}.
        </li>
        <li>
          <strong>Jednodušší přiznání.</strong> Akumulační dvojče dividendy nevyplácí, ale rovnou je investuje. Nemáte
          tak žádné dividendy k přiznání.
        </li>
      </ul>
      <p className={styles.aside}>
        Fio e-Broker a Patria americká ETF prodávají. I u nich ale dvojče vychází lépe kvůli dědické dani a daním.
      </p>
      <DataSourceNote sources={[voo.source, spyl.source, usEstateTaxThreshold.source]} />
    </section>
  )
}
