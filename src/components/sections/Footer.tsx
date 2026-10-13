// The page footer: every Data Source, the "not investment advice" disclaimer and the privacy-policy link.
// Its bottom padding keeps the last Data Source clear of the Sticky CTA.
import { Link } from 'react-router';
import { DataSourceNote } from '../DataSourceNote.tsx';
import { listDataSources } from '../../data/figures.ts';

/**
 * Lists the Data Source of every figure, the disclaimer and the GDPR link.
 *
 * ```tsx
 * <Footer /> // <footer id="footer">Nejde o investiční doporučení. … Zdroje: …</footer>
 * ```
 */
export const Footer = () => {
  return (
    <footer id="footer" className="mx-auto mt-16 max-w-xl px-4 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <div className="grid gap-3 border-t-2 border-heading pt-3">
        <p className="font-bold text-heading">Nejde o investiční doporučení. Investování nese riziko ztráty.</p>
        <DataSourceNote sources={listDataSources()} />
        <p className="text-label">
          <Link to={'/ochrana-osobnich-udaju'} className="underline underline-offset-2">
            Zásady ochrany osobních údajů
          </Link>
        </p>
      </div>
    </footer>
  );
};
