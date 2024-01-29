import type { Position, Spacing } from '@teleskop-labs/css-box-model'

// TODO add test

/**
 * Сравнивает два объекта Spacing на равенство.
 *
 * @param {Spacing} first - Первый объект Spacing для сравнения.
 * @param {Spacing} second - Второй объект Spacing для сравнения.
 * @returns {boolean} Возвращает true, если все соответствующие значения в объектах Spacing равны, иначе false.
 */
export function isEqual(first: Spacing, second: Spacing): boolean {
  return first.top === second.top
    && first.right === second.right
    && first.bottom === second.bottom
    && first.left === second.left
}

/**
 * Смещает объект Spacing на основе переданного объекта Position.
 *
 * @param {Spacing} spacing - Объект Spacing, содержащий значения для left, right, top и bottom.
 * @param {Position} point - Объект Position, содержащий значения для x и y.
 * @returns {Spacing} Новый объект Spacing, в котором каждое из значений left, right, top и bottom увеличено на соответствующие значения из point.
 */
export function offsetByPosition(spacing: Spacing, point: Position): Spacing {
  return {
    bottom: spacing.bottom + point.y,
    left: spacing.left + point.x,
    right: spacing.right + point.x,
    top: spacing.top + point.y,
  }
}

/**
 * Расширяет объект Spacing на основе переданного объекта Position.
 *
 * @param {Spacing} spacing - Объект Spacing, содержащий значения для left, right, top и bottom.
 * @param {Position} position - Объект Position, содержащий значения для x и y.
 * @returns {Spacing} Новый объект Spacing, в котором каждое из значений left, right, top и bottom изменено на основе соответствующих значений из position.
 */
export function expandByPosition(spacing: Spacing, position: Position): Spacing {
  return {
    bottom: spacing.bottom + position.y,

    left: spacing.left - position.x,

    // pushing forward to increase size
    right: spacing.right + position.x,

    // pulling back to increase size
    top: spacing.top - position.y,
  }
}

/**
 * Возвращает массив позиций углов на основе переданного объекта Spacing.
 *
 * @param {Spacing} spacing - Объект Spacing, содержащий значения для left, right, top и bottom.
 * @returns {Position[]} Массив объектов Position, представляющих углы: верхний левый, верхний правый, нижний левый и нижний правый.
 */
export function getCorners(spacing: Spacing): Position[] {
  return [
    {
      x: spacing.left,
      y: spacing.top,
    },
    {
      x: spacing.right,
      y: spacing.top,
    },
    {
      x: spacing.left,
      y: spacing.bottom,
    },
    {
      x: spacing.right,
      y: spacing.bottom,
    },
  ]
}

export const NoSpacing: Spacing = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
}
