import type { PartialDeep } from 'type-fest'

/**
 * Настройка поведения автопрокрутки
 */
export interface AutoScrollerOptions {
  /**
   * Процентное расстояние от края контейнера, при достижении которого начинается автопрокрутка.
   * например, 0.1 или 0.9
   */
  startFromPercentage: number

  /**
   * Процентное расстояние от края контейнера, при достижении которого достигается максимальная скорость прокрутки.
   * Должно быть меньше, чем startFromPercentage
   */
  maxScrollAtPercentage: number

  /**
   * Максимальное количество пикселей для прокрутки за frame
   */
  maxPixelScroll: number

  /**
   * Функция, используемая для сглаживания процентного значения
   * Простая линейная функция будет выглядеть так: (percentage) => percentage;
   * процент находится в диапазоне от 0 до 1
   * результат должен быть в диапазоне от 0 до 1
   */
  ease: (percentage: number) => number

  durationDampening: {
    /**
     * Как долго замедлять скорость автопрокрутки с начала перетаскивания в миллисекундах
     */
    stopDampeningAt: number

    /**
     * Когда начинать ускорять уменьшение замедления продолжительности в миллисекундах
     */
    accelerateAt: number
  }

  /**
   * Отключить автопрокрутку полностью или нет
   */
  disabled: boolean
}

export type PartialAutoScrollerOptions = PartialDeep<AutoScrollerOptions>
