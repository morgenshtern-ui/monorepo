import type { Position, Rect, Spacing } from '@teleskop-labs/css-box-model'
import { OriginPosition, apply, isEqual } from '../../../position.js'
import { Horizontal, Vertical } from '../../../axis.js'
import type { AutoScrollerOptions } from '../auto-scroller-options-types.js'
import { getScrollOnAxis } from './get-scroll-on-axis/getScrollOnAxis.js'
import { adjustForSizeLimits } from './adjustForSizeLimits.js'

// will replace -0 and replace with +0
const clean = apply((value: number) => (value === 0 ? 0 : value))

interface Args {
  dragStartTime: number
  container: Rect
  subject: Rect
  center: Position
  shouldUseTimeDampening: boolean
  getAutoScrollerOptions: () => AutoScrollerOptions
}

/**
 * Получает прокрутку на основе центра, контейнера и других параметров.
 *
 * @param {Args} param0 - Объект с параметрами center, container, dragStartTime, getAutoScrollerOptions, shouldUseTimeDampening, subject.
 * @returns {Position | null} Возвращает позицию или null.
 */
export function getScroll({
  center,
  container,
  dragStartTime,
  getAutoScrollerOptions,
  shouldUseTimeDampening,
  subject,
}: Args): Position | null {
  // получаем расстояние до каждого края
  const distanceToEdges: Spacing = {
    bottom: container.bottom - center.y,
    left: center.x - container.left,
    right: container.right - center.x,
    top: center.y - container.top,
  }

  // 1. Определяем, какие значения x, y являются наилучшей целью
  // 2. Может ли контейнер прокручиваться в этом направлении вообще?
  // Если нет в обоих направлениях, то возвращаем null
  // 3. Находится ли центр достаточно близко к краю, чтобы начать перетаскивание?
  // 4. На основе расстояния рассчитываем скорость, с которой должна происходить прокрутка
  // Чем меньше значение расстояния, тем быстрее должна быть прокрутка.
  // Максимальное значение скорости должно быть достигнуто до того, как расстояние станет равным 0
  // Отрицательные значения не продолжают увеличивать скорость
  const y: number = getScrollOnAxis({
    axis: Vertical,
    container,
    distanceToEdges,
    dragStartTime,
    getAutoScrollerOptions,
    shouldUseTimeDampening,
  })
  const x: number = getScrollOnAxis({
    axis: Horizontal,
    container,
    distanceToEdges,
    dragStartTime,
    getAutoScrollerOptions,
    shouldUseTimeDampening,
  })

  const required: Position = clean({ x, y })

  // ничего не требуется
  if (isEqual(required, OriginPosition))
    return null

  // необходимо не прокручивать в направлении, в котором мы слишком большие для прокрутки
  const limited: Position | null = adjustForSizeLimits({
    container,
    proposedScroll: required,
    subject,
  })

  if (!limited)
    return null

  return isEqual(limited, OriginPosition) ? null : limited
}
