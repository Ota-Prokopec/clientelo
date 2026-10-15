// Downloads a file the page serves, and resolves only once the browser has been handed it, so the automatic
// pdf_download Funnel Event records a download that happened. A failed fetch rejects. react-use-downloader's own hook
// resolves either way, so only its save step, jsDownload, is used.
import { jsDownload } from 'react-use-downloader'

/**
 * Fetches `filePath` and saves it as `fileName`.
 *
 * ```ts
 * await downloadFile('/tahak.pdf', 'tahak.pdf') // the browser saves tahak.pdf
 * await downloadFile('/missing.pdf', 'x.pdf')   // rejects: 404 /missing.pdf
 * ```
 */
export const downloadFile = async (filePath: string, fileName: string): Promise<void> => {
  const response = await fetch(filePath)
  if (!response.ok) throw new Error(`${response.status} ${filePath}`)
  jsDownload(await response.blob(), fileName)
}
