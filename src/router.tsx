// The app's routes: the landing page at `/` and the privacy-policy page.
import { createBrowserRouter } from 'react-router'
import Root from './routes/root.tsx'
import ErrorPage from './routes/error.tsx'
import Home from './routes/home.tsx'
import PrivacyPolicy, { privacyPolicyPath } from './routes/privacyPolicy.tsx'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    ErrorBoundary: ErrorPage,
    children: [
      { index: true, Component: Home },
      { path: privacyPolicyPath, Component: PrivacyPolicy },
    ],
  },
])
