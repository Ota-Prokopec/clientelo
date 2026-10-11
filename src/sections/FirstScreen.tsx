// The First Screen: the Ad Variant's Ad Promise and its Interactive Tool, deliverable without scrolling at 375 px.
// The tool slots (`fund-picker`, `fee-calculator`) show the static comparison until #11 and #12 make them interactive.
import type { AdVariant } from '../adVariant.ts'
import { DataSourceNote } from '../components/DataSourceNote.tsx'
import { csobAkciovy, findEtf, findUcitsEtf, typicalBankEquityFundTer } from '../data/figures.ts'
import { formatPercent } from '../format.ts'
import styles from './FirstScreen.module.css'

export type FirstScreenArgs = { adVariant: AdVariant }

/**
 * The First Screen the Ad Variant opens: `pain` shows VOO and its Twin, `money` a bank fund's TER against a Twin's.
 *
 * ```tsx
 * <FirstScreen adVariant="pain" />  // VOO = SPYL, in the `fund-picker` slot
 * <FirstScreen adVariant="money" /> // 2,22 % vs 0,03 %, in the `fee-calculator` slot
 * ```
 */
export function FirstScreen({ adVariant }: FirstScreenArgs) {
  return (
    <section id="first-screen" className={styles.firstScreen} data-ad-variant={adVariant}>
      {adVariant === 'money' ? <MoneyFirstScreen /> : <PainFirstScreen />}
    </section>
  )
}

/**
 * Ad Variant A: the ETF the Visitor's app won't sell, struck out, equal to its Twin.
 *
 * ```tsx
 * <PainFirstScreen /> // <div id="fund-picker">VOO = SPYL</div>
 * ```
 */
function PainFirstScreen() {
  const voo = findEtf('VOO')
  const spyl = findUcitsEtf('SPYL')

  return (
    <div id="fund-picker">
      <div className={styles.top}>
        <h1 className={styles.headline}>VOO v aplikaci nekoupíte. Dvojče ano.</h1>
        <p className={`${styles.giant} ${styles.struck}`}>{voo.ticker}</p>
        <p className={styles.meta}>
          {voo.trackedIndex} · {formatPercent(voo.terPercent)} ročně · v XTB, Trading 212 ani Revolutu ne
        </p>
      </div>
      <div className={styles.badge} aria-hidden="true">
        =
      </div>
      <div className={styles.bottom}>
        <p className={styles.giant}>{spyl.ticker}</p>
        <ul className={styles.chips}>
          <li>{spyl.trackedIndex}</li>
          <li>{formatPercent(spyl.terPercent)} ročně</li>
          <li>bez americké dědické daně</li>
        </ul>
        <DataSourceNote sources={[voo.source, spyl.source]} />
      </div>
    </div>
  )
}

/**
 * Ad Variant B: the bank fund's TER against a Twin's, ahead of the Fee Calculator.
 *
 * ```tsx
 * <MoneyFirstScreen /> // <div id="fee-calculator">2,22 % vs 0,03 %</div>
 * ```
 */
function MoneyFirstScreen() {
  const spyl = findUcitsEtf('SPYL')

  return (
    <div id="fee-calculator">
      <div className={styles.top}>
        <h1 className={styles.headline}>
          {formatPercent(typicalBankEquityFundTer.value)} nebo {formatPercent(spyl.terPercent)} ročně? Spočítejte si rozdíl za 20 let.
        </h1>
        <p className={styles.giant}>{formatPercent(csobAkciovy.terPercent)}</p>
        <p className={styles.meta}>{csobAkciovy.name}, akciový fond banky</p>
      </div>
      <div className={styles.badge} aria-hidden="true">
        vs
      </div>
      <div className={styles.bottom}>
        <p className={styles.giant}>{formatPercent(spyl.terPercent)}</p>
        <ul className={styles.chips}>
          <li>{spyl.ticker}</li>
          <li>ETF na {spyl.trackedIndex}</li>
        </ul>
        <DataSourceNote sources={[typicalBankEquityFundTer.source, csobAkciovy.source, spyl.source]} />
      </div>
    </div>
  )
}
