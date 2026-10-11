import { isRouteErrorResponse, Link, useRouteError } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()

  let title = 'Something went wrong'
  let message = 'An unexpected error occurred.'
  if (isRouteErrorResponse(error)) {
    title = `${error.status} ${error.statusText}`
    message = error.status === 404 ? 'This page does not exist.' : String(error.data)
  } else if (error instanceof Error) {
    message = error.message
  }

  return (
    <main>
      <h1>{title}</h1>
      <p>{message}</p>
      <Link to="/">Go home</Link>
    </main>
  )
}
