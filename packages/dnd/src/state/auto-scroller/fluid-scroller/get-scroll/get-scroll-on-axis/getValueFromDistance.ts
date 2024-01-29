import { getPercentage } from '../../getPercentage.js'
import type { AutoScrollerOptions } from '../../auto-scroller-options-types'
import { defaultAutoScrollerOptions } from '../../config.js'
import { MinScroll } from './constants.js'
import type { DistanceThresholds } from './getDistanceThresholds.js'

/**
 * Получает значение прокрутки на основе расстояния до края
 *
 * @param {number} distanceToEdge - Расстояние до края.
 * @param {DistanceThresholds} thresholds - Пороговые значения расстояния.
 * @param {() => AutoScrollerOptions} getAutoScrollerOptions - Функция, возвращающая опции автопрокрутки. По умолчанию возвращает defaultAutoScrollerOptions.
 * @returns {number} Возвращает значение прокрутки.
 */
export function getValueFromDistance(
  distanceToEdge: number,
  thresholds: DistanceThresholds,
  getAutoScrollerOptions: () => AutoScrollerOptions = () => defaultAutoScrollerOptions,
): number {
  const autoScrollerOptions = getAutoScrollerOptions()

  /*
  // Эта функция смотрит только на расстояние до одного края
  // Пример: смотрим на нижний край
  |----------------------------------|
  |                                  |
  |                                  |
  |                                  |
  |                                  |
  |                                  | => нет прокрутки в этом диапазоне
  |                                  |
  |                                  |
  |  startScrollingFrom (eg 100px)   |
  |                                  |
  |                                  | => увеличенное значение прокрутки, чем ближе к maxScrollValueAt
  |  maxScrollValueAt (eg 10px)      |
  |                                  | => максимальное значение прокрутки в этом диапазоне
  |----------------------------------|
  */

  // слишком далеко для автопрокрутки
  if (distanceToEdge > thresholds.startScrollingFrom)
    return 0

  // использовать максимальную скорость при достижении или пересечении границы
  if (distanceToEdge <= thresholds.maxScrollValueAt)
    return autoScrollerOptions.maxPixelScroll

  // при непосредственном переходе на границу возвращаем минимальное целое число
  if (distanceToEdge === thresholds.startScrollingFrom)
    return MinScroll

  // чтобы получить % за startScrollingFrom, мы рассчитаем
  // % значение от maxScrollValueAt, а затем инвертируем его
  const percentageFromMaxScrollValueAt: number = getPercentage({
    current: distanceToEdge,
    endOfRange: thresholds.startScrollingFrom,
    startOfRange: thresholds.maxScrollValueAt,
  })

  const percentageFromStartScrollingFrom: number
    = 1 - percentageFromMaxScrollValueAt

  const scroll: number
    = autoScrollerOptions.maxPixelScroll
    * autoScrollerOptions.ease(percentageFromStartScrollingFrom)

  // прокрутка всегда будет положительным целым числом
  return Math.ceil(scroll)
}
