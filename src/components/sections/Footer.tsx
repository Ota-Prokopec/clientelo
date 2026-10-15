// The page footer: every Data Source, the "not investment advice" disclaimer, the privacy-policy link, and "Nastavení
// cookies", which reopens the Consent Bar so withdrawing consent is as easy as giving it.
// Its bottom padding keeps the last Data Source clear of the Sticky CTA.
import { Link } from 'react-router';
import { Button } from '@/components/ui/button';
import { consentBarId } from '../ConsentBar.tsx';
import { DataSourceNote } from '../DataSourceNote.tsx';
import { listDataSources } from '@data/figures.ts';

export type FooterProps = {
  /** Reopens the Consent Bar. */
  onConsentSettingsOpen: () => void;
};

/**
 * Lists the Data Source of every figure, the disclaimer, the GDPR link and the way back to the Consent Bar.
 *
 * ```tsx
 * <Footer onConsentSettingsOpen={openConsentBar} />
 * // <footer id="footer">Nejde o investiční doporučení. … Zdroje: …
 * //   Zásady ochrany osobních údajů  [Nastavení cookies]</footer>; the button calls openConsentBar()
 * ```
 */
export const Footer = ({ onConsentSettingsOpen }: FooterProps) => {
  return (
    <footer id="footer" className="mt-16 pb-[calc(7rem+env(safe-area-inset-bottom))]">
      <div className="grid gap-3 border-t-2 border-heading pt-3">
        <p className="font-bold text-heading">Nejde o investiční doporučení. Investování nese riziko ztráty.</p>
        <DataSourceNote sources={listDataSources()} />
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-label">
          <Link to={'/ochrana-osobnich-udaju'} className="underline underline-offset-2">
            Zásady ochrany osobních údajů
          </Link>
          {/* A button, since it opens the bar rather than going anywhere, set like the link beside it. */}
          <Button
            variant="link"
            aria-controls={consentBarId}
            onClick={onConsentSettingsOpen}
            className="h-auto p-0 text-foreground underline underline-offset-2"
          >
            <span className="text-label">Nastavení cookies</span>
          </Button>
        </p>
      </div>
    </footer>
  );
};
