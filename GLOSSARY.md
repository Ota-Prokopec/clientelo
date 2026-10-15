# clientelo

A mobile-first lead-magnet landing page that compares NYSE-traded ETFs for Czech retail investors arriving from an ad, and trades that value for their contact. See [docs/brief.md](./docs/brief.md).

## Language

### Acquisition

**Visitor**:
A person on the page who hasn't submitted the Lead Form yet. They are assumed to be on a phone, arriving from an Ad, and giving the page a few seconds.
_Avoid_: User, customer, client.

**Lead**:
A Visitor who has submitted the Lead Form, together with the contact they left. A new Lead submitted it on this visit; a returning Lead is one the page remembers from an earlier visit, by a flag in their browser that holds no contact.
_Avoid_: Contact, subscriber, conversion (for the person).

**Lead Magnet**:
The value the page promises and hands over in exchange for a contact, which the Visitor can see before filling in the Lead Form.
_Avoid_: Freebie, incentive, gift.

**Chapter**:
One numbered part of the Lead Magnet PDF, such as the Twin table or the Czech taxes. Every Lead Ask lists Chapters by their number, so the Visitor sees what they get before they type.
_Avoid_: Section (a Section is a block of the page), page (the PDF has two).

**Ad**:
A paid social or display ad that sends Visitors to the page. Each one is an Ad Variant, identified on arrival by its UTM parameters.
_Avoid_: Campaign (a campaign holds many Ads), creative.

**Ad Variant**:
One of the two Ad versions the brief requires, each making its own Ad Promise.
_Avoid_: Ad A/B, version.

**Ad Promise**:
What an Ad Variant tells the Visitor they will get by clicking. The First Screen has to repeat and keep it.
_Avoid_: Hook, headline (a headline is copy on the page).

**App Investor**:
The persona Ad Variant A targets: invests through XTB, Trading 212 or Revolut, wants a US ETF such as VOO, and has been refused it. See [docs/strategy.md](./docs/strategy.md).
_Avoid_: Young investor, retail user, target group (alone).

**Bank-Fund Saver**:
The persona Ad Variant B targets: holds an equity fund from their bank or a robo-advisor, and has never picked an ETF.
_Avoid_: Bank client, beginner.

**Key Insight**:
The one fact the page tells the Visitor that their broker doesn't: why they can't buy a US ETF, and that its Twin does the same job. Its wording lives in [docs/strategy.md](./docs/strategy.md).
_Avoid_: USP, hook, value proposition.

### Page

**Page**:
Everything one route renders, such as the landing page or the privacy policy, in the one centred column every route shares.
_Avoid_: Screen (a First Screen is only what a phone shows before scrolling), view, layout.

**First Screen**:
What a Visitor sees on a phone before scrolling. It delivers the Ad Promise and the Lead Magnet. The Ad Variant chooses which First Screen the Visitor sees.
_Avoid_: Hero, above the fold, header.

**Section**:
One full-width block of the page, in the order the README justifies.
_Avoid_: Block, panel, slide.

**Interactive Tool**:
A section the Visitor operates, such as an ETF comparison, a fee calculator or a portfolio builder. Each one shows part of the value up front and ends in a route to the Lead Form.
_Avoid_: Widget, calculator (unless it is one), feature.

**Fund Picker**:
The Interactive Tool where the Visitor picks an ETF and sees its Twin, or its closest alternative where no Twin exists.
_Avoid_: Fund comparison, selector, search.

**Fee Calculator**:
The Interactive Tool that shows, in Kč, what a bank fund's TER costs against a Twin's over a number of years, for a one-off amount.
_Avoid_: Calculator (alone), savings calculator, return calculator.

**Lead Form**:
The form that turns a Visitor into a Lead, with as few fields as possible. There is one Lead Form, even if several sections open it.
_Avoid_: Signup form, contact form, opt-in.

**Lead Ask**:
The moment and place the page asks for the contact, chosen so the Lead Magnet's value is already visible.
_Avoid_: CTA (a CTA is any button), gate, popup.

**Delivery**:
What a Lead receives once the Lead Form is submitted: the PDF's download and its link, Chapters 2 and 3 unlocked on the page, the Segmentation Question, and the Welcome Emails sent to their contact.
_Avoid_: Thank-you page, reward.

**Segmentation Question**:
The one optional question a new Lead is asked during Delivery: where they invest. Their answer is their Segment.
_Avoid_: Survey, profiling, onboarding.

**Segment**:
A Lead's answer to the Segmentation Question, such as XTB, a bank fund or "Zatím nikde". It picks their Day 5 Welcome Email.
_Avoid_: Answer, category, broker (a bank fund and "nowhere yet" are Segments too).

**Welcome Email**:
One of the three emails a new Lead receives during Delivery, on day 0, 2 and 5. Their copy is in [docs/welcome-emails.md](./docs/welcome-emails.md).
_Avoid_: Newsletter, drip, nurture sequence.

**Sticky CTA**:
The button that stays on screen on a phone and takes the Visitor to the Lead Form from anywhere on the page.
_Avoid_: Floating button, FAB, sticky bar.

**Share Preview**:
The card a social app or chat shows when someone shares the page's link, built from its Open Graph tags: the Share Image, title and description.
_Avoid_: OG card, link preview, unfurl, thumbnail (the Lead Magnet has a thumbnail).

**Share Image**:
The 1200 × 630 image in the Share Preview, rendered at build time from code.
_Avoid_: OG image, social image.

### Measurement

**Visit**:
One page load, from arrival until the Visitor leaves. A reload is a new Visit. Some Funnel Events are recorded only once per Visit.
_Avoid_: Session, pageview.

**Funnel**:
The measured journey from arrival to Lead Form submission, in four steps: arrival → Lead Form seen → Lead Form start → Lead Form success. It counts Visitors only, never a returning Lead, and its last step is the Conversion Rate. Interactive Tool use is a breakdown of it, not a step. See [README.md](./README.md#funnel).
_Avoid_: Journey, pipeline.

**Funnel Event**:
One tracked moment of a Visit, pushed to the in-page `dataLayer` with the Visit's Ad Variant, UTM parameters and who arrived (a new Visitor or a returning Lead): arrival, Section view, Interactive Tool use, Lead Ask click, Lead Form seen, Lead Form start, Lead Form submit, Lead Form success, Lead Form error, PDF download and Segment answer. It never carries the Lead's email. See [ADR-0005](./docs/adr/0005-funnel-events-in-the-datalayer-only.md).
_Avoid_: Hit, ping, analytics event (when it is a Funnel step), Lead Form open (a tap that opens the Lead Form is a Lead Ask click).

**Conversion Rate**:
Leads divided by Visitors who arrived, per Ad Variant unless stated otherwise. Per Ad Variant, it counts only arrivals whose `utm_content` named that Ad Variant, so a Visitor without UTMs, who sees the `pain` First Screen, doesn't count for Ad Variant A.
_Avoid_: CR, conversion (for the ratio).

**A/B Hypothesis**:
A testable claim that changing one thing on the page moves the Conversion Rate, with its expected impact. The README ranks three of them.
_Avoid_: Experiment idea, test.

### Data

**ETF**:
An exchange-traded fund listed on the NYSE, identified by its Ticker.
_Avoid_: Fund (alone), index fund.

**Ticker**:
The exchange symbol of an ETF, such as `VOO`, or of a UCITS ETF, such as `SPYL`.
_Avoid_: Symbol, code, ISIN (an ISIN is a different identifier).

**TER**:
An ETF's total expense ratio: its yearly cost as a percentage of the money invested. A Bank Fund's TER is its KID's ongoing costs, without entry fees or transaction costs.
_Avoid_: Expense ratio, fee (alone), management fee.

**Twin**:
A UCITS ETF that tracks the same index as an ETF, which a Czech retail investor can buy instead. A fund on a merely similar index is a closest alternative, never a Twin.
_Avoid_: Equivalent, clone, European version, alternative (for an exact match).

**UCITS ETF**:
An exchange-traded fund registered under EU rules (UCITS), which a Czech retail investor's app can sell. Each one the page shows is an ETF's Twin or its closest alternative.
_Avoid_: European ETF, EU fund.

**Substitute**:
A UCITS ETF standing in for an ETF: either its Twin, or its closest alternative where no Twin exists.
_Avoid_: Replacement, match.

**Bank Fund**:
An equity fund a bank sells its clients, such as ČSOB Akciový, whose TER the Fee Calculator compares with a Twin's.
_Avoid_: Mutual fund, bank product.

**Data Source**:
The primary source of a figure the page, the Lead Magnet, the Ads or the Welcome Emails show: the party that sets or publishes it, such as the issuer's fund page for an ETF. It holds the date the figure was verified there, or none while it is unverified. An aggregator such as justETF is never one. Every figure has one, and a figure computed from others, such as the typical Bank Fund TER behind "kolem 2 %", cites each of theirs. See [ADR-0004](./docs/adr/0004-figures-verified-against-primary-sources.md).
_Avoid_: Reference, provider.
