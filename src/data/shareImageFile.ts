// The Share Image's built file: where vite-plugins/sharePreviewPlugin.ts serves it, and its size. index.html's
// `og:image:*` tags repeat the size. The plugin imports this module outside the app's aliases, so it imports nothing.

/** The Share Image's width in px, Open Graph's recommended 1.91:1. */
export const SHARE_IMAGE_WIDTH = 1200

/** The Share Image's height in px. */
export const SHARE_IMAGE_HEIGHT = 630

/** The largest Share Image in bytes that WhatsApp still shows. */
export const SHARE_IMAGE_MAX_BYTES = 300_000

/** The Share Image's file name in dist/. */
export const SHARE_IMAGE_FILE_NAME = 'share-image.png'

/** Where the Share Image is served, under its file name. */
export const SHARE_IMAGE_PATH = `/${SHARE_IMAGE_FILE_NAME}`
