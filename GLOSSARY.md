# clientelo

A mobile-first lead-magnet landing page that compares NYSE-traded ETFs for Czech retail investors arriving from an ad, and trades that value for their contact. See [docs/brief.md](./docs/brief.md).

## Language

### Acquisition

**Visitor**:
A person on the page who hasn't submitted the Lead Form yet. They are assumed to be on a phone, arriving from an Ad, and giving the page a few seconds.
_Avoid_: User, customer, client.

**Lead**:
A Visitor who has submitted the Lead Form, together with the contact they left.
_Avoid_: Contact, subscriber, conversion (for the person).

**Lead Magnet**:
The value the page promises and hands over in exchange for a contact, which the Visitor can see before filling in the Lead Form.
_Avoid_: Freebie, incentive, gift.

**Ad**:
A paid social or display ad that sends Visitors to the page. Each one is an Ad Variant, identified on arrival by its UTM parameters.
_Avoid_: Campaign (a campaign holds many Ads), creative.

**Ad Variant**:
One of the two Ad versions the brief requires, each making its own Ad Promise.
_Avoid_: Ad A/B, version.

**Ad Promise**:
What an Ad Variant tells the Visitor they will get by clicking. The First Screen has to repeat and keep it.
_Avoid_: Hook, headline (a headline is copy on the page).

### Page

**First Screen**:
What a Visitor sees on a phone before scrolling. It delivers the Ad Promise and the Lead Magnet.
_Avoid_: Hero, above the fold, header.

**Section**:
One full-width block of the page, in the order the README justifies.
_Avoid_: Block, panel, slide.

**Interactive Tool**:
A section the Visitor operates, such as an ETF comparison, a fee calculator or a portfolio builder. Each one shows part of the value up front and ends in a route to the Lead Form.
_Avoid_: Widget, calculator (unless it is one), feature.

**Lead Form**:
The form that turns a Visitor into a Lead, with as few fields as possible. There is one Lead Form, even if several sections open it.
_Avoid_: Signup form, contact form, opt-in.

**Lead Ask**:
The moment and place the page asks for the contact, chosen so the Lead Magnet's value is already visible.
_Avoid_: CTA (a CTA is any button), gate, popup.

**Delivery**:
What a Lead receives once the Lead Form is submitted: the on-page confirmation and anything sent to their contact.
_Avoid_: Thank-you page, reward.

### Measurement

**Funnel**:
The measured journey from arrival to Lead Form submission, as an ordered list of Funnel Events.
_Avoid_: Journey, pipeline.

**Funnel Event**:
One tracked step in the Funnel, such as arrival, a First Screen view, a Section view, Interactive Tool use, Lead Form open or Lead Form submit. It carries the Ad Variant.
_Avoid_: Hit, ping, analytics event (when it is a Funnel step).

**Conversion Rate**:
Leads divided by Visitors who arrived, per Ad Variant unless stated otherwise.
_Avoid_: CR, conversion (for the ratio).

**A/B Hypothesis**:
A testable claim that changing one thing on the page moves the Conversion Rate, with its expected impact. The README ranks three of them.
_Avoid_: Experiment idea, test.

### Data

**ETF**:
An exchange-traded fund listed on the NYSE, identified by its Ticker.
_Avoid_: Fund (alone), index fund.

**Ticker**:
The NYSE symbol of an ETF, such as `VOO`.
_Avoid_: Symbol, code, ISIN (an ISIN is a different identifier).

**TER**:
An ETF's total expense ratio: its yearly cost as a percentage of the money invested.
_Avoid_: Expense ratio, fee (alone), management fee.

**Data Source**:
The cited origin of a figure shown on the page, with the date it was taken. Every figure has one.
_Avoid_: Reference, provider.
