import { useLoaderData } from 'react-router'

export async function loader() {
  return { loadedAt: new Date().toLocaleTimeString() }
}

export default function About() {
  const { loadedAt } = useLoaderData<typeof loader>()

  return (
    <>
      <h1>About</h1>
      <p>Data loaded by the route loader at {loadedAt}.</p>
    </>
  )
}
