// When a Section counts as viewed for the section_view Funnel Event (#49): at least half of it is on screen, or it
// fills at least half the screen, since a Section taller than a phone's screen never shows half of itself.
import type { ElementVisibility } from '@/hooks/useOnFirstView.ts'

/** The share of the Section, or of the screen, that has to be filled for the Section to count as viewed. */
const viewedShare = 0.5

/**
 * Whether a Section counts as viewed.
 *
 * ```ts
 * isSectionViewed({ visibleRatio: 0.5, visibleHeight: 150, viewportHeight: 667 })  // true: half the Section
 * isSectionViewed({ visibleRatio: 0.17, visibleHeight: 340, viewportHeight: 667 }) // true: half the screen
 * isSectionViewed({ visibleRatio: 0.15, visibleHeight: 300, viewportHeight: 667 }) // false
 * ```
 */
export const isSectionViewed = ({ visibleRatio, visibleHeight, viewportHeight }: ElementVisibility): boolean => {
  return visibleRatio >= viewedShare || visibleHeight >= viewportHeight * viewedShare
}
