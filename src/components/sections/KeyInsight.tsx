// The Key Insight Section (docs/strategy.md#key-insight): why the Visitor's app won't sell them VOO, and why its Twin is no worse.
import { AD_PROMISE_ETF_TICKER, AD_PROMISE_TWIN_TICKER } from '@data/adPromise.ts'
import { DataSourceNote } from '@/components/DataSourceNote.tsx'
import {
  czechDividendTaxSource,
  findEtf,
  findUcitsEtf,
  keyInsightSources,
  usEstateTaxThreshold,
} from '@data/figures.ts'
import { formatAmount, formatPercent } from '@lib/format.ts'
import { Section } from './Section.tsx'

/**
 * Explains the PRIIPs block, the Twin, and what the Twin saves a Czech investor.
 *
 * ```tsx
 * <KeyInsight /> // <section id="key-insight">02 Pravidla EU …</section>
 * ```
 */
export const KeyInsight = () => {
  const adPromiseEtf = findEtf(AD_PROMISE_ETF_TICKER)
  const spy = findEtf('SPY')
  const adPromiseTwin = findUcitsEtf(AD_PROMISE_TWIN_TICKER)

  return (
    <Section id="key-insight" number="02" label="Pravidla EU">
      <h2 className="text-title text-heading">Proč vám aplikace VOO neprodá?</h2>
      <p>
        Pravidla EU (nařízení PRIIPs) dovolují prodat fond drobnému investorovi, jen když k němu existuje dokument KID.
        Američtí emitenti jako Vanguard ho nevydávají. XTB, Trading 212 ani Revolut vám proto {adPromiseEtf.ticker} ani{' '}
        {spy.ticker} nenabízejí.
      </p>
      <p>
        K oběma ale existuje evropské dvojče: fond registrovaný v Irsku, který sleduje stejný index. Často za stejný
        poplatek: {adPromiseTwin.ticker} i {adPromiseEtf.ticker} stojí {formatPercent(adPromiseTwin.terPercent)} ročně.
        Vaše aplikace ho nabízí, jen vám neřekne proč.
      </p>
      <ul className="grid gap-4">
        <li className="border-t-2 border-heading pt-1.5">
          <strong className="text-heading">Stejný index.</strong> S&amp;P 500 jsou pořád tytéž americké firmy, ať fond
          sídlí v USA, nebo v Irsku.
        </li>
        <li className="border-t-2 border-heading pt-1.5">
          <strong className="text-heading">Žádná americká dědická daň.</strong> U fondu z USA by vašim dědicům hrozila
          americká daň z majetku nad {formatAmount(usEstateTaxThreshold.value, usEstateTaxThreshold.unit)}.
        </li>
        <li className="border-t-2 border-heading pt-1.5">
          <strong className="text-heading">Jednodušší přiznání.</strong> Akumulační dvojče dividendy nevyplácí, ale
          rovnou je investuje. Nemáte tak žádné dividendy k přiznání.
        </li>
      </ul>
      <p className="text-muted-foreground">
        U Fio e-Brokeru americká ETF koupíte: když jen provede váš pokyn, povinnost KID se na něj podle ČNB nevztahuje.
        I tam ale dvojče vychází lépe kvůli dědické dani a daním.
      </p>
      <DataSourceNote
        sources={[
          keyInsightSources.priips,
          keyInsightSources.xtbHelpCentre,
          keyInsightSources.trading212Community,
          keyInsightSources.revolutHelpCentre,
          adPromiseEtf.source,
          spy.source,
          adPromiseTwin.source,
          usEstateTaxThreshold.source,
          czechDividendTaxSource,
          keyInsightSources.cnbExecutionOnly,
          keyInsightSources.fioEtfPage,
        ]}
      />
    </Section>
  )
}
