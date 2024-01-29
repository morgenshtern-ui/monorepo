import type { Position, Rect } from '@teleskop-labs/css-box-model'
import type { Viewport } from '../../../types.js'
import { canScrollWindow } from '../canScroll.js'
import { getScroll } from './get-scroll/getScroll.js'
import type { AutoScrollerOptions } from './auto-scroller-options-types.js'

interface Args {
  viewport: Viewport
  subject: Rect
  center: Position
  dragStartTime: number
  shouldUseTimeDampening: boolean
  getAutoScrollerOptions: () => AutoScrollerOptions
}

export function getWindowScrollChange({
  center,
  dragStartTime,
  getAutoScrollerOptions,
  shouldUseTimeDampening,
  subject,
  viewport,
}: Args): Position | null {
  const scroll: Position | null = getScroll({
    center,
    container: viewport.frame,
    dragStartTime,
    getAutoScrollerOptions,
    shouldUseTimeDampening,
    subject,
  })

  return scroll && canScrollWindow(viewport, scroll) ? scroll : null
}
