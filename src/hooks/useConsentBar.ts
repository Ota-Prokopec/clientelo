// When the Consent Bar is open, and what a choice in it does (#51). With no valid choice stored, the bar opens on the
// Visitor's first scroll or first Interactive Tool use, so the First Screen's Ad Promise lands uncovered. The footer's
// "Nastavení cookies" reopens it, so withdrawing is as easy as giving. A choice is stored with its date, and the
// remembered Visit follows it: stored once the Visitor allows it, removed once they refuse or withdraw.
import { useEffect, useState } from 'react'
import { readConsentChoice, rememberConsentChoice, type ConsentChoice } from '@/consent/consentChoice.ts'
import { syncRememberedVisit } from '@/consent/rememberedVisit.ts'
import { subscribeToFunnelEvents } from '@/funnel/trackFunnelEvent.ts'

/** The Consent Bar's state, and the two ways the page changes it. */
export type ConsentBarState = {
  isConsentBarOpen: boolean
  /** Opens the bar again, from the footer's "Nastavení cookies". */
  openConsentBar: () => void
  /** Stores the Visitor's choice, brings the remembered Visit in line with it, and closes the bar. */
  chooseConsent: (consentChoice: ConsentChoice) => void
}

/**
 * The Consent Bar's state for the landing page: closed until the Visitor's first scroll or Interactive Tool use, and
 * never opened on its own while a choice under 12 months old is stored.
 *
 * ```ts
 * const { isConsentBarOpen, openConsentBar, chooseConsent } = useConsentBar()
 * // first Visit: false, then true on the first scroll or tap on a Ticker
 * chooseConsent('granted') // clientelo:consent and clientelo:visited stored; isConsentBarOpen false
 * openConsentBar()         // true again; chooseConsent('denied') then removes clientelo:visited
 * ```
 */
export const useConsentBar = (): ConsentBarState => {
  const [isConsentBarOpen, setIsConsentBarOpen] = useState(false)

  useEffect(() => {
    if (readConsentChoice(new Date()) !== null) return

    // Aborting stops both triggers, so the bar asks once per Visit and never reopens on its own after a choice.
    const consentBarTriggerController = new AbortController()
    /**
     * Stops listening for either trigger, and opens the bar unless the Visitor has chosen in the meantime, through the
     * footer's "Nastavení cookies".
     *
     * ```ts
     * openConsentBarOnFirstEngagement() // isConsentBarOpen true; later scrolls and tool use change nothing
     * ```
     */
    const openConsentBarOnFirstEngagement = () => {
      consentBarTriggerController.abort()
      if (readConsentChoice(new Date()) === null) setIsConsentBarOpen(true)
    }
    window.addEventListener('scroll', openConsentBarOnFirstEngagement, {
      passive: true,
      signal: consentBarTriggerController.signal,
    })
    const unsubscribeFromFunnelEvents = subscribeToFunnelEvents(({ event }) => {
      if (event === 'interactive_tool_use') openConsentBarOnFirstEngagement()
    })
    consentBarTriggerController.signal.addEventListener('abort', unsubscribeFromFunnelEvents)
    return () => consentBarTriggerController.abort()
  }, [])

  return {
    isConsentBarOpen,
    /**
     * Opens the bar, with nothing preselected, whatever the stored choice.
     *
     * ```ts
     * openConsentBar() // isConsentBarOpen true
     * ```
     */
    openConsentBar: () => setIsConsentBarOpen(true),
    /**
     * Stores the choice dated now, stores or removes `clientelo:visited` to match, and closes the bar.
     *
     * ```ts
     * chooseConsent('granted') // clientelo:consent { consentChoice: 'granted', chosenAt: now }; clientelo:visited '1'
     * chooseConsent('denied')  // clientelo:consent { consentChoice: 'denied', chosenAt: now }; clientelo:visited gone
     * ```
     */
    chooseConsent: (consentChoice) => {
      const now = new Date()
      rememberConsentChoice({ consentChoice, chosenAt: now })
      syncRememberedVisit(now)
      setIsConsentBarOpen(false)
    },
  }
}
