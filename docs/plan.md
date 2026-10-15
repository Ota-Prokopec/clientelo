# Plan

The steps for delivering the page in [brief.md](./brief.md), translated from the original Czech. Each step is one part of the work, in the order it should be done.

## 1. Strategy (before any design)

- **Target group.** A concrete persona, not "a small investor": 25–40 years old, invests through an app (XTB, Trading 212, Revolut, Portu), has seen VOO or SPY on YouTube or Reddit, and has most likely found out that the broker won't sell it to them.
- **Key insight.** A Czech retail investor usually can't buy a US ETF listed on the NYSE, because PRIIPs regulation requires a KID document that US issuers don't publish. European "twins" (UCITS ETFs) exist instead. For example, SPYL costs 0.03 % a year, the same as VOO. Competitors don't communicate this.
- **Lead Magnet.** A PDF cheat sheet "US ETFs → European twins + taxes in the Czech Republic": ISINs, TERs, the 3-year holding-period tax exemption, and the US estate tax on holdings over $60,000.
- **Lead Ask.** Right after the Visitor sees a result, when they are most engaged: after picking a fund, or after a calculation in the fee calculator.

## 2. Two Ad Variants

- **A (pain):** "Your broker won't let you buy VOO? Here's why, and what to buy instead for the same fee."
- **B (money):** "A bank fund charges around 2 % a year, an ETF 0.03 %. Work out the difference over 20 years."

For each one, write the text, the visual and the CTA, and decide which First Screen variant it leads to (through `utm_content`).

## 3. The page (mobile-first)

- **First Screen.** A headline that follows on from the Ad and immediate value without scrolling, e.g. VOO preselected with its twin shown.
- **Interactive Tools**, each ending in a Lead Ask:
  - fund picker → its twin
  - fee calculator → the Lead Form
- **Lead Form.** Email only, plus a hidden honeypot field against bots. Below it, a sentence about GDPR and unsubscribing.
- **Value visible before the Lead Form.** A preview of the PDF and a list of what it contains.
- **Delivery**, after submitting:
  - the PDF downloads immediately
  - content unlocks directly on the page
  - one question, "Where do you invest?", for segmentation
  - a series of welcome emails
- **Trust.** Every figure has a Data Source and the date it was verified, plus a "not investment advice" disclaimer.
- **Design.** Its own identity, not a template. A sticky CTA on mobile.

## 4. Real data with sources

TERs verified from the issuers' official pages:

| US ETF | TER      | European twin | TER    |
| ------ | -------- | ------------- | ------ |
| VOO    | 0.03 %   | SPYL          | 0.03 % |
| IVV    | 0.03 %   | CSPX          | 0.07 % |
| SPY    | 0.0945 % | VWCE          | 0.19 % |
| VTI    | 0.03 %   | FWRA          | 0.15 % |
| VT     | 0.06 %   |               |        |

The twins in the right-hand column are **not** paired with the ETF on the same row: these are two separate lists. For the bank comparison, the equity fund ČSOB Akciový has a TER of 2.22 %.

## 5. Measuring the whole Funnel

Funnel Events to track:

- arrival with UTM parameters
- the first view of each Section
- use of the fund picker and the fee calculator
- a tap on a Lead Ask or the sticky CTA
- Lead Form view, start of typing, submit, success and error
- PDF download, and the answer to the segmentation question

They go to the in-page `dataLayer` only: no GA4, no Meta Pixel and no endpoint of our own ([ADR-0005](./adr/0005-funnel-events-in-the-datalayer-only.md)). Funnel: arrival → Lead Form seen → started typing → success, counting Visitors only. Interactive Tool use is a breakdown of the Funnel, not a step. The events and the Funnel are listed in the [README](../README.md#funnel).

## 6. README

- Justify the order of the Sections.
- State the expected Conversion Rate: realistically 15–30 % of visits for a Lead Magnet from paid mobile ads, depending on targeting quality.
- Three A/B Hypotheses ranked by impact, for example:
  - headline A vs. B
  - Lead Form above vs. below the fee calculator
  - PDF vs. an email mini-course as the Lead Magnet

## 7. Deployment

Push the repo to GitHub and import it into Vercel (free tier). A serverless function `/api/lead` forwards each Lead to an email tool, such as Ecomail or SmartEmailing.

## 8. Before launching the Ad

- Check the GDPR text and the privacy policy.
- Verify that the investment Ad complies with Meta's and Google's ad policies.
- Test the Lead Form and the measurement on a real phone.
