import { getRect } from '@teleskop-labs/css-box-model'
import type { Position, Rect } from '@teleskop-labs/css-box-model'

import type { Viewport } from '../types.js'
import { negate, subtract } from './position.js'

/**
 * Обновляет viewport с новым положением прокрутки.
 *
 * @param {Viewport} viewport - Исходный viewport.
 * @param {Position} newScroll - Новое положение прокрутки.
 * @returns {Viewport} Возвращает обновленный viewport с новым положением прокрутки.
 */
export function updateViewportWithNewScroll(viewport: Viewport, newScroll: Position): Viewport {
  const diff: Position = subtract(newScroll, viewport.scroll.initial)
  const displacement: Position = negate(diff)

  // Нам нужно обновить frame, чтобы она всегда была актуальной
  // Верхняя / левая часть frame всегда должны соответствовать позиции newScroll
  const frame: Rect = getRect({
    bottom: newScroll.y + viewport.frame.height,
    left: newScroll.x,
    right: newScroll.x + viewport.frame.width,
    top: newScroll.y,
  })

  const updated: Viewport = {
    frame,
    scroll: {
      current: newScroll,
      diff: {
        displacement,
        value: diff,
      },
      initial: viewport.scroll.initial,
      max: viewport.scroll.max,
    },
  }

  return updated
}
