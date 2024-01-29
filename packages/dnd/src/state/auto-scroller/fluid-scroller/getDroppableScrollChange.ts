import type { Position, Rect } from '@teleskop-labs/css-box-model'
import type { DroppableDimension, Scrollable } from '../../../types.js'
import { canScrollDroppable } from '../canScroll.js'
import { getScroll } from './get-scroll/getScroll.js'
import type { AutoScrollerOptions } from './auto-scroller-options-types.js'

interface Args {
  droppable: DroppableDimension
  subject: Rect
  center: Position
  dragStartTime: number
  shouldUseTimeDampening: boolean
  getAutoScrollerOptions: () => AutoScrollerOptions
}

/**
 * Получает изменение прокрутки для droppable элемента.
 *
 * @param {Args} param0 - Объект с параметрами center, dragStartTime, droppable, getAutoScrollerOptions, shouldUseTimeDampening, subject.
 * @returns {Position | null} Возвращает позицию прокрутки или null.
 */
export function getDroppableScrollChange({
  center,
  dragStartTime,
  droppable,
  getAutoScrollerOptions,
  shouldUseTimeDampening,
  subject,
}: Args): Position | null {
  // Мы знаем, что у этого есть ближайший прокручиваемый элемент
  const frame: Scrollable | null = droppable.frame

  // это никогда не должно произойти - просто на всякий случай
  if (!frame)
    return null

  const scroll: Position | null = getScroll({
    center,
    container: frame.pageMarginBox,
    dragStartTime,
    getAutoScrollerOptions,
    shouldUseTimeDampening,
    subject,
  })

  return scroll && canScrollDroppable(droppable, scroll) ? scroll : null
}
