// Calls back the first time each of a few elements, found by id, counts as viewed, through one IntersectionObserver.
// The section_view and lead_form_seen Funnel Events hook onto the Section anchors and `#lead-form` with it.
import { useEffect } from 'react'

/** How much of an element is on screen, as an IntersectionObserver entry reports it. */
export type ElementVisibility = {
  /** The share of the element on screen, from 0 to 1. */
  visibleRatio: number
  /** How many px of the element are on screen. */
  visibleHeight: number
  /** The screen's height in px. */
  viewportHeight: number
}

export type UseOnFirstViewProps<TElementId extends string> = {
  /** The ids of the elements to watch. Pass a module-level constant, or the observer restarts on every render. */
  elementIds: readonly TElementId[]
  /** Whether an element counts as viewed, from how much of it is on screen. */
  isViewed: (elementVisibility: ElementVisibility) => boolean
  /** Called once per element, the first time it counts as viewed. Pass a module-level function, as for `elementIds`. */
  onFirstView: (elementId: TElementId) => void
}

// The observer reports every percent of an element on screen, so the moment a tall Section fills half the screen
// (a share of the Section that depends on its height) is caught within a percent.
const visibilityThresholds = Array.from({ length: 101 }, (_, percent) => percent / 100)

/**
 * Watches the elements with these ids, which are static once the page has rendered, and reports each one's first view.
 *
 * ```ts
 * useOnFirstView({ elementIds: ['key-insight'], isViewed: isSectionViewed, onFirstView: trackSectionView })
 * // scrolling until #key-insight fills half the screen → trackSectionView('key-insight'), once
 * ```
 */
export const useOnFirstView = <TElementId extends string>({
  elementIds,
  isViewed,
  onFirstView,
}: UseOnFirstViewProps<TElementId>): void => {
  useEffect(() => {
    const elementIdByElement = new Map<Element, TElementId>()
    const observer = new IntersectionObserver(
      (intersectionEntries) => {
        for (const intersectionEntry of intersectionEntries) {
          const elementId = elementIdByElement.get(intersectionEntry.target)
          const elementVisibility: ElementVisibility = {
            visibleRatio: intersectionEntry.intersectionRatio,
            visibleHeight: intersectionEntry.intersectionRect.height,
            viewportHeight: intersectionEntry.rootBounds?.height ?? window.innerHeight,
          }
          if (elementId === undefined || !isViewed(elementVisibility)) continue
          observer.unobserve(intersectionEntry.target)
          onFirstView(elementId)
        }
      },
      { threshold: visibilityThresholds },
    )
    for (const elementId of elementIds) {
      const element = document.getElementById(elementId)
      if (!element) continue
      elementIdByElement.set(element, elementId)
      observer.observe(element)
    }
    return () => observer.disconnect()
  }, [elementIds, isViewed, onFirstView])
}
