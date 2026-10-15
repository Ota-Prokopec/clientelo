// Tests the Share Preview a real `vite build` produces: the Share Image it emits, and the Open Graph and X card tags in
// the built index.html, with absolute URLs a crawler can fetch. A removed tag, or an image a chat app drops, fails here.
import { parse, type HTMLElement } from 'node-html-parser'
import { build, type Rolldown } from 'vite'
import { beforeAll, describe, expect, it } from 'vitest'
import { SHARE_IMAGE_FILE_NAME } from '../../src/data/shareImageFile.ts'

/** The built files, keyed by their path in dist/. */
type BuiltFileByName = Map<string, Uint8Array | string>

/**
 * Runs the app's real build in memory and keeps its output.
 *
 * ```ts
 * await buildApp() // Map { 'index.html' => '<!doctype html>…', 'share-image.png' => Uint8Array, … }
 * ```
 */
const buildApp = async (): Promise<BuiltFileByName> => {
  const buildOutput = (await build({ logLevel: 'silent', build: { write: false } })) as Rolldown.RolldownOutput
  return new Map(
    buildOutput.output.map((builtFile) => [
      builtFile.fileName,
      builtFile.type === 'asset' ? builtFile.source : builtFile.code,
    ]),
  )
}

/**
 * A PNG's width and height, read from its IHDR chunk.
 *
 * ```ts
 * readPngSize(png) // { width: 1200, height: 630 }
 * ```
 */
const readPngSize = (png: Uint8Array): { width: number; height: number } => {
  const pngView = new DataView(png.buffer, png.byteOffset, png.byteLength)
  return { width: pngView.getUint32(16), height: pngView.getUint32(20) }
}

/**
 * The `content` of the head's one meta tag with that `property` or `name`. Fails the test when it's missing.
 *
 * ```ts
 * readMetaContent(head, 'og:type') // 'website'
 * ```
 */
const readMetaContent = (head: HTMLElement, propertyOrName: string): string => {
  const metaTags = head.querySelectorAll(`meta[property="${propertyOrName}"], meta[name="${propertyOrName}"]`)
  expect(metaTags, `one <meta> named ${propertyOrName}`).toHaveLength(1)
  const content = metaTags[0]?.getAttribute('content') ?? ''
  expect(content, `${propertyOrName}'s content`).not.toBe('')
  return content
}

/**
 * Whether a URL is absolute over HTTP(S), with no query string or fragment.
 *
 * ```ts
 * isCleanAbsoluteUrl('https://example.cz/')             // true
 * isCleanAbsoluteUrl('/share-image.png')                // false
 * isCleanAbsoluteUrl('https://example.cz/?utm_content=pain') // false
 * ```
 */
const isCleanAbsoluteUrl = (url: string): boolean => {
  if (!URL.canParse(url)) return false
  const { protocol, search, hash } = new URL(url)
  return ['http:', 'https:'].includes(protocol) && search === '' && hash === ''
}

describe('sharePreviewPlugin', () => {
  let builtFileByName: BuiltFileByName
  let head: HTMLElement

  beforeAll(async () => {
    builtFileByName = await buildApp()
    const indexHtml = builtFileByName.get('index.html')
    head = parse(typeof indexHtml === 'string' ? indexHtml : '').querySelector('head') ?? parse('<head></head>')
  }, 60_000)

  it('emits the Share Image at 1200 × 630, small enough for WhatsApp', () => {
    const shareImage = builtFileByName.get(SHARE_IMAGE_FILE_NAME)

    expect(shareImage).toBeInstanceOf(Uint8Array)
    if (!(shareImage instanceof Uint8Array)) return
    expect(readPngSize(shareImage)).toEqual({ width: 1200, height: 630 })
    expect(shareImage.byteLength).toBeLessThan(300_000)
  })

  it('describes the page in Open Graph tags, with the description the page already has', () => {
    expect(readMetaContent(head, 'og:type')).toBe('website')
    expect(readMetaContent(head, 'og:locale')).toBe('cs_CZ')
    expect(readMetaContent(head, 'og:title')).toBe('Evropská dvojčata amerických ETF')
    expect(readMetaContent(head, 'og:description')).toBe(readMetaContent(head, 'description'))
  })

  it('points og:url and the canonical link at the same absolute URL, with no query string', () => {
    const canonicalUrl = head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? ''

    expect(isCleanAbsoluteUrl(canonicalUrl)).toBe(true)
    expect(readMetaContent(head, 'og:url')).toBe(canonicalUrl)
  })

  it('points og:image at the emitted Share Image by an absolute URL on the same origin, with its size and alt', () => {
    const shareImageUrl = readMetaContent(head, 'og:image')

    expect(isCleanAbsoluteUrl(shareImageUrl)).toBe(true)
    expect(new URL(shareImageUrl).origin).toBe(new URL(readMetaContent(head, 'og:url')).origin)
    expect(new URL(shareImageUrl).pathname).toBe(`/${SHARE_IMAGE_FILE_NAME}`)
    expect(readMetaContent(head, 'og:image:width')).toBe('1200')
    expect(readMetaContent(head, 'og:image:height')).toBe('630')
    expect(readMetaContent(head, 'og:image:type')).toBe('image/png')
    expect(readMetaContent(head, 'og:image:alt')).toBe(
      'Místo VOO evropské dvojče SPYL. VOO v aplikaci nekoupíte. Dvojče ano.',
    )
  })

  it('asks X for a large card with the same alt', () => {
    expect(readMetaContent(head, 'twitter:card')).toBe('summary_large_image')
    expect(readMetaContent(head, 'twitter:image:alt')).toBe(readMetaContent(head, 'og:image:alt'))
  })
})
