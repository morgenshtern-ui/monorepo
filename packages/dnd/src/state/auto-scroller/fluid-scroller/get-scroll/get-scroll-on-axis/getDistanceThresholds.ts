import type { Rect } from '@teleskop-labs/css-box-model'
import type { AutoScrollerOptions } from '../../auto-scroller-options-types'
import { defaultAutoScrollerOptions } from '../../config.js'
import type { Axis } from '../../../../axis.js'

// Все в пикселях
export interface DistanceThresholds {
  startScrollingFrom: number
  maxScrollValueAt: number
}

/**
 * Преобразует проценты в конфигурации в фактические значения в пикселях
 *
 * @param {Rect} container - Контейнер, в котором происходит прокрутка.
 * @param {Axis} axis - Ось, по которой происходит прокрутка.
 * @param {() => AutoScrollerOptions} getAutoScrollerOptions - Функция, возвращающая опции автопрокрутки. По умолчанию возвращает defaultAutoScrollerOptions.
 * @returns {DistanceThresholds} Возвращает пороговые значения расстояния для начала прокрутки и максимального значения прокрутки.
 */
export function getDistanceThresholds(
  container: Rect,
  axis: Axis,
  getAutoScrollerOptions: () => AutoScrollerOptions = () => defaultAutoScrollerOptions,
): DistanceThresholds {
  const autoScrollerOptions = getAutoScrollerOptions()

  const startScrollingFrom: number = container[axis.size] * autoScrollerOptions.startFromPercentage
  const maxScrollValueAt: number = container[axis.size] * autoScrollerOptions.maxScrollAtPercentage

  const thresholds: DistanceThresholds = {
    maxScrollValueAt,
    startScrollingFrom,
  }

  return thresholds
}
