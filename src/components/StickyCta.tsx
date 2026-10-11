// The Sticky CTA: on a phone it takes the Visitor to the Lead Form from anywhere on the page.
// It steps aside while the Lead Form or an inline Lead Ask is on screen, and is gone once the Visitor is a Lead.
import { useEffect, useState } from 'react'
import styles from './StickyCta.module.css'

export type StickyCtaArgs = {
  /** The id of the element the CTA scrolls to: the Lead Form, or the closing Section until #13 adds it. */
  targetId: string
  isLead: boolean
}

/** The Lead Form and every inline Lead Ask (they carry `data-lead-ask`): while one is on screen, the Sticky CTA hides. */
const leadFormOrLeadAskSelector = '#lead-form, [data-lead-ask]'

/**
 * Whether any element matching the selector is at least partly on screen.
 * Reads the matches once on mount, since the page's Sections are static.
 *
 * ```ts
 * useIsAnyOnScreen('#lead-magnet') // true while the closing Section is in view
 * ```
 */
function useIsAnyOnScreen(selector: string): boolean {
  const [isAnyOnScreen, setIsAnyOnScreen] = useState(false)

  useEffect(() => {
    const onScreenElements = new Set<Element>()
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) onScreenElements.add(entry.target)
        else onScreenElements.delete(entry.target)
      }
      setIsAnyOnScreen(onScreenElements.size > 0)
    })
    for (const element of document.querySelectorAll(selector)) observer.observe(element)
    return () => observer.disconnect()
  }, [selector])

  return isAnyOnScreen
}

/**
 * The Sticky CTA, hidden while the Lead Form or a Lead Ask is on screen and removed once the Visitor is a Lead.
 *
 * ```tsx
 * <StickyCta targetId="lead-magnet" isLead={false} /> // <a id="sticky-cta" href="#lead-magnet">
 * <StickyCta targetId="lead-magnet" isLead />         // nothing
 * ```
 */
export function StickyCta({ targetId, isLead }: StickyCtaArgs) {
  const isLeadFormOrLeadAskOnScreen = useIsAnyOnScreen(`#${targetId}, ${leadFormOrLeadAskSelector}`)

  if (isLead) return null

  return (
    <a
      id="sticky-cta"
      href={`#${targetId}`}
      className={styles.stickyCta}
      data-hidden={isLeadFormOrLeadAskOnScreen}
      aria-hidden={isLeadFormOrLeadAskOnScreen}
      tabIndex={isLeadFormOrLeadAskOnScreen ? -1 : undefined}
    >
      Chci tahák zdarma
    </a>
  )
}
