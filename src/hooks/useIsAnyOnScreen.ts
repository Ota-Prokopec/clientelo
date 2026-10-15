// Whether any element matching a selector is on screen, through one IntersectionObserver.
// The Sticky CTA uses it to step aside while the Lead Form or a Lead Ask is in view.
import { useEffect, useState } from 'react'

/**
 * Whether any element matching the selector is at least partly on screen.
 * Reads the matches once on mount, since the page's Sections are static.
 *
 * ```ts
 * useIsAnyOnScreen('#lead-magnet') // true while the closing Section is in view
 * ```
 */
export const useIsAnyOnScreen = (selector: string): { isAnyOnScreen: boolean } => {
  const [isAnyOnScreen, setIsAnyOnScreen] = useState(false)

  useEffect(() => {
    const onScreenElements = new Set<Element>()
    const observer = new IntersectionObserver((intersectionEntries) => {
      for (const intersectionEntry of intersectionEntries) {
        if (intersectionEntry.isIntersecting) onScreenElements.add(intersectionEntry.target)
        else onScreenElements.delete(intersectionEntry.target)
      }
      setIsAnyOnScreen(onScreenElements.size > 0)
    })
    for (const element of document.querySelectorAll(selector)) observer.observe(element)
    return () => observer.disconnect()
  }, [selector])

  return { isAnyOnScreen }
}
