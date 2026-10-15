# Funnel Events land in the dataLayer only

The brief asks us to measure the whole journey, from arrival to the Lead Form's submission, and step 5 of [plan.md](../plan.md) first suggested sending each Funnel Event to GA4, the Meta Pixel and an endpoint of our own. The page is frontend only, with no external tool, so it has no analytics backend. Each Funnel Event is pushed to `window.dataLayer`, an in-page array that sends nothing anywhere, as `{ event: '<name>', ...properties }`, through one seam, `trackFunnelEvent()`. In `pnpm dev`, each one is also logged to the console. The events, their properties and the Funnel are listed in the [README](../../README.md#funnel).

## Considered Options

Each one was left out because it would send the Visitor's data to a service outside the page:

- **GA4.** The usual reader of a `dataLayer`, but it is an external tool, sets cookies, and needs the Visitor's consent before it loads.
- **PostHog.** Funnels and session replay out of the box, through an external service, with the same consent requirement.
- **Umami.** Cookieless and lighter, but still a hosted service (or a server of our own to run it) receiving every Visit.
- **Vercel Web Analytics.** Built into the hosting, but it is still an external collector of every Visit.
- **An endpoint of our own.** A serverless function storing events would be a backend to build, secure and keep, for a page that has none until step 7's `/api/lead`.
- **The Meta Pixel.** The Ads would optimise on its `Lead` event, but it is Meta's tracker, it needs consent, and it needs the employer's real legal data in the privacy policy before an Ad launches.

## Consequences

- Nothing is stored outside the Visitor's browser, so measurement needs no consent, and there is no reporting across Visitors: the events can be read only in the browser, as `window.dataLayer`.
- Adding a tool later takes a tag that reads the `dataLayer`, such as Google Tag Manager or the Meta Pixel mapping `lead_form_success` to `Lead`, loaded only after the Visitor allows it in a consent bar. No component changes, since every one already records through `trackFunnelEvent()`.
- Every Funnel Event and its properties are one typed union, so a misspelt event or a missing property fails `pnpm check-types`, and a future tag can rely on the event names.
