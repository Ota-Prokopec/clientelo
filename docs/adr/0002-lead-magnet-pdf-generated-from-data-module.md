# Lead Magnet PDF generated from the page's data module

The Lead Magnet PDF repeats the page's figures (Tickers, ISINs, TERs, the bank fund's TER), each with a Data Source, and step 4 of [plan.md](../plan.md) verifies them only after the page is built. We generate the PDF at build time from the same data module the page renders (e.g. with `@react-pdf/renderer`), instead of hand-designing a static file in `public/`. A figure then can't drift between the page and the PDF, and step 4's edits reach both without touching the PDF by hand.

## Considered Options

- **A hand-designed static PDF.** Finer typesetting, but every data change means re-exporting the file by hand, and a stale figure in a download the Lead keeps breaks the brief's "real data with sources".

## Consequences

- The PDF's layout is limited to what the generator can render, so it shares the page's design identity only through its colours, type and spacing, not pixel for pixel.
- The build depends on the PDF generator. A failure there fails the build, which is the point: no deploy ships a PDF that disagrees with the page.
