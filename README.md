# clientelo

Landing page pro telefon, která českým drobným investorům srovnává ETF obchodovaná na NYSE a za Lead Magnet od nich získává kontakt. Zadání je v [docs/brief.md](./docs/brief.md).

## Strategie

Celé zdůvodnění i se zdroji: [docs/strategy.md](./docs/strategy.md).

- **Cílová skupina.** Dvě persony, pro každou jedna Ad Variant. **App Investor** (25–40 let, investuje přes XTB, Trading 212 nebo Revolut) chce VOO, ale broker ho neprodá. **Bank-Fund Saver** platí za Bank Fund kolem 2 % ročně.
- **Key Insight.** Tyto aplikace nesmějí drobnému klientovi prodat americké ETF: jeho emitent nevydává KID, který pravidla EU (PRIIPs) vyžadují. Evropský Twin sleduje stejný index, často za stejný poplatek, bez americké dědické daně a s jednodušším daňovým přiznáním v Česku. Brokeři tyto Twins nabízejí, ale nic z toho nevysvětlují.
- **Lead Magnet.** Dvoustránkový PDF tahák: tabulka Twins, daně v Česku, americká dědická daň a Bank Fund vs. ETF za 20 let. Jedno PDF pro obě persony.
- **Ads.** Dvě Ad Variants na Metě, jedna pro každou personu, a každá přes `utm_content` otevírá vlastní First Screen: A (pain) a B (money). Texty, vizuály a cílení: [docs/ads.md](./docs/ads.md). Stránka i PDF mají noindex, takže návštěvnost přichází jen z Ad Variants.
- **Lead Ask.** Přichází hned poté, co Interactive Tool ukáže výsledek, a dále v závěrečné Section a ve Sticky CTA na telefonu. Všechny vedou na jediný Lead Form.

## Pořadí Sections

Stránka má jedinou routu `/`. `utm_content` vybírá Ad Variant (`pain` nebo `money`, cokoli jiného spadne na `pain`) a Ad Variant určuje, kterým Interactive Tool stránka začíná. Sticky CTA zůstává na obrazovce celou dobu a uhne jen tehdy, když je na obrazovce některý Lead Ask.

1. **First Screen** (`#first-screen`): Interactive Tool dané Ad Variant, jeho výsledek a inline Lead Ask. Visitor dává stránce na telefonu pár sekund, takže první, co uvidí, musí být odpověď, kterou Ad slibuje: u `pain` přeškrtnuté VOO nad jeho Twin SPYL, u `money` kolik Kč stojí za 20 let Bank Fund za „kolem 2 %“ proti 0,03 %, tedy totéž „kolem 2 %“, které jmenuje Ad i headline, a to ve Fee Calculator, který je už vyplněný. Žádost o kontakt před touto odpovědí by chtěla důvěru, kterou si stránka ještě nezasloužila. Žádost hned po ní přichází ve chvíli, kdy je Visitor nejvíc zaujatý.
2. **Key Insight** (`#key-insight`): proč Visitor VOO ve své aplikaci nekoupí. Je druhý, protože vysvětluje výsledek, který Visitor už viděl. Kdyby byl první, stál by mezi Ad a jejím Ad Promise jako stěna textu o regulaci. Mění „fond, který můžu koupit“ na „lepší fond pro českého investora“: stejný index, žádná americká dědická daň, žádné dividendy k přiznání.
3. **Druhý Interactive Tool** (`#other-tool`) s vlastním inline Lead Ask. App Investor má i peníze, u kterých může porovnat poplatky, a Bank-Fund Saver zase potřebuje vědět, který fond koupit. Kdo první Lead Ask přescrolloval, dostane tu druhou, nezávislou příležitost zapojit se a s ní druhý Lead Ask.
4. **Lead Magnet a závěrečný Lead Form** (`#lead-magnet`): náhled PDF vedle jeho úplného obsahu a pod nimi jediný Lead Form (`#lead-form`): pole pro e-mail a pod ním nezaškrtnutý Welcome Emails Consent, souhlas s dvěma navazujícími Welcome Emails. Tahák na něm nikdy nezávisí, takže souhlas je svobodný (GDPR čl. 7 odst. 4) a Lead Form dál chce povinně jen e-mail. Je pro toho, kdo dočetl až sem a chce celý tahák. Každý inline Lead Ask i Sticky CTA vedou na tento Lead Form a dají fokus jeho poli pro e-mail, takže klávesnice telefonu je už nahoře. Lead Magnet musí být vidět před každým Lead Ask, proto každý inline Lead Ask výš na stránce nese vlastní náhled PDF a tři jeho Chapters: tabulku Twins, daně a dědickou daň. Po odeslání nahradí Lead Form na stejném místě Delivery: PDF se hned stáhne, jeho odkaz zůstane jako záloha a Chapters 2 a 3 se odemknou hned pod Delivery. Nepovinná Segmentation Question přijde až po spuštění stahování, takže nikdy nezdrží PDF, o které nový Lead právě požádal, a jen u Lead s Welcome Emails Consent, protože vybírá jen jeho Welcome Email ze dne 5. Po reloadu zůstane obsah odemčený a Sticky CTA i inline Lead Asks pryč: Lead už tahák má. Welcome Emails, které následují, jsou v [docs/welcome-emails.md](./docs/welcome-emails.md).
5. **Patička** (`#footer`): každý Data Source s datem ověření, „Nejde o investiční doporučení“ a odkaz na GDPR. Je to vrstva důvěry, kterou opatrný Visitor kontroluje až nakonec, takže nikdy nestojí v cestě žádnému Lead Ask.

<a id="funnel"></a>

## Funnel

Stránka zaznamenává průchod stránkou jako Funnel Events do `window.dataLayer`, pole uvnitř stránky, které nic nikam neposílá: analytický backend neexistuje ([ADR-0005](./docs/adr/0005-funnel-events-in-the-datalayer-only.md)). Každá událost se vkládá jako `{ event: '<name>', ...properties }` přes jediné místo, `trackFunnelEvent()` (`src/lib/funnel/`), a v `pnpm dev` se navíc vypíše do konzole. Žádná událost nenese e-mail, který Lead zadal.

| Událost                | Kdy                                                                                                    | Vlastní vlastnosti                                                                        |
| ---------------------- | ------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------- |
| `arrival`              | stránka se načte                                                                                       |                                                                                           |
| `section_view`         | Section má poprvé aspoň polovinu své plochy na obrazovce, nebo zaplní aspoň polovinu obrazovky         | `section`: `first-screen`, `key-insight`, `other-tool`, `lead-magnet` nebo `footer`       |
| `interactive_tool_use` | první změna ovládacích prvků nástroje. Výsledek, se kterým First Screen začíná, se za použití nepočítá | `tool`: `fund-picker` (s vybraným `ticker`) nebo `fee-calculator`                         |
| `lead_ask_click`       | klepnutí na odkaz inline Lead Ask nebo na Sticky CTA                                                   | `placement`: `fund-picker`, `fee-calculator` nebo `sticky-cta`                            |
| `lead_form_seen`       | `#lead-form` je aspoň z poloviny na obrazovce                                                          |                                                                                           |
| `lead_form_start`      | první stisk klávesy v poli pro e-mail (počítá se i vložení nebo automatické vyplnění)                  |                                                                                           |
| `lead_form_submit`     | každý pokus o odeslání                                                                                 |                                                                                           |
| `lead_form_success`    | `submitLead()` uspěl: Visitor je teď Lead                                                              |                                                                                           |
| `lead_form_error`      | odeslání selhalo                                                                                       | `reason`: `invalid-email` (validace) nebo `submit-failed` (`submitLead()` skončil chybou) |
| `pdf_download`         | automatické stažení, jakmile se podaří (selhané se nezaznamená), nebo klepnutí na odkaz v Delivery     | `trigger`: `auto` nebo `link`                                                             |
| `segment_answer`       | odeslání odpovědi na Segmentation Question (jen Lead s Welcome Emails Consent)                         | `segment`                                                                                 |

- **Každá událost navíc nese** `ad_variant` (`pain` nebo `money`, podle zobrazeného First Screen), surové `utm_source`, `utm_medium`, `utm_campaign` a `utm_content` (`none`, když chybí) a `visitor_kind`: `new_visitor`; `returning_visitor`, když si stránka Visitor pamatuje z dřívější Visit (jen se souhlasem, viz [Souhlas](#consent)); nebo `returning_lead`, když si z dřívější Visit pamatuje Lead, což má přednost před `returning_visitor`. Tyto vlastnosti popisují Visit tak, jak začala, takže pozdější události nového Lead dál uvádějí `new_visitor` a povolení v Consent Bar se projeví až od příští Visit.
- **Visit je jedno načtení stránky**, takže reload je nová `arrival`. `arrival`, `lead_form_seen` a `lead_form_start` se zaznamenají jednou za Visit, `section_view` jednou za Section a `interactive_tool_use` jednou za nástroj. Ostatní pokaždé.
- **Vyplněný honeypot** od daného odeslání dál nepošle nic, ani `lead_form_submit`, takže se boti k poslednímu kroku Funnel nikdy nedostanou. Honeypot se čte až při odeslání, takže dřívější `lead_form_seen` a `lead_form_start` od bota zůstanou zaznamenané.
- **Funnel** je `arrival` → `lead_form_seen` → `lead_form_start` → `lead_form_success` a počítá jen Visitors (nikdy `returning_lead`). Jeho poslední krok je Conversion Rate. Použití Interactive Tool není krok, ale rozpad: Conversion Rate těch, kdo nástroj použili, proti těm, kdo ne. Conversion Rate pro Ad Variant počítá jen příchody, jejichž `utm_content` ji jmenovalo, takže Visitor bez UTM, který vidí First Screen `pain`, nenafukuje Ad Variant A.
- **Jak je přečíst:** otevřete na stránce konzoli prohlížeče a spusťte `window.dataLayer` (nebo `console.table(window.dataLayer)`). V `pnpm dev` se každá událost vypíše i ve chvíli, kdy nastane.
- **Před spuštěním Ad** se Meta Pixel i tagy dalších reklamních platforem přidají jako tagy, které čtou `dataLayer`: viz [Před spuštěním Ad](#before-an-ad-launches).

<a id="conversion-rate"></a>

## Očekávaná Conversion Rate

Očekáváme Conversion Rate kolem **8–15 %** příchodů a pro plánování počítáme s **12 %**. **15–30 %** je horní scénář, pokud má Ad úzké cílení. Všechna tři čísla jsou náš odhad. Benchmark níže ukazuje, kde vůči trhu leží.

### Benchmark

Jediným zdrojem je Conversion Benchmark Report společnosti Unbounce, konkrétně jeho stránka pro [finance a pojišťovnictví](https://unbounce.com/industry/finance-and-insurance/) (report 2021):

- Medián všech finančních a pojišťovacích stránek je **6,2 %** (všech odvětví 4,6 %), v podkategorii Finance **7,9 %** (5 448 landing pages).
- Stránky s formulářem mají medián **5,9 %**. Když na ně ale vede návštěvnost ze sociálních sítí, je medián **8,6 %**, proti 4,3 % z placeného vyhledávání (3 605 stránek s formulářem). To je nejbližší srovnání: stránka s formulářem a návštěvností z Mety.
- Podkategorii investování stránka samostatně neuvádí a horní čtvrtinu stránek nevyčísluje. U stránek s formulářem a návštěvností ze sociálních sítí začíná horní čtvrtina podle krabicového grafu, který ji číslem nepopisuje, zhruba nad 20 %. Odtud horní scénář 15–30 %.

### Proč by stránka měla medián překonat

- **First Screen odpovídá na Ad Promise výsledkem** Interactive Tool, ne dalším slibem.
- **Lead Form chce povinně jen e-mail;** zaškrtávací políčko pro navazující e-maily je nepovinné. Unbounce na téže stránce píše: „You'll get more leads if you only ask for an email address.“
- **Lead Ask přichází hned po výsledku**, ve chvíli největšího zájmu.

### Očekávání po krocích Funnel

Tato čísla jsou náš předpoklad, ne benchmark:

| Krok Funnel                                       | Očekávání                 |
| ------------------------------------------------- | ------------------------- |
| `arrival` → `lead_form_seen`                      | ~45 %                     |
| `lead_form_seen` → `lead_form_start`              | ~40 %                     |
| `lead_form_start` → `lead_form_success`           | ~65 %                     |
| `arrival` → `lead_form_success` (Conversion Rate) | 0,45 × 0,40 × 0,65 ≈ 12 % |

Skutečná data z `dataLayer` pak ukážou, který krok zaostává.

**Jedno očekávání pro obě Ad Variants.** Data, která by je od sebe oddělila, zatím nemáme, takže obě mají stejný předpoklad. Conversion Rate se přesto čte zvlášť pro každou Ad Variant (viz [Funnel](#funnel)).

<a id="ab-hypotheses"></a>

## A/B Hypotheses

Tři A/B Hypotheses seřazené podle očekávaného dopadu. Každá porovnává kontrolní skupinu (stránka dnes) s testovanou skupinou (změna). Lift je relativní vůči 12 % z [Očekávané Conversion Rate](#conversion-rate) a je to náš odhad, ne naměřená hodnota. Každá A/B Hypothesis se testuje v každé Ad Variant zvlášť, takže uvedený počet Visitors potřebuje každá skupina v každé Ad Variant. Počty vycházejí z oboustranného testu rozdílu dvou podílů, α = 5 %, síla 80 %, výchozí Conversion Rate 12 %.

| Pořadí | A/B Hypothesis                                                            | Krok Funnel                          | Očekávaný lift      | Visitors na skupinu |
| ------ | ------------------------------------------------------------------------- | ------------------------------------ | ------------------- | ------------------- |
| 1      | Pole pro e-mail přímo v Lead Ask na First Screen                          | `arrival` → `lead_form_seen`         | +25 % (12 → 15 %)   | ~2 000              |
| 2      | Headline na First Screen: navázat na slova Ad, nebo rovnou uvést výsledek | `arrival` → `lead_form_seen`         | +15 % (12 → 13,8 %) | ~5 400              |
| 3      | Lead Magnet: PDF tahák, nebo e-mailový mini-kurz                          | `lead_form_seen` → `lead_form_start` | +10 % (12 → 13,2 %) | ~12 000             |

### 1. Pole pro e-mail přímo v Lead Ask na First Screen

- **Co se mění:** Lead Ask na First Screen dostane vlastní pole pro e-mail místo dnešního odkazu, který skočí na `#lead-form`.
- **Krok Funnel:** `arrival` → `lead_form_seen`. Dnes je v tomto kroku klepnutí na odkaz a skok dolů, v testované skupině je pole vidět hned na First Screen. Protože se tím posune, kde nastává `lead_form_seen`, test se vyhodnocuje na celé Conversion Rate.
- **Očekávaný lift:** +25 % (12 → 15 %). Kdo na odkaz neklepne, dnes Lead Form vůbec neuvidí. Pole přímo pod výsledkem mu ten krok ušetří.
- **Visitors na skupinu:** ~2 000 v každé Ad Variant.

### 2. Headline na First Screen

- **Co se mění:** v každé Ad Variant dnešní headline, který navazuje na slova Ad, proti headline, který rovnou uvádí výsledek:

  | Ad Variant | Kontrolní skupina (navazuje na Ad)                       | Testovaná skupina (uvádí výsledek)                                                                       |
  | ---------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
  | `pain`     | „VOO v aplikaci nekoupíte. Dvojče ano.“                  | „Místo VOO: SPYL. Stejný index S&P 500 za stejných 0,03 % ročně.“                                        |
  | `money`    | „2 % nebo 0,03 % ročně? Spočítejte si rozdíl za 20 let.“ | „Při stejném vývoji trhu vám v bankovním fondu zůstane za 20 let zhruba o třetinu méně peněz než v ETF.“ |

  Testované headlines tvrdí jen to, co kryjí Data Sources. VOO i SPYL sledují S&P 500 a oba mají TER 0,03 % (stránky fondů od Vanguard a SPDR). Headline `pain` platí pro VOO, se kterým First Screen otevírá. U jiného vybraného ETF jmenuje jeho Substitute a stejný poplatek uvádí jen tam, kde TER opravdu sedí. „Zhruba o třetinu“ je stejné tvrzení jako v Ad Variant B ([docs/ads.md](./docs/ads.md)): Bank Fund „kolem 2 %“ (medián čtyř Bank Funds podle jejich KID, 2,06 %, zaokrouhlený na 2 %) proti SPYL, ((1 − 0,02) / (1 − 0,0003))^20 ≈ 0,67, a platí pro jakýkoli výnos trhu.

- **Krok Funnel:** `arrival` → `lead_form_seen`. Headline rozhoduje, jestli Visitor zůstane i po prvních sekundách.
- **Očekávaný lift:** +15 % (12 → 13,8 %). Headline s výsledkem dá odpověď i tomu, kdo nástroj nečte.
- **Visitors na skupinu:** ~5 400 v každé Ad Variant.
- **Headline A vs. B z [plan.md](./docs/plan.md) není A/B Hypothesis.** Ad Variants jsou dvě persony se dvěma Funnels, ne jedna změna na jedné stránce. Tato A/B Hypothesis je stejný nápad přetvořený v test uvnitř každé Ad Variant.

### 3. Lead Magnet: PDF tahák, nebo e-mailový mini-kurz

- **Co se mění:** Lead Magnet je místo dvoustránkového PDF taháku e-mailový mini-kurz se stejným obsahem.
- **Krok Funnel:** `lead_form_seen` → `lead_form_start`. To, co Visitor za e-mail dostane, rozhoduje, jestli začne psát.
- **Očekávaný lift:** +10 % (12 → 13,2 %), nejistější ze tří. Několik e-mailů zní jako víc obsahu, ale znaménko se může otočit, protože mini-kurz odkládá hodnotu, kterou PDF dá hned.
- **Visitors na skupinu:** ~12 000 v každé Ad Variant.

### Proč toto pořadí

- **1** odstraní krok ve chvíli největšího zájmu a týká se každého Visitor.
- **2** vidí také všichni, ale změna headline bývá menší než odstranění kroku.
- **3** může vyjít velký, ale jeho směr je nejméně jistý, takže očekávaný dopad je nejmenší. Navíc nejvíc stojí na výrobu.

<a id="consent"></a>

## Souhlas

Zaznamenání Funnel Event nic neukládá, takže nepotřebuje souhlas. Stránka drží v `localStorage` tři příznaky, žádný z nich neobsahuje e-mail, a zásady ochrany osobních údajů (`/ochrana-osobnich-udaju`) u každého uvádějí účel, zda potřebuje souhlas a jak dlouho se uchovává:

| Klíč                | Účel                                                           | Souhlas                                              | Uchovává se                               |
| ------------------- | -------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- |
| `clientelo:lead`    | drží Delivery odemčenou pro Lead, který se vrací               | není potřeba: slouží Delivery, o kterou Lead požádal | dokud ho Visitor nesmaže                  |
| `clientelo:consent` | volba v Consent Bar a její datum                               | není potřeba                                         | 12 měsíců, pak se Consent Bar zeptá znovu |
| `clientelo:visited` | započítá příští Visit jako `returning_visitor`, jen pro měření | nutný (§ 89 odst. 3 zákona č. 127/2005 Sb.)          | dokud souhlas není odmítnut nebo odvolán  |

- **Consent Bar** (`#consent-bar`) žádá o souhlas právě k tomuto jedinému účelu. Otevře se při prvním scrollu nebo prvním použití Interactive Tool, nikdy dřív, aby Ad Promise na First Screen zůstal nezakrytý, a nikdy, dokud je uložená volba mladší 12 měsíců. Sedí dole na obrazovce nad Sticky CTA, má jeden řádek textu a dvě stejně výrazná tlačítka, „Povolit“ a „Odmítnout“. Nic není předvybrané a ignorování není souhlas.
- **`clientelo:visited` se řídí volbou.** Zapíše se po „Povolit“ a při každé další Visit, dokud souhlas platí, a smaže se po „Odmítnout“ a při každé Visit bez platného souhlasu. Čte se jen, dokud souhlas platí.
- **Odvolat souhlas je stejně snadné jako ho dát:** „Nastavení cookies“ v patičce otevře Consent Bar znovu.

<a id="before-an-ad-launches"></a>

## Před spuštěním Ad

Meta Pixel ani identita a kontakt správce v zásadách ochrany osobních údajů nejsou implementované. Před spuštěním Ad je třeba je doplnit podle skutečných právních údajů zaměstnavatele:

- **ID Meta Pixelu**, načtené jako tag, který čte `dataLayer` (`lead_form_success` jako jeho událost `Lead`), a to teprve tehdy, když s tím Visitor souhlasí.
- **Jméno a kontakt správce** v zásadách ochrany osobních údajů.
- **Odstavec zásad o Metě** jako společném správci dat z Pixelu a o předávání těchto dat do USA.

<a id="commands"></a>

## Příkazy

Spouštějte z kořene repa.

| Příkaz                             | Co dělá                                                                                   |
| ---------------------------------- | ----------------------------------------------------------------------------------------- |
| `pnpm install`                     | Nainstaluje závislosti a git hooky lefthook                                               |
| `pnpm dev`                         | Spustí Vite dev server s HMR                                                              |
| `pnpm build`                       | Zkontroluje typy a sestaví produkční bundle, Lead Magnet PDF a Share Image                |
| `pnpm preview`                     | Lokálně servíruje produkční build                                                         |
| `pnpm lint`                        | Zkontroluje celé repo oxlintem                                                            |
| `pnpm format`                      | Naformátuje celé repo Prettierem (`.prettierrc.json`, výjimky v `.prettierignore`)        |
| `pnpm format:check`                | Zkontroluje, že je celé repo naformátované Prettierem                                     |
| `pnpm check-types`                 | Zkontroluje typy aplikace a všech položek workspace                                       |
| `pnpm test`                        | Spustí Vitest testy aplikace v `tests/` a pak testy všech položek workspace               |
| `pnpm exec shadcn add <component>` | Přidá shadcn komponentu do `src/components/ui/` ([shadcn.md](./docs/standards/shadcn.md)) |
| `pnpm claude`                      | Spustí Claude Code ve vybraném git worktree                                               |
| `pnpm claude-list`                 | Odstraní vybrané git worktrees a jejich větve                                             |

<a id="post-modification-checklist"></a>

## Kontrolní seznam po úpravě

Změna je hotová, když projde všechno níže. lefthook při každém commitu naformátuje stagované soubory Prettierem a výsledek přidá do commitu, spustí `pnpm lint` a `pnpm check-types` a zkontroluje předmět commitu ([ADR-0001](./docs/adr/0001-git-rules-enforced-by-hooks.md)). CI ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)) spustí body 1–5 na každém PR a po každém pushi do `main`.

1. `pnpm format:check`
2. `pnpm lint`
3. `pnpm check-types`
4. `pnpm test` (Vitest: čistá logika aplikace v `tests/`, pak všechny položky workspace)
5. `pnpm build`
6. U změny UI: změna funguje v `pnpm dev` při šířce telefonu 375 px a Funnel Events se ukazují v konzoli. `submitLead()` a `submitSegment()` jsou trvalé stuby, které nic neposílají, protože stránka je jen frontend: chybový stav Lead Form nebo Segmentation Question zobrazíte otevřením stránky s `?submit-lead=fail` nebo `?submit-segment=fail` (jen v dev). Odeslaný Lead se pamatuje v `localStorage` pod `clientelo:lead`: smažte ho a uvidíte stránku znovu jako Visitor. Smažte `clientelo:consent` a znovu se ukáže Consent Bar, smažte `clientelo:visited` a přijdete jako `new_visitor`.
7. U změny Lead Magnet PDF nebo čísla v něm: `/tahak-evropska-dvojcata-americkych-etf.pdf` se v `pnpm dev` na svých dvou stránkách pořád dobře čte. Build sám selže při jakémkoli jiném počtu stran.
8. U změny Share Image: `/share-image.png` v `pnpm dev` se dá přečíst na první pohled v plné velikosti i zmenšený na 600 × 314 a písmena s háčky se vykreslí. Build sám selže u obrázku nad 300 kB.
