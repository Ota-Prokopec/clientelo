// The privacy-policy page the Lead Form's GDPR sentence links to. A draft: its legal check is step 8 of docs/plan.md.
// The controller's identity and contact, and the paragraph on the Meta Pixel, wait for the employer's real legal data
// before an Ad launches (README.md#before-an-ad-launches).
import { Page } from '@/components/Page.tsx'
import { PolicyHeading } from '@/components/PolicyHeading.tsx'
import { QueryKeepingLink } from '@/components/QueryKeepingLink.tsx'
import { RuledFact } from '@/components/RuledFact.tsx'

/** The privacy policy's route, which the router mounts and the Lead Form and the Footer link to. */
export const PRIVACY_POLICY_PATH = '/ochrana-osobnich-udaju'

/**
 * The privacy policy: what the Lead Form collects, why, for how long, the Visitor's rights, and everything the page
 * stores on the Visitor's device.
 *
 * ```tsx
 * // /ochrana-osobnich-udaju → <PrivacyPolicy />
 * ```
 */
const PrivacyPolicy = () => {
  return (
    <Page>
      <main className="grid gap-4 pt-12 pb-16">
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
        <p>Pouze my a služby, které nám pomáhají stránku provozovat a e-maily rozesílat. Nikomu je neprodáváme.</p>
        <PolicyHeading>Vaše práva</PolicyHeading>
        <p>
          Máte právo na přístup ke svým údajům, jejich opravu a výmaz, právo vznést námitku a právo podat stížnost u
          Úřadu pro ochranu osobních údajů (uoou.gov.cz).
        </p>
        <PolicyHeading>Co ukládáme ve vašem zařízení</PolicyHeading>
        <p>
          Stránka si v úložišti vašeho prohlížeče (localStorage) drží nanejvýš tři krátké záznamy. Žádný neobsahuje váš
          e-mail ani nic, podle čeho by vás šlo poznat.
        </p>
        <dl className="grid gap-4">
          <RuledFact
            label="clientelo:lead"
            value="Odemčený tahák"
            explanation="Pamatuje si, že jste si tahák už stáhli, aby vám zůstal odemčený i při další návštěvě. Souhlas nepotřebuje, protože slouží jen k tomu, o co jste si sami řekli. Zůstává, dokud ho v prohlížeči nesmažete."
          />
          <RuledFact
            label="clientelo:consent"
            value="Vaše volba v liště o cookies"
            explanation="Pamatuje si, jestli jste ukládání povolili, nebo odmítli, a kdy. Souhlas nepotřebuje. Platí 12 měsíců, pak se vás zeptáme znovu."
          />
          <RuledFact
            label="clientelo:visited"
            value="Už jste tu byli"
            explanation="Pamatuje si, že jste stránku už navštívili, abychom v měření odlišili nové návštěvníky od vracejících se. Uloží se jen s vaším souhlasem a zůstává, dokud souhlas neodvoláte."
          />
        </dl>
        <p>
          Měření návštěvy, tedy co jste na stránce viděli a použili, zůstává jen ve vašem prohlížeči a nikam se
          neposílá. Zavřením stránky zmizí.
        </p>
        <p>
          Volbu můžete kdykoli změnit odkazem Nastavení cookies v patičce srovnání. Když ukládání odmítnete, záznam
          clientelo:visited smažeme.
        </p>
        <p>
          <QueryKeepingLink pathname="/" className="font-bold text-brand underline underline-offset-4">
            Zpět na srovnání ETF
          </QueryKeepingLink>
        </p>
      </main>
    </Page>
  )
}

export default PrivacyPolicy
