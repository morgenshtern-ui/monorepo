import type { Position, Rect } from '@teleskop-labs/css-box-model'

interface Args {
  container: Rect
  subject: Rect
  proposedScroll: Position
}

/**
 * Корректирует предложенную прокрутку с учетом ограничений размера.
 *
 * @param {Args} { container, proposedScroll, subject } - Объект с параметрами для функции.
 * @returns {Position | null} Возвращает скорректированную прокрутку или null, если объект слишком большой по обеим осям.
 */
export function adjustForSizeLimits({ container, proposedScroll, subject }: Args): Position | null {
  const isTooBigVertically: boolean = subject.height > container.height
  const isTooBigHorizontally: boolean = subject.width > container.width

  // Не слишком большой по любой оси
  if (!isTooBigHorizontally && !isTooBigVertically)
    return proposedScroll

  // Слишком большой по обеим осям
  if (isTooBigHorizontally && isTooBigVertically)
    return null

  // Слишком большой только по одной оси
  // Исключаем ось, по которой мы не можем прокручивать
  return {
    x: isTooBigHorizontally ? 0 : proposedScroll.x,
    y: isTooBigVertically ? 0 : proposedScroll.y,
  }
}
