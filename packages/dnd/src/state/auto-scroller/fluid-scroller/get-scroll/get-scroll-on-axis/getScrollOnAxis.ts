import type { Rect, Spacing } from '@teleskop-labs/css-box-model'
import type { AutoScrollerOptions } from '../../auto-scroller-options-types'
import type { Axis } from '../../../../axis'
import { getDistanceThresholds } from './getDistanceThresholds.js'
import type { DistanceThresholds } from './getDistanceThresholds.js'
import { getValue } from './getValue.js'

interface GetOnAxisArgs {
  container: Rect
  distanceToEdges: Spacing
  dragStartTime: number
  axis: Axis
  shouldUseTimeDampening: boolean
  getAutoScrollerOptions: () => AutoScrollerOptions
}

/**
 * Получает прокрутку по заданной оси.
 *
 * @param {GetOnAxisArgs} param0 - Объект с параметрами axis, container, distanceToEdges, dragStartTime, getAutoScrollerOptions, shouldUseTimeDampening.
 * @returns {number} Возвращает значение прокрутки.
 */
export function getScrollOnAxis({
  axis,
  container,
  distanceToEdges,
  dragStartTime,
  getAutoScrollerOptions,
  shouldUseTimeDampening,
}: GetOnAxisArgs): number {
  const thresholds: DistanceThresholds = getDistanceThresholds(
    container,
    axis,
    getAutoScrollerOptions,
  )
  const isCloserToEnd: boolean
    = distanceToEdges[axis.end] < distanceToEdges[axis.start]

  if (isCloserToEnd) {
    return getValue({
      distanceToEdge: distanceToEdges[axis.end],
      dragStartTime,
      getAutoScrollerOptions,
      shouldUseTimeDampening,
      thresholds,
    })
  }

  return (
    -1
    * getValue({
      distanceToEdge: distanceToEdges[axis.start],
      dragStartTime,
      getAutoScrollerOptions,
      shouldUseTimeDampening,
      thresholds,
    })
  )
}
