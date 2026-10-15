// Tests downloadFile(): it saves a served file and resolves, and rejects when the fetch fails, so the automatic
// pdf_download Funnel Event is recorded only for a download that happened.
import { afterEach, describe, expect, it, vi } from 'vitest'

const { jsDownload } = vi.hoisted(() => ({ jsDownload: vi.fn() }))
vi.mock('react-use-downloader', () => ({ jsDownload }))

const { downloadFile } = await import('@lib/downloadFile.ts')

describe('downloadFile', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    jsDownload.mockClear()
  })

  it('saves the fetched file under its name', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('%PDF-1.7')),
    )

    await expect(downloadFile('/tahak.pdf', 'tahak.pdf')).resolves.toBeUndefined()
    expect(jsDownload).toHaveBeenCalledWith(expect.any(Blob), 'tahak.pdf')
  })

  it('rejects, and saves nothing, when the server answers with an error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => new Response('Not Found', { status: 404 })),
    )

    await expect(downloadFile('/missing.pdf', 'missing.pdf')).rejects.toThrow('404 /missing.pdf')
    expect(jsDownload).not.toHaveBeenCalled()
  })

  it('rejects when the network fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn(async () => Promise.reject(new TypeError('Failed to fetch'))),
    )

    await expect(downloadFile('/tahak.pdf', 'tahak.pdf')).rejects.toThrow('Failed to fetch')
  })
})
