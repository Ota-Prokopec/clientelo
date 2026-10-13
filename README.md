# clientelo

A mobile-first lead-magnet landing page comparing NYSE-traded ETFs for Czech retail investors. See [docs/brief.md](./docs/brief.md).

## Strategy

Full reasoning and sources: [docs/strategy.md](./docs/strategy.md).

- **Target group.** Two personas, one per Ad Variant. The **App Investor** (25–40, invests through XTB, Trading 212 or Revolut) was refused VOO by their broker. The **Bank-Fund Saver** pays about 2 % a year for a bank equity fund.
- **Key Insight.** Those apps can't sell a US ETF to a retail client: its issuer publishes no KID, which EU rules (PRIIPs) require. A European Twin tracks the same index, often for the same fee, with no US estate tax and a simpler Czech tax return. The brokers list these Twins without explaining any of this.
- **Lead Magnet.** A two-page PDF cheat sheet: the Twin table, Czech taxes, US estate tax, and bank fund vs. ETF over 20 years. One PDF for both personas.
- **Ads.** Two Ad Variants on Meta, one per persona, each opening its own First Screen through `utm_content`: A (pain) and B (money). Copy, visuals and targeting: [docs/ads.md](./docs/ads.md).
- **Lead Ask.** Right after each Interactive Tool shows a result, plus a closing Section and the mobile sticky CTA. All of them lead to the single Lead Form.

## Section order

The page has one route at `/`. `utm_content` picks the Ad Variant (`pain` or `money`, anything else falls back to `pain`), and the Ad Variant picks which Interactive Tool opens the page. The Sticky CTA stays on screen throughout and steps aside only while a Lead Ask is in view.

1. **First Screen** (`#first-screen`): the Ad Variant's own Interactive Tool, its result, and an inline Lead Ask. The Visitor gives the page a few seconds on a phone, so the first thing they see has to be the answer the Ad promised: VOO struck out above its Twin SPYL for `pain`, the bank fund's 2.22 % against 0.03 % for `money`. Asking for a contact before that answer would ask for trust the page hasn't earned yet. Asking right after it catches the Visitor at their most engaged.
2. **Key Insight** (`#key-insight`): why the Visitor's app won't sell them VOO. It comes second because it explains a result the Visitor has already seen. Placed first, it would be a wall of regulation text between the Ad and its promise. It turns "a fund I can buy" into "the better fund for a Czech investor": the same index, no US estate tax, no dividends to report.
3. **The other Interactive Tool** (`#other-tool`), with its inline Lead Ask. The App Investor also holds money they could compare on fees, and the Bank-Fund Saver also needs to know which fund to buy. This second, independent chance to engage gives a second Lead Ask to a Visitor who has scrolled past the first.
4. **Lead Magnet and the closing Lead Form** (`#lead-magnet`). This catches the Visitor who has read everything and wants the whole thing. It is where the Sticky CTA leads. The Lead Magnet must be visible before any Lead Ask, so each inline Lead Ask higher up carries its own PDF thumbnail and a three-item contents list.
5. **Footer** (`#footer`): every Data Source with its verification date, "Nejde o investiční doporučení" and the GDPR link. It is the trust layer a cautious Visitor checks last, so it never sits between the Visitor and a Lead Ask.

## Commands

Run from the repo root.

| Command                            | What it does                                                                             |
| ---------------------------------- | ---------------------------------------------------------------------------------------- |
| `pnpm install`                     | Install dependencies and the lefthook git hooks                                          |
| `pnpm dev`                         | Start the Vite dev server with HMR                                                       |
| `pnpm build`                       | Type-check and build the production bundle into `dist/`                                  |
| `pnpm preview`                     | Serve the production build locally                                                       |
| `pnpm lint`                        | Lint the whole repo with oxlint                                                          |
| `pnpm check-types`                 | Type-check the app and every workspace entry                                             |
| `pnpm test`                        | Run the app's Vitest tests, then every workspace entry's                                 |
| `pnpm exec shadcn add <component>` | Add a shadcn component to `src/components/ui/` ([shadcn.md](./docs/standards/shadcn.md)) |
| `pnpm claude`                      | Start Claude Code in a picked git worktree                                               |
| `pnpm claude-list`                 | Remove picked git worktrees and their branches                                           |

## Post-modification checklist

A change is done when all of these pass. lefthook runs `pnpm lint` and `pnpm check-types` on every commit, and checks the commit subject ([ADR-0001](./docs/adr/0001-git-rules-enforced-by-hooks.md)).

1. `pnpm lint`
2. `pnpm check-types`
3. `pnpm test` (Vitest: the app's pure logic, then every workspace entry)
4. `pnpm build`
5. For a UI change: the change works in `pnpm dev` at 375 px phone width.
