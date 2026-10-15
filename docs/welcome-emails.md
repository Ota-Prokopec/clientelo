# Welcome emails

The three Welcome Emails a new Lead receives as part of Delivery, after the PDF has already downloaded on the page. This is the copy only: the page is frontend only, and `submitLead()` is a final stub that sends nothing, so nothing on the page sends these emails ([plan.md](./plan.md#7-deployment)). Terms are defined in [GLOSSARY.md](../GLOSSARY.md).

Figures marked **(verify)** are not yet checked against a primary source. Step 4 verifies each one and records its Data Source. No Welcome Email is sent before it does.

## Shared rules

- **Schedule.** Day 0 goes out when the Lead Form is submitted, Day 2 two days later, Day 5 five days later. A Lead who unsubscribes gets nothing more.
- **Day 2 and Day 5 need the Welcome Emails Consent.** Day 0 carries the PDF the Lead asked for, so every new Lead gets it. Day 2 and Day 5 are commercial communications (§ 7 odst. 2 zákona č. 480/2004 Sb.), so only a Lead who ticked the Welcome Emails Consent in the Lead Form gets them. The Segmentation Question, which only picks the Day 5 email, is asked only of them.
- **One topic per email**, so each one answers a question the Lead Magnet raised: Day 0 why the Twin, Day 2 the taxes, Day 5 how to buy it.
- **Formal address (_vykání_)** and the page's voice: the same words as the page and the PDF (dvojče, tahák, časový test), plural "we" for the sender, and no gendered verb forms that would need the Lead's gender.
- **Every figure is the page's figure.** Each one comes from `src/data/figures.ts`, and each email that states a figure ends with a "Zdroj" line naming the same Data Source the page cites. The copy is static, so when step 4 verifies or changes a figure, this file changes in the same commit.
- **Every email ends** with the risk note "Nejde o investiční doporučení. Investování nese riziko ztráty." and a one-click unsubscribe link, which the Lead Form's GDPR line promises.
- **Merge fields**, which an email tool sending this copy would map to its own syntax:
  - `{{pdf_url}}`: the absolute URL of `/tahak-evropska-dvojcata-americkych-etf.pdf` on the deployed domain.
  - `{{unsubscribe_url}}`: that tool's unsubscribe link.
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
> Zdroje: Zákon o daních z příjmů, § 4 odst. 1 písm. t) a u); Zákon o daních z příjmů, § 8 odst. 1 písm. a) a odst. 4.
>
> Nejde o investiční doporučení. Investování nese riziko ztráty.
> [Odhlásit se z odběru]({{unsubscribe_url}})

## Day 5: how to buy a Twin where the Lead invests

Chapter 6 of the Lead Magnet, for the Lead's own app. `{{segment}}` picks one of the variants below, and a Lead who skipped the Segmentation Question gets the last one. A line says what a broker offers only where the broker says so itself, and never what it charges, which the page has no Data Source for.

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

**Subject:** Ve Fiu VOO koupíte. Proč přesto dvojče

**Preheader:** Stejný index, ale bez americké dědické daně.

> Fio e-Broker vám dovolí obchodovat i s americkými ETF: když jen provede váš pokyn a nic vám nedoporučuje, povinnost dokumentu KID se na něj podle ČNB nevztahuje.
>
> Dvojče přesto vychází lépe. U irského fondu vašim dědicům nehrozí americká dědická daň nad 60 000 USD a akumulační třída vám nepřidá dividendy do přiznání.
>
> U svého brokera hledejte dvojče podle ISIN z tabulky v taháku. U SPYL je to IE000XZSV718.

This variant also cites "ČNB, stanovisko RS2018-12, část B.2", "Fio banka, stránka ETF: obchodování i s americkými ETF", "IRS, pokyny k formuláři 706-NA" and "Zákon o daních z příjmů, § 8 odst. 1 písm. a) a odst. 4" in its "Zdroje" line. It says nothing of Patria's offer, which Patria's own pages don't state.

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

> Akciový fond banky, jako ČSOB Akciový, stojí 2,59 % ročně. Dvojče SPYL 0,03 %. Kolik ten rozdíl dělá v korunách za 20 let, ukazuje kapitola 5 taháku.
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
> Ticker se mezi burzami liší, ISIN ne. Než nákup potvrdíte, porovnejte ISIN fondu s tabulkou v taháku.
>
> - **XTB:** americká ETF nenabízí, chybí k nim KID. Dvojče hledejte podle tickeru a ohlídejte si burzu a měnu.
> - **Trading 212:** americká ETF bez souladu s pravidly PRIIPs nenabízí. Dvojče hledejte podle tickeru nebo názvu.
> - **Revolut:** nabízí jen ETF registrovaná v EU. Dvojče hledejte podle tickeru nebo názvu.
> - **Fio e-Broker:** dovolí obchodovat i s americkými ETF. Dvojče vás ale ušetří americké dědické daně.

This variant cites the same sources as Chapter 6 in its "Zdroje" line: "XTB, centrum nápovědy: ETF z USA bez dokumentu KID", "Trading 212, odpověď týmu v komunitě z 2. 8. 2024: ETF z USA bez souladu s PRIIPs", "Revolut, centrum nápovědy: jen ETF registrované v EU", "Fio banka, stránka ETF: obchodování i s americkými ETF" and "IRS, pokyny k formuláři 706-NA".
