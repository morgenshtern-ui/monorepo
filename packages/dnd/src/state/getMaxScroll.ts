import type { Position } from '@teleskop-labs/css-box-model'
import { subtract } from './position.js'

interface Args {
  scrollHeight: number
  scrollWidth: number
  height: number
  width: number
}

/**
 * Вычисляет максимальное значение прокрутки для заданных параметров.
 *
 * @param {Args} options - Объект с параметрами: высота, ширина, общая высота прокрутки и общая ширина прокрутки.
 * @returns {Position} Возвращает позицию с максимальными значениями прокрутки по оси X и Y.
 */
export function getMaxScroll({ height, scrollHeight, scrollWidth, width }: Args): Position {
  const maxScroll: Position = subtract(
    // full size
    {
      x: scrollWidth,
      y: scrollHeight,
    },
    // viewport size
    {
      x: width,
      y: height,
    },
  )

  const adjustedMaxScroll: Position = {
    x: Math.max(0, maxScroll.x),
    y: Math.max(0, maxScroll.y),
  }

  return adjustedMaxScroll
}
