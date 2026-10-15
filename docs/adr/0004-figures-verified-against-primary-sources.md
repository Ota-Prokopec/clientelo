# Figures verified against their primary sources

The page, the Lead Magnet PDF, the Ads and the Welcome Emails show figures (a TER, an ISIN, a tax threshold) and cite claims (why the apps won't sell a US ETF). A Visitor, a Lead or a reviewer must be able to check each one, and to see when it was last true. The data module gives every figure a Data Source ([ADR-0002](./0002-lead-magnet-pdf-generated-from-data-module.md)), and we verify each figure by reading it on its primary source. These rules hold for every figure added later:

- **A Data Source is the figure's primary source**, the party that sets or publishes it:

  | Figure                | Its Data Source's URL                                                                                                                  |
  | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
  | An ETF or a UCITS ETF | The issuer's fund page, which shows TER, ISIN, domicile, distribution policy and listings in one place and stays put across KID revisions |
  | A Bank Fund           | Its KID PDF                                                                                                                            |
  | Czech tax law         | e-Sbírka                                                                                                                               |
  | US estate tax         | irs.gov                                                                                                                                |
  | PRIIPs                | EUR-Lex                                                                                                                                |
  | ČNB                   | cnb.cz                                                                                                                                 |
  | What a broker sells   | That broker's own help centre or, when it is silent, its team's reply on its own community, dated in the source's name                 |

- **A figure is verified by reading it there.** `url` holds the page it was read on, and `verifiedOn` the ISO date it was read. A figure that can't be read there, for example behind a country or investor-type gate, stays unverified. It is never taken from a secondary site instead.
- **The evidence is a verbatim quote in the PR** that verifies the figure: the URL and the line that states it.
- **An aggregator is never a Data Source**, however convenient: justETF, finex.cz or zakonyprolidi.cz.
- **Copy is in our own words.** Page and PDF copy never reproduces a source's wording. Figures are cited, and verbatim quotes appear only in a PR's evidence.

A Bank Fund's TER is the KID's ongoing costs ("poplatky za vedení a jiné správní nebo provozní náklady", % p.a.), without entry fees or transaction costs.

## Considered Options

- **An aggregator such as justETF.** All funds in one place with one layout, but it's a secondary source that can lag the issuer, and a figure taken from it inherits its errors.
- **A live data feed.** Figures that never go stale, but an API, a key and its failure handling are out of proportion for one landing page whose figures change a few times a year.

## Consequences

- A figure changes only in a commit that rereads its source, so `verifiedOn` always says how old a figure is. The build sets no age limit on it, so an old `verifiedOn` never fails the build.
- The unverified machinery stays for a figure added before it is verified: `unverifiedSource`, `isVerified`, the PDF's `*` marker and "Pracovní verze" banner, and "zatím neověřeno" on the page.
- A verified figure that breaks a claim the copy makes ("SPYL stojí stejně jako VOO", "kolem 2 %") isn't silently reworded: the claim is decided before the figure lands.
