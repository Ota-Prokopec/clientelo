// The error page a route renders when it fails or doesn't exist, in the page's Czech voice.
import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

/**
 * The Czech error page: a 404 says the page doesn't exist, anything else asks for a reload.
 *
 * ```tsx
 * // /nic → "Tahle stránka neexistuje"
 * ```
 */
export default function ErrorPage() {
  const error = useRouteError()
  const isNotFound = isRouteErrorResponse(error) && error.status === 404

  return (
    <main className="mx-auto grid max-w-xl gap-4 px-4 pt-12 pb-16">
      <h1 className="text-title text-heading">{isNotFound ? 'Tahle stránka neexistuje' : 'Něco se pokazilo'}</h1>
      <p>{isNotFound ? 'Odkaz je možná neúplný.' : 'Zkuste stránku načíst znovu.'}</p>
      <p>
        <Link to="/" className="font-bold text-brand underline underline-offset-4">
          Zpět na srovnání ETF
        </Link>
      </p>
    </main>
  )
}
