// The error page a route renders when it fails or doesn't exist, in the page's Czech voice.
import { isRouteErrorResponse, useRouteError } from 'react-router'
import { Page } from '@/components/Page.tsx'
import { QueryKeepingLink } from '@/components/QueryKeepingLink.tsx'

/**
 * The Czech error page: a 404 says the page doesn't exist, anything else asks for a reload.
 *
 * ```tsx
 * // /nic → "Tahle stránka neexistuje"
 * ```
 */
const ErrorPage = () => {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <Page>
      <main className="grid gap-4 pt-12 pb-16">
        <h1 className="text-title text-heading">{isNotFound ? 'Tahle stránka neexistuje' : 'Něco se pokazilo'}</h1>
        <p>{isNotFound ? 'Odkaz je možná neúplný.' : 'Zkuste stránku načíst znovu.'}</p>
        <p>
          <QueryKeepingLink pathname="/" className="font-bold text-brand underline underline-offset-4">
            Zpět na srovnání ETF
          </QueryKeepingLink>
        </p>
      </main>
    </Page>
  )
}

export default ErrorPage
