import { getRect } from '@teleskop-labs/css-box-model'
import type { Position, Rect } from '@teleskop-labs/css-box-model'
import { offsetByPosition } from './spacing.js'

/**
 * Смещает прямоугольник на заданную позицию.
 *
 * @param {Rect} rect - Исходный прямоугольник.
 * @param {Position} point - Позиция, на которую нужно сместить прямоугольник.
 * @returns {Rect} Возвращает новый прямоугольник, смещенный на заданную позицию.
 */
export function offsetRectByPosition(rect: Rect, point: Position): Rect {
  return getRect(offsetByPosition(rect, point))
}
