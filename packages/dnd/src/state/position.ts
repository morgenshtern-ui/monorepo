import type { Position } from '@teleskop-labs/css-box-model'

export const OriginPosition: Position = { x: 0, y: 0 }

/**
 * Складывает два объекта Position.
 *
 * @param {Position} point1 - Первый объект Position.
 * @param {Position} point2 - Второй объект Position.
 * @returns {Position} Возвращает новый объект Position, в котором значения x и y являются суммой соответствующих значений входных объектов.
 */
export function add(point1: Position, point2: Position): Position {
  return {
    x: point1.x + point2.x,
    y: point1.y + point2.y,
  }
}

/**
 * Вычитает второй объект Position из первого.
 *
 * @param {Position} point1 - Первый объект Position.
 * @param {Position} point2 - Второй объект Position.
 * @returns {Position} Возвращает новый объект Position, в котором значения x и y являются разностью соответствующих значений входных объектов.
 */
export function subtract(point1: Position, point2: Position): Position {
  return {
    x: point1.x - point2.x,
    y: point1.y - point2.y,
  }
}

/**
 * Сравнивает два объекта Position на равенство.
 *
 * @param {Position} point1 - Первый объект Position для сравнения.
 * @param {Position} point2 - Второй объект Position для сравнения.
 * @returns {boolean} Возвращает true, если значения x и y в обоих объектах равны, иначе false.
 */
export function isEqual(point1: Position, point2: Position): boolean {
  return point1.x === point2.x && point1.y === point2.y
}

/**
 * Инвертирует значения x и y объекта Position.
 *
 * @param {Position} point - Объект Position, значения которого нужно инвертировать.
 * @returns {Position} Возвращает новый объект Position, в котором значения x и y являются противоположными значениям входного объекта. Если значение уже равно 0, возвращает 0, а не -0.
 */
export function negate(point: Position): Position {
  return {
    // if the value is already 0, do not return -0
    x: point.x !== 0 ? -point.x : 0,

    y: point.y !== 0 ? -point.y : 0,
  }
}

/**
 * Позволяет создать объект Position из значений.
 * Очень полезно при работе с типом Axis.
 * patch('x', 5)    = { x: 5, y: 0 }
 * patch('y', 5, 1) = { x: 1, y: 5 }
 *
 * @param {'x' | 'y'} line - Ось, для которой устанавливается значение.
 * @param {number} value - Значение для указанной оси.
 * @param {number} [otherValue] - Значение для другой оси. По умолчанию равно 0.
 * @returns {Position} Возвращает новый объект Position с установленными значениями.
 */
export function patch(line: 'x' | 'y', value: number, otherValue = 0): Position {
  if (line === 'x') {
    return {
      x: value,
      y: otherValue,
    }
  }

  return {
    x: otherValue,
    y: value,
  }
}

/**
 * Возвращает расстояние между двумя точками.
 * https://www.mathsisfun.com/algebra/distance-2-points.html
 *
 * @param {Position} point1 - Первая точка.
 * @param {Position} point2 - Вторая точка.
 * @returns {number} Возвращает расстояние между двумя точками.
 */
export function distance(point1: Position, point2: Position): number {
  return Math.hypot((point2.x - point1.x), (point2.y - point1.y))
}

/**
 * При получении списка точек находит наименьшее расстояние до любой точки.
 *
 * @param {Position} target - Целевая точка.
 * @param {Position[]} points - Список точек для сравнения.
 * @returns {number} Возвращает наименьшее расстояние до любой точки из списка.
 */
export function closest(target: Position, points: Position[]): number {
  return Math.min(...points.map((point: Position) => distance(target, point)))
}

/**
 * Используется для применения любой функции к обоим значениям точки.
 * Например: const floor = apply(Math.floor)(point);
 *
 * @param {Function} fn - Функция, которую нужно применить к значениям точки.
 * @returns {Function} Возвращает функцию, которая принимает точку и возвращает новую точку, в которой функция `fn` применена к каждому значению.
 */
export function apply(fn: (value: number) => number) {
  return (point: Position): Position => ({
    x: fn(point.x),
    y: fn(point.y),
  })
}
