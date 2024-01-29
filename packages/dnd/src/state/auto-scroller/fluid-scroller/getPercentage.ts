import { consola } from 'consola/browser'

interface Args {
  startOfRange: number
  endOfRange: number
  current: number
}

/**
 * Получает процентное значение текущего положения в заданном диапазоне.
 *
 * @param {Args} args - Объект с текущим положением и началом и концом диапазона.
 * @returns {number} Возвращает процентное значение. Если диапазон равен 0, возвращает 0 и выводит предупреждение.
 */
export function getPercentage({ current, endOfRange, startOfRange }: Args): number {
  const range: number = endOfRange - startOfRange

  if (range === 0) {
    consola.warn(`
      Detected distance range of 0 in the fluid auto scroller
      This is unexpected and would cause a divide by 0 issue.
      Not allowing an auto scroll
    `)

    return 0
  }

  const currentInRange: number = current - startOfRange
  const percentage: number = currentInRange / range

  return percentage
}
