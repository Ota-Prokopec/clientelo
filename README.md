# clientelo

A mobile-first lead-magnet landing page comparing NYSE-traded ETFs for Czech retail investors. See [docs/brief.md](./docs/brief.md).

## Strategy

Full reasoning and sources: [docs/strategy.md](./docs/strategy.md).

- **Target group.** Two personas, one per Ad Variant. The **App Investor** (25–40, invests through XTB, Trading 212 or Revolut) was refused VOO by their broker. The **Bank-Fund Saver** pays about 2 % a year for a bank equity fund.
- **Key Insight.** Those apps can't sell a US ETF to a retail client: its issuer publishes no KID, which EU rules (PRIIPs) require. A European Twin tracks the same index, often for the same fee, with no US estate tax and a simpler Czech tax return. The brokers list these Twins without explaining any of this.
- **Lead Magnet.** A two-page PDF cheat sheet: the Twin table, Czech taxes, US estate tax, and bank fund vs. ETF over 20 years. One PDF for both personas.
- **Ads.** Two Ad Variants on Meta, one per persona, each opening its own First Screen through `utm_content`: A (pain) and B (money). Copy, visuals and targeting: [docs/ads.md](./docs/ads.md). The page and the PDF are noindexed, so traffic arrives only through the Ad Variants.
- **Lead Ask.** Right after each Interactive Tool shows a result, plus a closing Section and the mobile sticky CTA. All of them lead to the single Lead Form.

## Section order

The page has one route at `/`. `utm_content` picks the Ad Variant (`pain` or `money`, anything else falls back to `pain`), and the Ad Variant picks which Interactive Tool opens the page. The Sticky CTA stays on screen throughout and steps aside only while a Lead Ask is in view.

1. **First Screen** (`#first-screen`): the Ad Variant's own Interactive Tool, its result, and an inline Lead Ask. The Visitor gives the page a few seconds on a phone, so the first thing they see has to be the answer the Ad promised: VOO struck out above its Twin SPYL for `pain`, and for `money` what the bank fund's 2.59 % against 0.03 % costs in Kč over 20 years, in the Fee Calculator already filled in. Asking for a contact before that answer would ask for trust the page hasn't earned yet. Asking right after it catches the Visitor at their most engaged.
2. **Key Insight** (`#key-insight`): why the Visitor's app won't sell them VOO. It comes second because it explains a result the Visitor has already seen. Placed first, it would be a wall of regulation text between the Ad and its promise. It turns "a fund I can buy" into "the better fund for a Czech investor": the same index, no US estate tax, no dividends to report.
3. **The other Interactive Tool** (`#other-tool`), with its inline Lead Ask. The App Investor also holds money they could compare on fees, and the Bank-Fund Saver also needs to know which fund to buy. This second, independent chance to engage gives a second Lead Ask to a Visitor who has scrolled past the first.
4. **Lead Magnet and the closing Lead Form** (`#lead-magnet`): the PDF thumbnail beside its full contents list, then the one Lead Form (`#lead-form`), with an email field only. This catches the Visitor who has read everything and wants the whole thing. Every inline Lead Ask and the Sticky CTA lead to this Lead Form and focus its email field, so a phone's keyboard is already up. The Lead Magnet must be visible before any Lead Ask, so each inline Lead Ask higher up carries its own PDF thumbnail and three of its Chapters: the Twin table, the taxes and the estate tax. Once the Visitor submits, Delivery replaces the Lead Form in place: the PDF downloads at once, with its link as a fallback, and Chapters 2 and 3 unlock right below the band. The optional Segmentation Question comes only after the download has started, so it never stands between a new Lead and the PDF. A reload keeps the content unlocked and the Sticky CTA gone. The Welcome Emails that follow are in [docs/welcome-emails.md](./docs/welcome-emails.md).
5. **Footer** (`#footer`): every Data Source with its verification date, "Nejde o investiční doporučení" and the GDPR link. It is the trust layer a cautious Visitor checks last, so it never sits between the Visitor and a Lead Ask.

## Funnel

The page records the Visitor's journey as Funnel Events in `window.dataLayer`, an in-page array that sends nothing anywhere: there is no analytics backend ([ADR-0005](./docs/adr/0005-funnel-events-in-the-datalayer-only.md)). Each event is pushed as `{ event: '<name>', ...properties }` through one seam, `trackFunnelEvent()` (`src/funnel/`), and in `pnpm dev` it is also logged to the console. No event carries the Lead's email.

| Event                  | When                                                                                                    | Its own properties                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `arrival`              | the page loads                                                                                          |                                                                                             |
| `section_view`         | a Section first has at least half of itself on screen, or fills at least half the screen                | `section`: `first-screen`, `key-insight`, `other-tool`, `lead-magnet` or `footer`           |
| `interactive_tool_use` | the Visitor's first change to a tool's controls. The result a First Screen opens with isn't use         | `tool`: `fund-picker` (with the picked `ticker`) or `fee-calculator`                         |
| `lead_ask_click`       | a tap on an inline Lead Ask's link or the Sticky CTA                                                    | `placement`: `fund-picker`, `fee-calculator` or `sticky-cta`                                |
| `lead_form_seen`       | `#lead-form` is at least half on screen                                                                 |                                                                                             |
| `lead_form_start`      | the first keystroke in the email field (a paste or an autofill counts too)                              |                                                                                             |
| `lead_form_submit`     | every submit attempt                                                                                    |                                                                                             |
| `lead_form_success`    | `submitLead()` resolved: the Visitor is now a Lead                                                      |                                                                                             |
| `lead_form_error`      | a submit failed                                                                                         | `reason`: `invalid-email` (validation) or `submit-failed` (`submitLead()` rejected)         |
| `pdf_download`         | the automatic download on success, or a tap on Delivery's link                                          | `trigger`: `auto` or `link`                                                                 |
| `segment_answer`       | an answer to the Segmentation Question is submitted                                                     | `segment`                                                                                   |

- **Every event also carries** `ad_variant` (`pain` or `money`, the First Screen shown), the raw `utm_source`, `utm_medium`, `utm_campaign` and `utm_content` (`none` when missing), and `visitor_kind`: `new_visitor`, `returning_visitor` when an earlier Visit remembers the Visitor (only with their consent, see [Consent](#consent)), or `returning_lead` when an earlier Visit remembers the Lead, which wins over `returning_visitor`. These describe the Visit as it arrived, so a new Lead's later events still say `new_visitor`, and allowing the Consent Bar counts only from the next Visit.
- **A Visit is one page load**, so a reload is a new `arrival`. `arrival`, `lead_form_seen` and `lead_form_start` fire once per Visit, `section_view` once per Section and `interactive_tool_use` once per tool. The others fire every time.
- **A filled honeypot sends nothing** from that submit on, not even `lead_form_submit`, so bots never reach the Funnel's last step. The honeypot is read only on submit, so a bot's earlier `lead_form_seen` and `lead_form_start` stay recorded.
- **The Funnel** is `arrival` → `lead_form_seen` → `lead_form_start` → `lead_form_success`, counting Visitors only (never `returning_lead`). Its last step is the Conversion Rate. Interactive Tool use is a breakdown, not a step: the Conversion Rate of Visitors who used a tool against those who didn't. The Conversion Rate per Ad Variant counts only arrivals whose `utm_content` named it, so a Visitor without UTMs, who sees the `pain` First Screen, doesn't inflate Ad Variant A.
- **To read them**, open the browser's console on the page and run `window.dataLayer` (or `console.table(window.dataLayer)`). In `pnpm dev`, each event is also logged as it happens.
- **Before an Ad launches**, the Meta Pixel and any other ad-platform tag are added as tags reading the `dataLayer`: see [Before an Ad launches](#before-an-ad-launches).

## Consent

Recording a Funnel Event stores nothing, so it needs no consent. The page keeps three flags in `localStorage`, none holding the email, and the privacy policy (`/ochrana-osobnich-udaju`) lists each one with its purpose, whether it needs consent and how long it is kept:

| Key                 | Purpose                                                            | Consent                                         | Kept                                       |
| ------------------- | ------------------------------------------------------------------ | ----------------------------------------------- | ------------------------------------------ |
| `clientelo:lead`    | keeps Delivery unlocked for a returning Lead                       | none: it serves the Delivery the Lead asked for | until the Visitor clears it                |
| `clientelo:consent` | the Visitor's choice in the Consent Bar and its date               | none                                            | 12 months, then the Consent Bar asks again |
| `clientelo:visited` | counts the next Visit as `returning_visitor`, for measurement only | required (§89(3) of Act No. 127/2005 Coll.)     | until consent is refused or withdrawn      |

- **The Consent Bar** (`#consent-bar`) asks for that one purpose. It opens on the Visitor's first scroll or first Interactive Tool use, never before, so the First Screen's Ad Promise lands uncovered, and never while a choice under 12 months old is stored. It sits at the bottom of the screen above the Sticky CTA, with one line of copy and two buttons of equal weight, "Povolit" and "Odmítnout". Nothing is preselected, and ignoring it is not consent.
- **`clientelo:visited` follows the choice.** It is written on "Povolit" and on every later Visit while consent holds, and removed on "Odmítnout" and on any Visit without valid consent. It is read only while consent holds.
- **Withdrawing is as easy as giving:** the footer's "Nastavení cookies" reopens the bar.

## Before an Ad launches

The Meta Pixel and the privacy policy's controller identity and contact are not implemented. Before an Ad launches, they are added with the employer's real legal data:

- **The Meta Pixel ID**, loaded as a tag reading the `dataLayer` (`lead_form_success` as its `Lead` event), behind the Visitor's consent.
- **The controller's name and contact** in the privacy policy.
- **The privacy policy's paragraph on Meta** as joint controller for the Pixel's data, and on the transfer of that data to the US.

## Commands

Run from the repo root.

| Command                            | What it does                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `pnpm install`                     | Install dependencies and the lefthook git hooks                                          |
| `pnpm dev`                         | Start the Vite dev server with HMR                                                       |
| `pnpm build`                       | Type-check and build the production bundle, the Lead Magnet PDF and the Share Image      |
| `pnpm preview`                     | Serve the production build locally                                                       |
| `pnpm lint`                        | Lint the whole repo with oxlint                                                          |
| `pnpm check-types`                 | Type-check the app and every workspace entry                                             |
| `pnpm test`                        | Run the app's Vitest tests in `tests/`, then every workspace entry's                     |
| `pnpm exec shadcn add <component>` | Add a shadcn component to `src/components/ui/` ([shadcn.md](./docs/standards/shadcn.md)) |
| `pnpm claude`                      | Start Claude Code in a picked git worktree                                               |
| `pnpm claude-list`                 | Remove picked git worktrees and their branches                                           |

## Post-modification checklist

A change is done when all of these pass. lefthook runs `pnpm lint` and `pnpm check-types` on every commit, and checks the commit subject ([ADR-0001](./docs/adr/0001-git-rules-enforced-by-hooks.md)).

1. `pnpm lint`
2. `pnpm check-types`
3. `pnpm test` (Vitest: the app's pure logic in `tests/`, then every workspace entry)
4. `pnpm build`
5. For a UI change: the change works in `pnpm dev` at 375 px phone width, and the Funnel Events show in the console. `submitLead()` and `submitSegment()` are final stubs that send nothing, since the page is frontend only: open the page with `?submit-lead=fail` or `?submit-segment=fail` (dev only) to reach the Lead Form's or the Segmentation Question's error state. A submitted Lead is remembered in `localStorage` under `clientelo:lead`: remove it to see the page as a Visitor again. Remove `clientelo:consent` to see the Consent Bar again, and `clientelo:visited` to arrive as a `new_visitor`.
6. For a change to the Lead Magnet PDF or a figure in it: `/tahak-evropska-dvojcata-americkych-etf.pdf` in `pnpm dev` still reads well on its two pages. The build already fails on any other page count.
7. For a change to the Share Image: `/share-image.png` in `pnpm dev` reads at a glance at full size and scaled down to 600 × 314, with its háček letters rendered. The build already fails on an image over 300 KB.
