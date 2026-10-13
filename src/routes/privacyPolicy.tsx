// The privacy-policy page the Lead Form's GDPR sentence links to. A draft: its legal check is step 8 of docs/plan.md.
import { Link } from 'react-router'
import { PolicyHeading } from '../components/PolicyHeading.tsx'

/** The privacy-policy route's path. */
export const privacyPolicyPath = '/ochrana-osobnich-udaju'

/**
 * The privacy policy: what the Lead Form collects, why, for how long, and the Visitor's rights.
 *
 * ```tsx
 * // /ochrana-osobnich-udaju → <PrivacyPolicy />
 * ```
 */
export default function PrivacyPolicy() {
  return (
    <main className="mx-auto grid max-w-xl gap-4 px-4 pt-12 pb-16">
      <h1 className="text-title text-heading">Zásady ochrany osobních údajů</h1>
      <p>
        Když si stáhnete tahák, zpracováváme váš e-mail a případně vaši odpověď na otázku, kde investujete. Nic
        dalšího od vás nechceme.
      </p>
      <PolicyHeading>Proč</PolicyHeading>
      <p>
        E-mail použijeme k zaslání taháku a několika navazujících e-mailů o investování do ETF. Odpověď na otázku nám
        pomůže psát e-maily, které se vás týkají. Zpracování je založené na vašem souhlasu, který můžete kdykoli
        odvolat odkazem v každém e-mailu.
      </p>
      <PolicyHeading>Jak dlouho</PolicyHeading>
      <p>Údaje uchováváme, dokud se z odběru neodhlásíte. Pak je smažeme.</p>
      <PolicyHeading>Kdo je uvidí</PolicyHeading>
      <p>
        Pouze my a služby, které nám pomáhají stránku provozovat a e-maily rozesílat. Nikomu je neprodáváme.
      </p>
      <PolicyHeading>Vaše práva</PolicyHeading>
      <p>
        Máte právo na přístup ke svým údajům, jejich opravu a výmaz, právo vznést námitku a právo podat stížnost u
        Úřadu pro ochranu osobních údajů (uoou.gov.cz).
      </p>
      <p>
        <Link to="/" className="font-bold text-brand underline underline-offset-4">
          Zpět na srovnání ETF
        </Link>
      </p>
    </main>
  )
}
