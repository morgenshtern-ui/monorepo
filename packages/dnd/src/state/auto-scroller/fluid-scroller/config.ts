import type { AutoScrollerOptions } from './auto-scroller-options-types.js'

// default autoScroll configuration options
export const defaultAutoScrollerOptions: AutoScrollerOptions = {
  disabled: false,
  durationDampening: {
    accelerateAt: 360,
    stopDampeningAt: 1200,
  },
  ease: (percentage: number): number => percentage ** 2,
  maxPixelScroll: 28,
  maxScrollAtPercentage: 0.05,
  startFromPercentage: 0.25,
}
