# Design identity: Mřížka

How the page looks. Read this before you design a Section, style a component or brief an Ad creative. The brief requires a page that doesn't look like a default generated one ([brief.md](../brief.md)); this file says what ours looks like instead, and the [ban list](#ban-list) says what it must never look like. The technology rules are [tailwind.md](../standards/tailwind.md) and [shadcn.md](../standards/shadcn.md); the decision is [ADR-0003](../adr/0003-tailwind-and-shadcn-replace-css-modules.md).

"Mřížka" (grid) is Swiss International Style in clientelo.cz's colours and corner radii. It was picked from three prototyped directions; the prototypes are kept on the branch `chore/prototype-design-directions`.

## Principles

- **The figure is the visual.** The Ticker, the TER and the Kč difference are set huge, so the Ad Promise reads in the few seconds a Visitor gives the page. There are no illustrations, photos or decorative icons.
- **Colour carries meaning.** Red is what costs the Visitor or what they can't have. Teal is their Twin and the good number. Nothing else is coloured.
- **Square structure, round controls.** Rules, giant type and the grid stay square. Everything the Visitor touches, and every band, is rounded.

## Colour

clientelo.cz's own palette (its CSS variables `--teal`, `--tint`, `--red`, `--ink`, `--line`…) mapped onto shadcn's tokens, plus the roles shadcn has no token for. clientelo.cz has no dark mode: the dark values come from its dark band (`#06322f` to `#0a3f3a`, `#7fd0c9`, `#bfe0dd`), and the three marked _derived_ appear nowhere on it.

| Token                                       | Light     | Dark                | Used for                                                                             |
| ------------------------------------------- | --------- | ------------------- | ------------------------------------------------------------------------------------ |
| `background`                                | `#ffffff` | `#06322f`           | the page                                                                             |
| `card`                                      | `#ffffff` | `#0a3f3a`           | a panel                                                                              |
| `card-foreground`                           | `#13302e` | `#ffffff`           | text on a panel                                                                      |
| `popover`, `popover-foreground`             | as `card` | as `card`           | a popup, which the page doesn't use; set so a primitive reading it isn't transparent |
| `foreground`                                | `#13302e` | `#ffffff`           | body text                                                                            |
| `primary`                                   | `#b23132` | `#b23132`           | the CTA button (clientelo.cz's `.btn-primary`)                                       |
| `primary-hover`                             | `#8f2728` | `#8f2728`           | the CTA button's hover                                                               |
| `primary-foreground`                        | `#ffffff` | `#ffffff`           | text on the CTA                                                                      |
| `secondary`, `muted`                        | `#eef5f5` | `#0a3f3a`           | quiet fills                                                                          |
| `secondary-foreground`, `accent-foreground` | `#06322f` | `#ffffff`           | text on a quiet fill                                                                 |
| `muted-foreground`                          | `#5c6f6e` | `#bfe0dd`           | labels, Data Source notes, the struck-out Ticker                                     |
| `accent`                                    | `#e2eeee` | `#0d4a44` (derived) | the segmented control's track, the slider's track, the Fee Calculator's bar track    |
| `destructive`                               | `#8f2728` | `#ef8f8f` (derived) | form errors                                                                          |
| `border`, `input`                           | `#dce8e7` | `#306965` (derived) | hairlines inside a control                                                           |
| `ring`                                      | `#00666c` | `#7fd0c9`           | focus                                                                                |
| `heading`                                   | `#06322f` | `#ffffff`           | headings, giant figures, the 2 px rules                                              |
| `brand`                                     | `#00666c` | `#7fd0c9`           | the Twin, its TER, the selected option, "Dvojče ano."                                |
| `signal`                                    | `#b23132` | `#ef8f8f`           | the struck-out Ticker's bar, a Bank Fund's TER, a fee in Kč, Section numbers         |
| `block`                                     | `#06322f` | `#00666c`           | a Lead Ask's band                                                                    |
| `block-foreground`                          | `#ffffff` | `#ffffff`           | text on the band                                                                     |

Dark mode follows the system (`prefers-color-scheme`) with no toggle. Every colour role has both values; a new role gets both in the same change. The Lead Magnet PDF and its thumbnail on the page stay in the light palette in both modes.

## Type

One family: **Schibsted Grotesk** at 400, 700 and 900, self-hosted from Fontsource as static files (they cover Czech, and the PDF embeds the same files). A figure that changes as the Visitor moves a control (the Kč difference) uses `tabular-nums`, so it doesn't jitter; a static figure stays proportional, because tabular figures set the decimal comma a digit wide (`2 , 22 %`).

| Role                         | Token        | Size at 375 px      | Weight | Tracking |
| ---------------------------- | ------------ | ------------------- | ------ | -------- |
| Giant Ticker                 | `ticker`     | 6.5rem, fits 343 px | 900    | −0.06em  |
| Giant TER                    | `ter`        | 4.5rem              | 900    | −0.05em  |
| Kč difference                | `difference` | 3.4rem              | 900    | −0.05em  |
| First Screen headline        | `headline`   | 2.5rem              | 900    | −0.045em |
| Section heading, band title  | `title`      | 2.2rem              | 900    | −0.045em |
| Fact value                   | `fact`       | 18 px               | 700    |          |
| Body                         | `body`       | 17 px, line 1.55    | 400    |          |
| Grid label, field label      | `label`      | 12 px               | 700    |          |
| Fact label, Data Source note | `note`       | 11 px               | 400    |          |

Each role is a `--text-*` token in `src/index.css` that carries its line height, tracking and weight, so `text-ticker` alone sets a giant Ticker. A giant figure must fit the 343 px between the gutters at 375 px, so the longest one shown (`VWCE`, `2,22 %`) sets the size.

## Layout

- **Mobile first at 375 px**, with a 16 px gutter.
- **One column per Page.** Every route renders its content inside `Page` (`src/components/Page.tsx`), which alone sets the column's width (`max-w-xl`, centred) and the 16 px gutter. A Section, the Footer or a route never sets its own.
- **The left grid column** (3 rem) carries the Section number in `signal` and, beside it, the Section's label in bold 12 px: `01` First Screen, `02` Key Insight, `03` the other Interactive Tool, `04` the Lead Magnet and the closing Lead Form. An inline Lead Ask and the Footer carry no number.
- **2 px rules** in `heading` separate figures, the way a Swiss grid separates columns. Facts sit in a two-column grid, each a small grey label over a bold value under its rule.
- No cards: a Section is type on the page, divided by rules, never a box.

## Shape

clientelo.cz's radii, as theme tokens that shadcn's Vega components read:

| Radius | Value | Used for                                                                                                                |
| ------ | ----- | ----------------------------------------------------------------------------------------------------------------------- |
| `sm`   | 10 px | an option inside a segmented control                                                                                    |
| `md`   | 12 px | buttons, inputs, the segmented control's track (`.mm-cta`, `.fq`): Vega's controls read `md`; the Fee Calculator's bars |
| `xl`   | 16 px | a panel, the PDF thumbnail (`.card`)                                                                                    |
| `3xl`  | 26 px | a Lead Ask's band (`.cta-final`)                                                                                        |
| `full` | —     | the bar striking out a Ticker, the slider's track and thumb                                                             |

Rules, giant type and the grid stay square. Nothing has a shadow.

## Components

| On the page                             | Built from                                                                 |
| --------------------------------------- | -------------------------------------------------------------------------- |
| Fund Picker: the Ticker choice          | `ToggleGroup`, single-select, as a segmented control                       |
| Fee Calculator: the amount              | `InputGroup` (`Input` + "Kč") and a `Slider`                               |
| Fee Calculator: the years               | `Slider`                                                                   |
| Fee Calculator: the Bank Fund           | `ToggleGroup` as a segmented control                                       |
| Fee Calculator: what each fund leaves   | a ruled row over a bar on an `accent` track, as in Ad Variant B's creative |
| A Twin's facts (index, TER, estate tax) | the ruled fact grid                                                        |
| Lead Form                               | `Field`, `FieldLabel`, `FieldError`, `Input`, `Button`                     |
| Segmentation Question                   | `ToggleGroup` as a segmented control                                       |
| Sticky CTA and every CTA                | `Button`, or a link styled with its `buttonVariants` where it scrolls      |
| The PDF preview in a Lead Ask           | `Card`, white, in the light palette                                        |

These stay plain, on purpose: a Data Source note is visible inline text (a popover would hide the trust it builds), the Key Insight's points are a list (an accordion would put the argument behind taps), and Delivery replaces the Lead Form inline (no toast, no dialog).

**The segmented control** is a rounded `accent` track with 4 px of padding, holding rounded options; the selected one is filled `brand` with `background` text.

**The Fee Calculator's bars** show what each fund leaves of the amount. The Twin's bar is full and `brand`, and the Bank Fund's is `signal` and stops at its share of the Twin's amount, the way Ad Variant B's creative draws them ([ads.md](../ads.md#visual-brief-1)).

**A Lead Ask** is a `block` band inset 16 px from the edges, with a 26 px radius. It holds, in order: "Tahák zdarma · PDF, 2 strany", the Lead Magnet's title, the PDF thumbnail beside its three numbered contents items, the email field, the red CTA with its label on the left and an arrow on the right, and the GDPR line.

**The Sticky CTA** is the same red button floating 16 px from the edges and above the safe area. It steps aside while the Lead Form or a Lead Ask is on screen. The page keeps enough bottom padding that it never covers a Data Source note.

## Motion

Motion only answers the Visitor's input: the Twin slides in when a Ticker is picked, and the Kč figure updates as the slider moves. It respects `prefers-reduced-motion`. Nothing animates because it scrolled into view.

## Icons

A lucide icon appears only where a primitive needs a functional glyph, such as a check mark or a chevron. The arrow on a CTA is lucide's `ArrowRight`, marked `data-icon="inline-end"` and `aria-hidden`.

## Ban list

`/code-review` reports each of these as a finding.

- shadcn's stock look left as installed: zinc or slate greys, Inter or Geist.
- A shadow of any kind, and a rounded card with a hairline border: rounding comes alone.
- Gradients, gradient text, glow or blur blobs, glassmorphism (`backdrop-blur`).
- The template hero: a "✨ New" pill, a centred headline, a subhead and two buttons.
- Grids of feature cards with an icon in a tinted circle or tile, clientelo.cz's own `.card .ic` included.
- Emoji used as icons or bullets, and decorative icons.
- Fade-in-on-scroll, animated counters, anything that moves without the Visitor's input.
- Testimonials, broker or bank logos, and unsourced claims ("10 000+ investorů"): every figure has a Data Source.
- Filler Czech copy: "Odemkněte potenciál", "bezproblémově", "posuňte své investice na další úroveň".
- A dark mode made by inverting the light one, or shadcn's stock zinc dark.

## Ad creatives

The Ad Variants' visual briefs ([ads.md](../ads.md)) use this identity, so the Ad and the First Screen read as one piece.
