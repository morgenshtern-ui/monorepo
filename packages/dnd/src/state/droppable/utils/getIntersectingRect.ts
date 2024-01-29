import { getRect } from '@teleskop-labs/css-box-model'

import type { Rect, Spacing } from '@teleskop-labs/css-box-model'

/**
 * Получает пересекающийся прямоугольник из двух других прямоугольников.
 *
 * @param {Spacing} frame - Первый прямоугольник.
 * @param {Spacing} subject - Второй прямоугольник.
 * @returns {Rect | null} Возвращает пересекающийся прямоугольник или null, если пересечения нет.
 */
export function getIntersectingRect(frame: Spacing, subject: Spacing): Rect | null {
  const result: Rect = getRect({
    bottom: Math.min(subject.bottom, frame.bottom),
    left: Math.max(subject.left, frame.left),
    right: Math.min(subject.right, frame.right),
    top: Math.max(subject.top, frame.top),
  })

  if (result.width <= 0 || result.height <= 0)
    return null

  return result
}
