// The page footer: every Data Source, the "not investment advice" disclaimer and the privacy-policy link.
import { Link } from 'react-router'
import { DataSourceNote } from '../components/DataSourceNote.tsx'
import { listDataSources } from '../data/figures.ts'
import { privacyPolicyPath } from '../routes/privacyPolicy.tsx'
import styles from './Footer.module.css'

/**
 * Lists the Data Source of every figure, the disclaimer and the GDPR link.
 *
 * ```tsx
 * <Footer /> // <footer id="footer">Nejde o investiční doporučení. … Zdroje: …</footer>
 * ```
 */
export function Footer() {
  return (
    <footer id="footer" className={styles.footer}>
      <p className={styles.disclaimer}>Nejde o investiční doporučení. Investování nese riziko ztráty.</p>
      <DataSourceNote sources={listDataSources()} />
      <p>
        <Link to={privacyPolicyPath}>Zásady ochrany osobních údajů</Link>
      </p>
    </footer>
  )
}
