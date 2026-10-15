# Welcome emails

The three Welcome Emails a new Lead receives as part of Delivery, after the PDF has already downloaded on the page. This is the copy only: step 7 of [plan.md](./plan.md) sets up the sending through `/api/lead` and the email tool. Terms are defined in [GLOSSARY.md](../GLOSSARY.md).

Figures marked **(verify)** are not yet checked against a primary source. Step 4 verifies each one and records its Data Source. No Welcome Email is sent before it does.

## Shared rules

- **Schedule.** Day 0 goes out when the Lead Form is submitted, Day 2 two days later, Day 5 five days later. A Lead who unsubscribes gets nothing more.
- **One topic per email**, so each one answers a question the Lead Magnet raised: Day 0 why the Twin, Day 2 the taxes, Day 5 how to buy it.
- **Formal address (_vykání_)** and the page's voice: the same words as the page and the PDF (dvojče, tahák, časový test), plural "we" for the sender, and no gendered verb forms that would need the Lead's gender.
- **Every figure is the page's figure.** Each one comes from `src/data/figures.ts`, and each email that states a figure ends with a "Zdroj" line naming the same Data Source the page cites. The copy is static, so when step 4 verifies or changes a figure, this file changes in the same commit.
- **Every email ends** with the risk note "Nejde o investiční doporučení. Investování nese riziko ztráty." and a one-click unsubscribe link, which the Lead Form's GDPR line promises.
- **Merge fields**, which step 7 maps to the email tool's own syntax:
  - `{{pdf_url}}`: the absolute URL of `/tahak-evropska-dvojcata-americkych-etf.pdf` on the deployed domain.
  - `{{unsubscribe_url}}`: the email tool's unsubscribe link.
  - `{{segment}}`: the Lead's Segment, which picks the Day 5 email. It is empty when the Lead skipped the Segmentation Question.

## Day 0: the PDF and the Key Insight

Sent at once, so the Lead has the PDF in their inbox even if the download on the page didn't start.

**Subject:** Váš tahák: evropská dvojčata amerických ETF

**Preheader:** Proč vám aplikace VOO neprodá a co koupit místo něj.

**Body:**

> Dobrý den,
>
> tady je slíbený tahák: [Stáhnout tahák (PDF, 2 strany)]({{pdf_url}})
>
> Krátce, proč vám XTB, Trading 212 ani Revolut VOO nenabídnou: pravidla EU (nařízení PRIIPs) dovolují prodat fond drobnému investorovi, jen když k němu existuje dokument KID. Američtí emitenti jako Vanguard ho nevydávají.
>
> O index S&P 500 tím ale nepřicházíte. Evropské dvojče SPYL, fond registrovaný v Irsku, sleduje stejný index za stejný poplatek: SPYL i VOO stojí 0,03 % ročně. A protože sídlí v Evropě, vašim dědicům u něj nehrozí americká dědická daň, která u fondu z USA dopadá na majetek nad 60 000 USD.
>
> V taháku najdete tabulku všech dvojčat s ISIN, burzou a měnou, daně v Česku a co stojí poplatek bankovního fondu za 20 let.
>
> Za dva dny vám pošleme, kdy z prodeje ETF neplatíte žádnou daň.
>
> Zdroje: Nařízení (EU) č. 1286/2014 (PRIIPs), čl. 5 a 13; XTB, centrum nápovědy: ETF z USA bez dokumentu KID; Trading 212, odpověď týmu v komunitě z 2. 8. 2024: ETF z USA bez souladu s PRIIPs; Revolut, centrum nápovědy: jen ETF registrované v EU; Vanguard, stránka fondu VOO; SPDR, stránka fondu SPYL; IRS, pokyny k formuláři 706-NA.
>
> Nejde o investiční doporučení. Investování nese riziko ztráty.
> [Odhlásit se z odběru]({{unsubscribe_url}})

## Day 2: taxes

Chapter 3 of the Lead Magnet, explained one rule at a time.

**Subject:** Kdy z prodeje ETF neplatíte daň

**Preheader:** Časový test, malé prodeje a proč akumulační dvojče ušetří práci s přiznáním.

**Body:**

> Dobrý den,
>
> u dvojčete rozhoduje o dani hlavně to, jak dlouho ho držíte. Čtyři pravidla z taháku:
>
> **Časový test: více než 3 roky.** Když fond držíte déle než 3 roky, příjem z jeho prodeje je od daně osvobozený. Schovávejte si potvrzení o každém nákupu: podle nich při prodeji doložíte, jak dlouho jste fond drželi.
>
> **Malé prodeje: do 100 000 Kč ročně.** Když za rok prodáte cenné papíry celkem nejvýš za 100 000 Kč, příjem je osvobozený i bez časového testu.
>
> **Strop časového testu: žádný.** Časový test osvobodí příjem z prodeje v jakékoli výši, i kdyby šlo o desítky milionů korun.
>
> **Dividendy: akumulační dvojče.** Distribuční fond vyplácí dividendy a ty patří každý rok do přiznání. Akumulační dvojče je rovnou investuje, takže dividendy k přiznání nemáte. Tabulka v taháku proto u každého dvojčete uvádí, zda je akumulační.
>
> Celou kapitolu najdete v taháku: [Stáhnout tahák (PDF)]({{pdf_url}})
>
> Za tři dny vám pošleme, jak dvojče koupit tam, kde investujete.
>
> Zdroj: Zákon o daních z příjmů, § 4 odst. 1 písm. t) a u).
>
> Nejde o investiční doporučení. Investování nese riziko ztráty.
> [Odhlásit se z odběru]({{unsubscribe_url}})

## Day 5: how to buy a Twin where the Lead invests

Chapter 6 of the Lead Magnet, for the Lead's own app. `{{segment}}` picks one of the variants below, and a Lead who skipped the Segmentation Question gets the last one. Each line says how to find the fund, never what a broker offers or charges, which the page has no Data Source for.

Every variant opens with "Dobrý den," and closes with:

> Celou tabulku dvojčat najdete v taháku: [Stáhnout tahák (PDF)]({{pdf_url}})
>
> Zdroj: SPDR, stránka fondu SPYL.
>
> Nejde o investiční doporučení. Investování nese riziko ztráty.
> [Odhlásit se z odběru]({{unsubscribe_url}})

### `xtb`

**Subject:** Jak koupit dvojče v XTB

**Preheader:** Tři kroky, ať koupíte správný fond na správné burze.

> V XTB najdete dvojče podle tickeru, jen si u něj ohlídejte burzu:
>
> 1. Ve vyhledávání zadejte ticker z tabulky v taháku, třeba SPYL.
> 2. Zkontrolujte, že burza a měna odpovídají řádku v tabulce: SPYL se obchoduje na Xetře v eurech. Stejný fond má na jiné burze jiný ticker.
> 3. Než nákup potvrdíte, porovnejte ISIN fondu s tabulkou. U SPYL je to IE000XZSV718.

### `trading-212`

**Subject:** Jak koupit dvojče v Trading 212

**Preheader:** Podle čeho poznáte akumulační třídu.

> V Trading 212 vyhledejte ticker nebo název fondu z tabulky v taháku, třeba SPYL.
>
> Když aplikace najde víc tříd téhož fondu, hledejte v názvu zkratku „Acc“: značí akumulační třídu, která dividendy nevyplácí, takže vám žádné nepřidá do přiznání. Jistotu dává ISIN: u SPYL je to IE000XZSV718.

### `revolut`

**Subject:** Jak koupit dvojče v Revolutu

**Preheader:** Když aplikace najde víc fondů, rozhodne ISIN.

> V Revolutu vyhledejte ticker nebo název fondu z tabulky v taháku, třeba SPYL.
>
> Když aplikace najde víc fondů s podobným názvem, rozhodne ISIN: u SPYL je to IE000XZSV718. Ticker se mezi burzami liší, ISIN ne.

### `fio-patria`

**Subject:** Fio a Patria vám VOO prodají. Proč přesto dvojče

**Preheader:** Stejný index, ale bez americké dědické daně.

> Fio e-Broker i Patria vám VOO prodají: jako obchodníci, kteří jen provádějí vaše pokyny, dokument KID nepotřebují.
>
> Dvojče přesto vychází lépe. U irského fondu vašim dědicům nehrozí americká dědická daň nad 60 000 USD a akumulační třída vám nepřidá dividendy do přiznání.
>
> Ve Fiu i v Patrii hledejte dvojče podle ISIN z tabulky v taháku. U SPYL je to IE000XZSV718.

This variant also cites "ČNB, stanovisko RS2018-12, část B.2" and "IRS, pokyny k formuláři 706-NA" in its "Zdroje" line.

### `robo-advisor`

**Subject:** Robo-advisor, nebo vlastní dvojče?

**Preheader:** Co porovnat, než se rozhodnete.

> Robo-advisor za vás skládá portfolio z ETF: které fondy v něm budou, rozhoduje on, ne vy.
>
> Chcete-li sami držet konkrétní fond, třeba SPYL, potřebujete účet u brokera. V taháku najdete, jak dvojče najít v XTB, Trading 212, Revolutu a Fiu.
>
> Než se rozhodnete, porovnejte celkové roční náklady: poplatek robo-advisora a TER fondů, které drží, proti TER dvojčete. SPYL stojí 0,03 % ročně.

### `bank-fund`

**Subject:** Fond u banky, nebo dvojče?

**Preheader:** Co stojí rozdíl v poplatku a na co myslet před prodejem.

> Akciový fond banky, jako ČSOB Akciový, stojí 2,22 % ročně **(verify)**. Dvojče SPYL 0,03 %. Kolik ten rozdíl dělá v korunách za 20 let, ukazuje kapitola 5 taháku.
>
> Dvojče koupíte přes aplikaci brokera. V taháku najdete, jak ho najít v XTB, Trading 212, Revolutu a Fiu.
>
> Než fond u banky prodáte, zjistěte si jeho výstupní poplatek a myslete na časový test: příjem z prodeje fondu, který držíte kratší dobu než 3 roky, může podléhat dani.

This variant also cites "ČSOB, KID fondu ČSOB Akciový" and "Zákon o daních z příjmů, § 4 odst. 1 písm. u)" in its "Zdroje" line.

### `nowhere-yet`

**Subject:** Jak koupit první dvojče

**Preheader:** Tři kroky od účtu k prvnímu nákupu.

> Dvojče koupíte přes aplikaci brokera. Než si účet založíte, porovnejte poplatek za nákup, za převod korun na eura nebo dolary a za vedení účtu.
>
> 1. Založte si účet u brokera. V taháku najdete, jak dvojče najít v XTB, Trading 212, Revolutu a Fiu.
> 2. Pošlete na účet peníze z banky.
> 3. Vyhledejte dvojče podle ISIN z tabulky v taháku. U SPYL je to IE000XZSV718.

### No Segment

**Subject:** Jak koupit dvojče ve vaší aplikaci

**Preheader:** XTB, Trading 212, Revolut i Fio, každá na jeden řádek.

> Jak dvojče najít v XTB, Trading 212, Revolutu a Fiu:
>
> - **XTB:** vyhledejte ticker z tabulky v taháku a zkontrolujte, že burza a měna odpovídají řádku v tabulce.
> - **Trading 212:** vyhledejte ticker nebo název fondu. Zkratka „Acc“ v názvu značí akumulační třídu.
> - **Revolut:** vyhledejte ticker nebo název fondu. Když aplikace najde víc fondů, rozhodne ISIN.
> - **Fio e-Broker:** hledejte podle ISIN dvojčete. Fio vám prodá i VOO, dvojče vás ale ušetří americké dědické daně.

Like `fio-patria`, this variant also cites "ČNB, stanovisko RS2018-12, část B.2" and "IRS, pokyny k formuláři 706-NA" in its "Zdroje" line.
