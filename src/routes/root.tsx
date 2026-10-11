import { NavLink, Outlet, useNavigation } from 'react-router'

export default function Root() {
  const navigation = useNavigation()

  return (
    <>
      <header>
        <nav>
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
      </header>
      <main className={navigation.state === 'loading' ? 'loading' : ''}>
        <Outlet />
      </main>
    </>
  )
}
