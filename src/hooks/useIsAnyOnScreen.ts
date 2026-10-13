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
export function useIsAnyOnScreen(selector: string): boolean {
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
