import type { Position } from '@teleskop-labs/css-box-model'
import { OriginPosition, add, apply, isEqual } from '../position.js'
import type { DroppableDimension, Scrollable, Viewport } from '../../types.js'

interface CanPartiallyScrollArgs {
  max: Position
  current: Position
  change: Position
}

const smallestSigned = apply((value: number) => {
  if (value === 0)
    return 0

  return value > 0 ? 1 : -1
})

export function canPartiallyScroll({ change, current, max: rawMax }: CanPartiallyScrollArgs): boolean {
  // Возможно, что максимальная прокрутка будет больше текущей прокрутки,
  // когда есть полосы прокрутки на поперечной оси. Мы корректируем это,
  // увеличивая точку максимальной прокрутки при необходимости.
  // Это позволит двигаться назад, даже если текущая прокрутка больше максимальной.
  const max: Position = {
    x: Math.max(current.x, rawMax.x),
    y: Math.max(current.y, rawMax.y),
  }

  // Нужно только иметь возможность двигаться на минимальное количество в желаемом направлении
  const smallestChange: Position = smallestSigned(change)

  const overlap: Position | null = getOverlap({
    change: smallestChange,
    current,
    max,
  })

  // Вообще нет перекрытия - мы можем двигаться туда!
  if (!overlap)
    return true

  // Если было значение x, но нет перекрытия по x - тогда мы можем прокручивать по x!
  if (smallestChange.x !== 0 && overlap.x === 0)
    return true

  // Если было значение y, но нет перекрытия по y - тогда мы можем прокручивать по y!
  if (smallestChange.y !== 0 && overlap.y === 0)
    return true

  return false
}

/**
 * Получает перекрытие между окном просмотра и изменением позиции.
 *
 * @param {Viewport} viewport - Окно просмотра.
 * @param {Position} change - Изменение позиции.
 * @returns {Position | null} Возвращает перекрытие или null, если окно просмотра не может прокручиваться.
 */
export function getWindowOverlap(viewport: Viewport, change: Position): Position | null {
  if (!canScrollWindow(viewport, change))
    return null

  const max: Position = viewport.scroll.max
  const current: Position = viewport.scroll.current

  return getOverlap({
    change,
    current,
    max,
  })
}

/**
 * Определяет, можно ли прокрутить окно просмотра.
 *
 * @param {Viewport} viewport - Окно просмотра.
 * @param {Position} change - Изменение позиции.
 * @returns {boolean} Возвращает true, если окно просмотра можно прокрутить, иначе false.
 */
export function canScrollWindow(viewport: Viewport, change: Position): boolean {
  return canPartiallyScroll({
    change,
    current: viewport.scroll.current,
    max: viewport.scroll.max,
  })
}

/**
 * Получает перекрытие между перемещаемым объектом и его рамкой.
 *
 * @param {DroppableDimension} droppable - Перемещаемый объект.
 * @param {Position} change - Изменение позиции.
 * @returns {Position | null} Возвращает перекрытие или null, если рамка не определена или перемещаемый объект не может прокручиваться.
 */
export function getDroppableOverlap(droppable: DroppableDimension, change: Position): Position | null {
  const frame: Scrollable | null = droppable.frame

  if (!frame)
    return null

  if (!canScrollDroppable(droppable, change))
    return null

  return getOverlap({
    change,
    current: frame.scroll.current,
    max: frame.scroll.max,
  })
}

/**
 * Определяет, можно ли прокрутить перемещаемый объект.
 *
 * @param {DroppableDimension} droppable - Перемещаемый объект.
 * @param {Position} change - Изменение позиции.
 * @returns {boolean} Возвращает true, если перемещаемый объект можно прокрутить, иначе false.
 */
export function canScrollDroppable(droppable: DroppableDimension, change: Position): boolean {
  const frame: Scrollable | null = droppable.frame

  // Невозможно прокручивать, если нет возможности прокручивать
  if (!frame)
    return false

  return canPartiallyScroll({
    change,
    current: frame.scroll.current,
    max: frame.scroll.max,
  })
}

interface GetRemainderArgs {
  current: Position
  max: Position
  change: Position
}

// We need to figure out how much of the movement
// cannot be done with a scroll
// Нам нужно выяснить, какая часть перемещения
// не может быть выполнена с помощью прокрутки
/**
 * Вычисляет, какая часть перемещения не может быть выполнена с помощью прокрутки.
 *
 * @param {GetRemainderArgs} { change, current, max } - Объект с параметрами для функции.
 * @returns {Position | null} Возвращает перекрытие или null, если перекрытие равно начальной позиции.
 */
export function getOverlap({ change, current, max }: GetRemainderArgs): Position | null {
  const targetScroll: Position = add(current, change)

  const overlap: Position = {
    x: getRemainder(targetScroll.x, max.x),
    y: getRemainder(targetScroll.y, max.y),
  }

  if (isEqual(overlap, OriginPosition))
    return null

  return overlap
}

/**
 * Получает остаток от деления цели на максимум.
 *
 * @param {number} target - Целевое значение.
 * @param {number} max - Максимальное значение.
 * @returns {number} Возвращает остаток. Если цель меньше 0, возвращает цель. Если цель больше максимума, возвращает разницу между целью и максимумом. В противном случае возвращает 0.
 */
function getRemainder(target: number, max: number): number {
  if (target < 0)
    return target

  if (target > max)
    return target - max

  return 0
}
