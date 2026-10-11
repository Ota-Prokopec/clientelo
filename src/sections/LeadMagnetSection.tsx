// The closing Section: the Lead Magnet, then the Lead Form. #13 adds the preview, the contents list and the Lead Form.
import styles from './Section.module.css'

/** The id the Sticky CTA scrolls to until the Lead Form (#13) exists. */
export const leadMagnetSectionId = 'lead-magnet'

/**
 * The Lead Magnet's title and promise, ahead of the closing Lead Form.
 *
 * ```tsx
 * <LeadMagnetSection /> // <section id="lead-magnet">…</section>
 * ```
 */
export function LeadMagnetSection() {
  return (
    <section id={leadMagnetSectionId} className={styles.section}>
      <h2 className={styles.heading}>Tahák: evropská dvojčata amerických ETF</h2>
      <p className={styles.lead}>
        Co koupit místo VOO, co stojí poplatek bankovního fondu za 20 let a jak na daně v Česku. Na dvou stranách,
        zdarma.
      </p>
      <div className={styles.slot} />
    </section>
  )
}
