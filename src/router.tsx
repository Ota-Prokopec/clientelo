import { createBrowserRouter } from 'react-router'
import Root from './routes/root.tsx'
import ErrorPage from './routes/error.tsx'
import Home from './routes/home.tsx'
import About, { loader as aboutLoader } from './routes/about.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: Home },
      { path: 'about', Component: About, loader: aboutLoader },
    ],
  },
])
