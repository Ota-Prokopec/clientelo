// The Share Image (design-identity.md#share-image): Ad Variant A's Ad Promise as the page's First Screen sets it, VOO
// struck out over its Twin SPYL under the headline, in the light palette. satori lays it out, so it styles with inline
// flexbox styles instead of Tailwind classes, from the same tokens. It carries no figure, since a figure on it couldn't
// carry its Data Source.
import type { CSSProperties } from 'react'
import { SHARE_IMAGE_HEIGHT, SHARE_IMAGE_WIDTH } from '@data/shareImageFile.ts'
import { fontFileFamilies } from '@/design/fontFiles.ts'
import { lightColourByRole } from '@/design/tokens.ts'
import { findSubstitutes } from '@lib/substitutes.ts'

/** The column everything sits in, inside the central square that WhatsApp and iMessage crop to, with a margin. */
const CONTENT_WIDTH = SHARE_IMAGE_HEIGHT - 2 * 48

/** A giant Ticker: the page's `ticker` role, scaled up to the image. */
const tickerStyle: CSSProperties = {
  fontSize: 176,
  fontWeight: 900,
  lineHeight: 0.82,
  letterSpacing: '-0.06em',
}

/** A 2 px rule in `heading` run out to both edges, the way the page's grid separates figures (design-identity.md#layout). */
const ruleStyle: CSSProperties = {
  width: SHARE_IMAGE_WIDTH,
  height: 2,
  marginLeft: -(SHARE_IMAGE_WIDTH - CONTENT_WIDTH) / 2,
  backgroundColor: lightColourByRole.heading,
}

/**
 * The Share Image: VOO struck out in grey under a `signal` bar, SPYL in `brand`, then the headline, ruled apart.
 *
 * ```tsx
 * <ShareImage /> // 1200 × 630: VOO (struck) / SPYL / VOO v aplikaci nekoupíte. Dvojče ano.
 * ```
 */
export const ShareImage = () => {
  const {
    etf,
    substitutes: [firstTwin],
  } = findSubstitutes('VOO')

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        backgroundColor: lightColourByRole.background,
        fontFamily: fontFileFamilies.map(({ family }) => `'${family}'`).join(', '),
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', width: CONTENT_WIDTH }}>
        <div style={{ display: 'flex', position: 'relative', alignSelf: 'flex-start', paddingBottom: 20 }}>
          <span style={{ ...tickerStyle, color: lightColourByRole['muted-foreground'] }}>{etf.ticker}</span>
          <div
            style={{
              position: 'absolute',
              left: -16,
              right: -16,
              top: '38%',
              height: 20,
              borderRadius: 9999,
              backgroundColor: lightColourByRole.signal,
              transform: 'rotate(-6deg)',
            }}
          />
        </div>
        <div style={ruleStyle} />
        <span style={{ ...tickerStyle, color: lightColourByRole.brand, paddingTop: 28, paddingBottom: 20 }}>
          {firstTwin?.ticker}
        </span>
        <div style={ruleStyle} />
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            paddingTop: 28,
            fontSize: 60,
            fontWeight: 900,
            lineHeight: 0.95,
            letterSpacing: '-0.045em',
            color: lightColourByRole.heading,
          }}
        >
          {etf.ticker} v aplikaci nekoupíte.&nbsp;<span style={{ color: lightColourByRole.brand }}>Dvojče ano.</span>
        </div>
      </div>
    </div>
  )
}
