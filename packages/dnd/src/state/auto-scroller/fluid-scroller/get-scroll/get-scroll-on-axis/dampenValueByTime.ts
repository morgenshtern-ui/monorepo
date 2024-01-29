import { getPercentage } from '../../getPercentage.js'
import type { AutoScrollerOptions } from '../../auto-scroller-options-types.js'
import { MinScroll } from './constants.js'

/**
 * Уменьшает предлагаемое значение прокрутки в зависимости от времени.
 *
 * @param {number} proposedScroll - Предлагаемое значение прокрутки.
 * @param {number} dragStartTime - Время начала перетаскивания.
 * @param {() => AutoScrollerOptions} getAutoScrollerOptions - Функция, возвращающая опции автопрокрутки.
 * @returns {number} Возвращает уменьшенное значение прокрутки.
 */
export function dampenValueByTime(
  proposedScroll: number,
  dragStartTime: number,
  getAutoScrollerOptions: () => AutoScrollerOptions,
): number {
  const autoScrollerOptions = getAutoScrollerOptions()

  const accelerateAt: number = autoScrollerOptions.durationDampening.accelerateAt
  const stopAt: number = autoScrollerOptions.durationDampening.stopDampeningAt

  const startOfRange: number = dragStartTime
  const endOfRange: number = stopAt
  const now: number = Date.now()
  const runTime: number = now - startOfRange

  // мы завершили период временного затухания
  if (runTime >= stopAt)
    return proposedScroll

  // До этого момента мы знаем, что есть предлагаемая прокрутка,
  // но мы еще не достигли нашей точки ускорения
  // Возвращаем минимальное количество прокрутки
  if (runTime < accelerateAt)
    return MinScroll

  const betweenAccelerateAtAndStopAtPercentage: number = getPercentage({
    current: runTime,
    endOfRange,
    startOfRange: accelerateAt,
  })

  const scroll: number
    = proposedScroll
    * autoScrollerOptions.ease(betweenAccelerateAtAndStopAtPercentage)

  return Math.ceil(scroll)
}
