# Strategy

Who the page is for, what it tells them that they don't know, what it trades for their contact and when it asks. This is step 1 of [plan.md](./plan.md); every later step (Ads, page, data, Funnel) builds on it. Terms are defined in [GLOSSARY.md](../GLOSSARY.md).

Figures marked **(verify)** are not yet checked against a primary source. Step 4 verifies each one and records its Data Source before it reaches the page or the Lead Magnet.

## Target group

Two personas, one per Ad Variant. Each Ad Variant speaks to one persona, and its First Screen continues that persona's story.

### App Investor (Ad Variant A, "pain")

- 25–40 years old, invests small monthly amounts through a mobile app: **XTB, Trading 212 or Revolut**.
- Learned about index investing from YouTube or Reddit, where VOO, SPY or VT is the default answer.
- Tried to buy one of them and got refused, or saw that the app doesn't list it. Doesn't know why, and suspects they're missing out.
- Wants: the fund they can actually buy that does the same thing, at the same fee, without getting the taxes wrong.

Fio e-Broker and Patria clients are deliberately left out: those brokers sell US ETFs to retail clients, so these investors never meet the refusal Ad A is built on.

### Bank-Fund Saver (Ad Variant B, "money")

- Holds savings in an equity fund sold by their bank, such as ČSOB Akciový (TER 2.59 %), or in a robo-advisor such as Portu.
- Has heard of ETFs but has never picked one, and doesn't know a Ticker like VOO.
- Wants: to see in Kč what the fee difference costs over 20 years, and a simple, safe next step.

## Key Insight

> The investment apps Czechs use most (XTB, Trading 212, Revolut) won't sell retail clients a US ETF, because its issuer doesn't publish the KID that EU rules (PRIIPs) require. Each one has a European Twin: a UCITS ETF tracking the same index, often for the same fee (SPYL vs. VOO: 0.03 % each). The Twin is also simpler for a Czech investor: there is no US estate tax, and an accumulating Twin leaves no dividends to report. The brokers list these funds without explaining any of this.

What backs it (researched 2026-10-11):

- **The block.** PRIIPs ([Regulation (EU) No 1286/2014](https://eur-lex.europa.eu/legal-content/CS/TXT/HTML/?uri=CELEX:32014R1286)) Art. 5 and 13 require a KID before a PRIIP is sold to a retail investor; US issuers don't publish one. XTB states it directly: "We are unable to offer ETFs from the United States (due to the lack of KIDs documentation)" ([XTB help centre](https://www.xtb.com/int/help-center/stocks-and-etfs/adding-a-new-instrument-to-the-offer)). Trading 212's team said on 2 August 2024 that it "can't offer US ETFs that are not PRIIPS compliant/UCITS certified" ([Trading 212 community](https://community.trading212.com/t/view-only-instrument/73602/7)); its help centre doesn't cover it. Revolut offers Czech clients only "non-complex ETFs that are registered in the European Union" ([Revolut help centre](https://help.revolut.com/en-CZ/help/wealth/stocks/getting-started-with-etf-s/which-types-of-etf-are-available-in-the-revolut-app/)).
- **The exception.** ČNB's Q&A [RS2018-12](https://www.cnb.cz/cs/dohled-financni-trh/legislativni-zakladna/stanoviska-k-regulaci-financniho-trhu/RS2018-12/) (section B.2) says an execution-only broker is not bound by the KID duty, so Fio e-Broker ([fio.cz](https://www.fio.cz/akcie-investice/etf)) and Patria sell US ETFs to retail clients. The page and the Lead Magnet say so openly (see below).
- **No change in sight.** The EU Retail Investment Strategy agreed in December 2025 changes the KID's format, not the requirement, and does not yet apply.
- **Why "the brokers don't explain it", not "nobody does".** Czech education sites (finex.cz, finzi.cz, warengo.com) already explain the switch from VOO to CSPX. The brokers the App Investor uses list the Twins without the reason: XTB's Czech ETF guide shows CSPX with no mention of PRIIPs or the KID. The page's edge is putting the refused fund and its Twin side by side, in the app the Visitor already uses.
- **Not an argument.** US dividend withholding is not a reason to prefer the Twin: a Czech holder of VOO with a W-8BEN on file pays 15 %, the same rate an Irish fund pays. The page doesn't use it.

### Twins

A Twin tracks the **same index** as the US ETF. Where no UCITS ETF tracks the same index, the page shows the closest alternative and labels it as such. It never presents it as a Twin.

| US ETF        | Index               | Twins (accumulating first)                        |
| ------------- | ------------------- | ------------------------------------------------- |
| VOO, IVV, SPY | S&P 500             | SPYL, CSPX, VUAA                                  |
| VT            | FTSE Global All Cap | closest alternatives: VWCE, FWRA (FTSE All-World) |

Where a Twin has both an accumulating and a distributing share class, the accumulating one leads: it pays no dividends, so there is no dividend income for the Czech tax return.

The page doesn't offer VTI (researched 2026-10-14). Neither [XTB's](https://www.xtb.com/cz/specifikace-instrumentu) nor [Trading 212's](https://www.trading212.com/trading-instruments/invest) public instrument list carries a UCITS ETF on its index, the Morningstar US Total Market, so it has no Twin. Its closest alternative would be the accumulating UCITS ETF on the broadest US index that XTB, Trading 212 and Revolut all list, and no candidate can be shown to meet that rule:

- The broadest index, the Russell 3000, covers about 98 % of the US market ([LSEG](https://www.lseg.com/en/ftse-russell/indices/russell-3000-index)). Its one UCITS ETF, from SPDR, is on neither app's list.
- The MSCI USA funds come next, at about 85 % ([MSCI](https://www.msci.com/indexes/index/984000)). Both lists carry them, but Revolut can't be checked.
- Revolut publishes no list of the ETFs it offers. Its [help centre](https://help.revolut.com/en-CZ/help/wealth/stocks/getting-started-with-etf-s/etfs-investment-plans/) points to the search in the app, which can't be cited.

An ETF with no Substitute would leave the Visitor without an answer, so VTI is left out rather than shown empty.

## Lead Magnet

One PDF for both personas, so a difference in Conversion Rate between Ad Variants can be read as the Ad's effect.

- **Title:** *Tahák: evropská dvojčata amerických ETF*, subtitled *Co koupit místo VOO, co stojí poplatek bankovního fondu za 20 let a jak na daně v Česku*. The subtitle carries both Ad Promises ([ads.md](./ads.md)): each Ad Variant quotes the half its persona cares about.
- **Promise:** which European fund to buy instead of the US ETF you can't buy, what a bank fund's TER costs over 20 years compared with an ETF's, and how to avoid the tax mistakes, on two pages.
- **Length:** two pages. If it runs over, Chapter 6 is cut first, because it goes stale fastest.

Outline:

1. **Why your broker won't sell you VOO.** PRIIPs and the KID in three sentences, plus the Fio and Patria exception: they will sell US ETFs, but the Twin still wins on estate tax and a simpler tax return.
2. **The Twin table.** ISIN, TER, domicile, distribution policy, and exchange and currency for each Twin. Accumulating share classes first.
3. **Taxes in the Czech Republic.** The 3-year holding-period exemption, the 100 000 Kč yearly exemption, the absence of any cap on what the 3-year test exempts, and dividends vs. accumulating funds.
4. **Why a US-domiciled fund is riskier for a Czech investor.** US estate tax on US-situs assets above $60 000. Stock of a non-US corporation, such as an Irish Twin, isn't one.
5. **Bank fund vs. ETF over 20 years.** What a TER of about 2 % costs compared with 0.03 %, in Kč. This Chapter is the Bank-Fund Saver's reason to download.
6. **How to buy a Twin.** One line each for XTB, Trading 212, Revolut and Fio.

The content is written once step 4 has verified the data, and the file is built with Delivery in step 3.

## Lead Ask

There is one Lead Form. Every Lead Ask leads to it.

- **Inline, after each Interactive Tool's result.** This is the primary Lead Ask: the Visitor has just seen their Twin or their fee difference and is most engaged. It offers the rest of that answer, meaning the full table, taxes and estate tax, in the Lead Magnet.
- **A closing Section** with the Lead Form, for Visitors who scroll past the tools.
- **The sticky CTA on mobile**, which scrolls to the Lead Form from anywhere on the page.

The Lead Magnet's preview and its contents list are visible before any Lead Ask, so its value is obvious before the Visitor types.
