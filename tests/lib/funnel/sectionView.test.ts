// Tests when a Section counts as viewed: half of it on screen, or, for a Section taller than the screen, half the screen.
import { describe, expect, it } from 'vitest'
import { isSectionViewed } from '@lib/funnel/sectionView.ts'

// An iPhone SE-sized viewport: 375 × 667 px.
const VIEWPORT_HEIGHT = 667

describe('isSectionViewed', () => {
  it('counts a short Section as viewed once half of it is on screen', () => {
    expect(isSectionViewed({ visibleRatio: 0.5, visibleHeight: 150, viewportHeight: VIEWPORT_HEIGHT })).toBe(true)
    expect(isSectionViewed({ visibleRatio: 0.49, visibleHeight: 147, viewportHeight: VIEWPORT_HEIGHT })).toBe(false)
  })

  // A 2000 px Section never shows half of itself on a 667 px screen.
  it('counts a tall Section as viewed once it fills half the screen', () => {
    expect(isSectionViewed({ visibleRatio: 0.17, visibleHeight: 340, viewportHeight: VIEWPORT_HEIGHT })).toBe(true)
    expect(isSectionViewed({ visibleRatio: 0.15, visibleHeight: 300, viewportHeight: VIEWPORT_HEIGHT })).toBe(false)
  })
})
