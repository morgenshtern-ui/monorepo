import type { AutoScrollerOptions } from '../../auto-scroller-options-types'
import type { DistanceThresholds } from './getDistanceThresholds.js'
import { getValueFromDistance } from './getValueFromDistance.js'
import { dampenValueByTime } from './dampenValueByTime.js'
import { MinScroll } from './constants.js'

interface Args {
  distanceToEdge: number
  thresholds: DistanceThresholds
  dragStartTime: number
  shouldUseTimeDampening: boolean
  getAutoScrollerOptions: () => AutoScrollerOptions
}

/**
 * Получает значение на основе расстояния до края и других параметров.
 *
 * @param {Args} param0 - Объект с параметрами distanceToEdge, dragStartTime, getAutoScrollerOptions, shouldUseTimeDampening, thresholds.
 * @returns {number} Возвращает значение прокрутки.
 */
export function getValue({
  distanceToEdge,
  dragStartTime,
  getAutoScrollerOptions,
  shouldUseTimeDampening,
  thresholds,
}: Args): number {
  const scroll: number = getValueFromDistance(
    distanceToEdge,
    thresholds,
    getAutoScrollerOptions,
  )

  // Недостаточное расстояние для инициирования минимальной прокрутки
  // Мы можем прервать здесь
  if (scroll === 0)
    return 0

  // Уменьшаем скорость автопрокрутки на основе продолжительности перетаскивания
  if (!shouldUseTimeDampening)
    return scroll

  // Как только мы узнаем, что автопрокрутка должна произойти на основе расстояния,
  // мы должны пропустить хотя бы 1px, чтобы инициировать событие прокрутки и
  // еще один вызов автопрокрутки

  return Math.max(
    dampenValueByTime(scroll, dragStartTime, getAutoScrollerOptions),
    MinScroll,
  )
}
