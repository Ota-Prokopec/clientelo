# Ads

The two Ad Variants the [brief](./brief.md) requires. This is step 2 of [plan.md](./plan.md). Each Ad Variant speaks to one persona from [strategy.md](./strategy.md) and opens its own First Screen through `utm_content`. Terms are defined in [GLOSSARY.md](../GLOSSARY.md).

Figures marked **(verify)** are not yet checked against a primary source. Step 4 verifies each one and records its Data Source. No Ad goes live before it does.

## Shared rules

- **Platform.** Meta only: Facebook and Instagram, in feed (4:5) and Stories/Reels (9:16). Google Display is out of scope.
- **One version of the copy per variant**, so the difference between A and B stays readable. Extra versions of Meta's headline field are a later test, not part of this doc.
- **The same CTA button on both variants:** Meta's _Learn More_, which Meta shows in Czech as "Další informace" (confirm the label in Ads Manager). Both variants land on an Interactive Tool, not on a download, and with one button the measured difference comes from the message alone.
- **Formal address (_vykání_)** on both variants and on the page. The audience is reading about their money, and both First Screens use the same voice.
- **Both promise the Lead Magnet** as "tahák" and quote the half of its subtitle ([strategy.md](./strategy.md#lead-magnet)) that their persona cares about.
- **UTM parameters.** `utm_source` is `facebook` or `instagram`, `utm_medium=paid_social` and `utm_campaign=etf-twins`. `utm_content` names the Ad Variant (below). A missing or unknown `utm_content` (organic traffic, a typo) falls back to variant A, which carries the Key Insight.

### Compliance from the start

Step 8 runs the full check against Meta's policies. The copy already follows these rules:

- **No promised returns.** Both variants compare TERs. Variant B's "about a third less" holds for any market return, because it is stated "při stejném vývoji trhu" for a one-off investment and needs no assumed return.
- **Risk note.** Every primary text ends with "Nejde o investiční doporučení. Investování nese riziko ztráty."
- **No assertion of personal attributes.** Meta's policy bans copy that implies it knows a person's financial situation ("Máte peníze v bankovním fondu?"). The copy describes brokers, funds and TERs, never the reader's own holdings.
- **No broker branding in the creative.** The visuals show a generic app, never an XTB, Trading 212 or Revolut logo or screen. Naming the brokers in the copy is a factual statement, and step 8 confirms it's allowed.
- **Special Ad Category.** If Meta files the campaign under _Financial products and services_, age and interest targeting are restricted, and the Audience lines below shrink to Czechia plus broad targeting. Step 8 settles this before launch.

## Ad Variant A (pain)

**Persona:** App Investor. **Ad Promise:** "Your broker won't let you buy VOO? Here's why, and what to buy instead for the same fee."

### Copy

**Primary text:**

> Na YouTube všichni radí VOO. V XTB, Trading 212 ani Revolutu ho ale nekoupíte. Americký emitent k němu nevydává dokument KID, který pravidla EU vyžadují, a tyto aplikace ho proto nenabízejí.
>
> Řešení existuje. Evropské „dvojče“ SPYL sleduje stejný index S&P 500 za stejný poplatek 0,03 % ročně. A nehrozí u něj americká dědická daň.
>
> Najděte dvojče k americkému ETF a stáhněte si tahák: co koupit místo VOO a jak na daně v Česku. Zdarma.
>
> Nejde o investiční doporučení. Investování nese riziko ztráty.

**Headline field (37 characters):** VOO v aplikaci nekoupíte. Dvojče ano.

**CTA button:** Learn More

### Visual brief

The creative shows the refusal, then the Twin. The search for VOO comes up empty, and the Twin appears beside it at the same TER.

- **Look.** The page's identity ([design-identity.md](./specifications/design-identity.md)), so the Ad and the First Screen read as one piece: Schibsted Grotesk Black on white, type in deep teal (`#06322f`). On the card, "VOO" is grey and crossed out by a rounded red bar (`#b23132`), and "SPYL" is set huge in teal (`#00666c`). The overlay text uses the same face. No gradients and no shadows.
- **Feed (4:5).** A phone in a hand, held in portrait. On its screen, a generic, unbranded investment app with "VOO" typed into the search and an empty result ("Nenalezeno"). A card rises out of the phone with **SPYL**, "S&P 500" and "0,03 % ročně", next to a struck-out "VOO · 0,03 %". The only overlay text is "Stejný index. Stejný poplatek."
- **Stories/Reels (9:16).** The same story told top to bottom, or as three frames of about 1.5 s each: (1) "VOO" typed into the search, (2) the empty result, (3) the SPYL card with "Stejný index. Stejný poplatek." Text and key visuals stay inside Meta's safe zone, clear of the profile bar at the top and the caption and CTA at the bottom.

### Audience

- Age 25–40, Czechia, Czech language.
- Interests: exchange-traded fund, index fund, stock market, investing, and the brokers themselves (XTB, Trading 212, Revolut) where Meta offers them as interests.

### `utm_content` and First Screen

`utm_content=pain`. The First Screen opens with VOO preselected in the fund picker and its Twin SPYL shown beside it, at the same TER, under a headline that continues "VOO v aplikaci nekoupíte. Dvojče ano." This is also the fallback First Screen.

### Figures flagged

| Claim in the copy                                       | Data Source it needs                                                                       |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| XTB, Trading 212 and Revolut don't sell VOO **(verify)** | Each broker's own help page (XTB's is cited in [strategy.md](./strategy.md#key-insight))    |
| The block is the missing KID (PRIIPs) **(verify)**       | Regulation (EU) No 1286/2014, Art. 5 and 13                                                 |
| SPYL tracks the S&P 500                                  | SPDR's SPYL fund page                                                                       |
| SPYL's TER is 0.03 %                                     | SPDR's SPYL fund page                                                                       |
| VOO's TER is 0.03 %                                      | Vanguard's VOO fund page                                                                    |
| SPYL carries no US estate tax risk **(verify the IRS guidance)** | IRS guidance on estate tax for non-resident aliens (US-situs assets), and SPYL's Irish domicile |

## Ad Variant B (money)

**Persona:** Bank-Fund Saver. **Ad Promise:** "A bank fund charges around 2 % a year, an ETF 0.03 %. Work out the difference over 20 years."

### Copy

**Primary text:**

> Akciové fondy od bank si strhávají kolem 2 % ročně. ETF na index S&P 500 stojí od 0,03 % ročně.
>
> Rozdíl vypadá malý. Poplatek se ale strhává každý rok z celé částky. Při stejném vývoji trhu tak u jednorázové investice po 20 letech zůstane v bankovním fondu zhruba o třetinu méně peněz než v ETF.
>
> Spočítejte si rozdíl v korunách pro libovolnou částku a stáhněte si tahák: co stojí poplatek bankovního fondu za 20 let a jak na daně v Česku. Zdarma.
>
> Nejde o investiční doporučení. Investování nese riziko ztráty.

**Headline field (33 characters):** 2 % nebo 0,03 % ročně? Spočítejte

**CTA button:** Learn More

### Visual brief

The creative shows what remains after 20 years, not how the money grows. A growth curve would suggest a return, and the comparison doesn't need one.

- **Look.** The page's identity ([design-identity.md](./specifications/design-identity.md)): Schibsted Grotesk Black on white, type in deep teal (`#06322f`). The bank-fund bar and its "2 % ročně" are red (`#b23132`), the ETF bar and its "0,03 % ročně" are teal (`#00666c`), and both bars have 12 px rounded corners. No gradients and no shadows.
- **Feed (4:5).** Two vertical bars side by side, both labelled "po 20 letech". The ETF bar ("0,03 % ročně") is full height and marked 100 %. The bank-fund bar ("2 % ročně") stops at about two thirds, and the missing third is drawn as an empty outline labelled "poplatky". Footnote, small: "Jednorázová investice, stejný vývoj trhu. Ilustrace."
- **Stories/Reels (9:16).** The same two bars, animated: both start equal and the bank-fund bar shrinks year by year to two thirds while a counter runs from "rok 1" to "rok 20". The last frame holds "2 % nebo 0,03 % ročně?" Text stays inside Meta's safe zone.

### Audience

- Age 30–55, Czechia, Czech language.
- Interests: mutual fund, savings, personal finance, retirement planning, and the banks' investment brands (e.g. ČSOB, Česká spořitelna, Komerční banka) where Meta offers them as interests.

### `utm_content` and First Screen

`utm_content=money`. The First Screen opens with the fee calculator prefilled with a one-off amount in a bank fund at a TER of about 2 % against an ETF at 0.03 % over 20 years, showing the difference in Kč, under a headline that continues "2 % nebo 0,03 % ročně?"

### Figures flagged

| Claim in the copy                                                    | Data Source it needs                                                                                      |
| -------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Bank equity funds charge about 2 % a year **(verify)**                | The KIDs of the equity funds of the largest Czech banks, e.g. ČSOB Akciový (TER 2.22 % in [strategy.md](./strategy.md#bank-fund-saver-ad-variant-b-money)) |
| An S&P 500 ETF costs from 0.03 % a year                               | SPDR's SPYL fund page (a fund the Visitor can buy)                                                         |
| About a third less after 20 years at the same market return, for a one-off investment **(verify)** | Derived: ((1 − 0.02) / (1 − 0.0003))^20 ≈ 0.67, from the two TERs above (0.64 at ČSOB Akciový's 2.22 %). Monthly contributions narrow the gap, so the copy says one-off. The page shows the formula next to the calculator |
