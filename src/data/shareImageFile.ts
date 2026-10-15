// The Share Image's built file: where vite-plugins/sharePreviewPlugin.ts serves it, and its size. index.html's
// `og:image:*` tags repeat the size. The plugin imports this module outside the app's aliases, so it imports nothing.

/** The Share Image's width in px, Open Graph's recommended 1.91:1. */
export const shareImageWidth = 1200

/** The Share Image's height in px. */
export const shareImageHeight = 630

/** The largest Share Image in bytes that WhatsApp still shows. */
export const shareImageMaxBytes = 300_000

/** The Share Image's file name in dist/. */
export const shareImageFileName = 'share-image.png'

/** Where the Share Image is served, under its file name. */
export const shareImagePath = `/${shareImageFileName}`
