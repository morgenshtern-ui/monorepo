import { invariant } from '@teleskop-labs/tiny-invariant'

// # The CSS box model
// > https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Box_Model/Introduction_to_the_CSS_box_model
//
// ------------------------------------
// |              MARGIN              |  (marginBox)
// |  ------------------------------  |
// |  |           BORDER           |  |  (borderBox)
// |  |  ------------------------  |  |
// |  |  |       PADDING        |  |  |  (paddingBox) - not used by anything really
// |  |  |  ------------------  |  |  |
// |  |  |  |    CONTENT     |  |  |  |  (contentBox)
// |  |  |  |                |  |  |  |
// |  |  |  |                |  |  |  |
// |  |  |  |                |  |  |  |
// |  |  |  ------------------  |  |  |
// |  |  |                      |  |  |
// |  |  ------------------------  |  |
// |  |                            |  |
// |  ------------------------------  |
// |                                  |
// | ----------------------------------|

export interface Position {
  x: number
  y: number
}

export interface Rect {
  top: number
  right: number
  bottom: number
  left: number
  width: number
  height: number
  x: number
  y: number
  center: Position
}

export interface BoxModel {
  // content + padding + border + margin
  marginBox: Rect
  // content + padding + border
  borderBox: Rect
  // content + padding
  paddingBox: Rect
  // content
  contentBox: Rect
  // for your own consumption
  border: Spacing
  padding: Spacing
  margin: Spacing
}

export type AnyRectType = ClientRect | DOMRect | Rect | Spacing

export interface Spacing {
  top: number
  right: number
  bottom: number
  left: number
}

/**
 * Получает модель блока для элемента.
 *
 * @param {Element} el - Элемент.
 * @returns {BoxModel} Возвращает модель блока.
 */
export function getBox(el: Element): BoxModel {
  // getBoundingClientRect всегда возвращает borderBox
  const borderBox: DOMRect = el.getBoundingClientRect()
  const styles: CSSStyleDeclaration = window.getComputedStyle(el)

  return calculateBox(borderBox, styles)
}

/**
 * Эта функция напрямую доступна для производительности. Если вы уже вычислили эти вещи,
 * то вы можете просто передать их.
 *
 * @param {AnyRectType} borderBox - Прямоугольник с границами.
 * @param {CSSStyleDeclaration} styles - Стили элемента.
 * @returns {BoxModel} Возвращает модель блока.
 */
export function calculateBox(borderBox: AnyRectType, styles: CSSStyleDeclaration): BoxModel {
  const margin: Spacing = {
    bottom: parse(styles.marginBottom),
    left: parse(styles.marginLeft),
    right: parse(styles.marginRight),
    top: parse(styles.marginTop),
  }

  const padding: Spacing = {
    bottom: parse(styles.paddingBottom),
    left: parse(styles.paddingLeft),
    right: parse(styles.paddingRight),
    top: parse(styles.paddingTop),
  }

  const border: Spacing = {
    bottom: parse(styles.borderBottomWidth),
    left: parse(styles.borderLeftWidth),
    right: parse(styles.borderRightWidth),
    top: parse(styles.borderTopWidth),
  }

  return createBox({
    border,
    borderBox,
    margin,
    padding,
  })
}

/**
 * Добавляет прокрутку к оригинальной модели блока.
 *
 * @param {BoxModel} original - Оригинальная модель блока.
 * @param {Position} scroll - Позиция прокрутки.
 * @returns {BoxModel} Возвращает модель блока с прокруткой.
 */
export function withScroll(original: BoxModel, scroll: Position = getWindowScroll()): BoxModel {
  return offset(original, scroll)
}

/**
 * Смещает оригинальную модель блока.
 *
 * @param {BoxModel} original - Оригинальная модель блока.
 * @param {Position} change - Изменение позиции.
 * @returns {BoxModel} Возвращает смещенную модель блока.
 */
export function offset(original: BoxModel, change: Position): BoxModel {
  const { border, borderBox, margin, padding } = original
  const shifted: Spacing = shift(borderBox, change)

  return createBox({
    border,
    borderBox: shifted,
    margin,
    padding,
  })
}

/**
 * Расширяет целевой объект на заданное значение.
 *
 * @param {Spacing} target - Целевой объект.
 * @param {Spacing} expandBy - Значение, на которое нужно расширить.
 * @returns {Spacing} Возвращает расширенный объект.
 */
export function expand(target: Spacing, expandBy: Spacing): Spacing {
  return {
    // pushing forward to increase size
    bottom: target.bottom + expandBy.bottom,
    left: target.left - expandBy.left,
    right: target.right + expandBy.right,
    // pulling back to increase size
    top: target.top - expandBy.top,
  }
}

/**
 * Уменьшает целевой объект на заданное значение.
 *
 * @param {Spacing} target - Целевой объект.
 * @param {Spacing} shrinkBy - Значение, на которое нужно уменьшить.
 * @returns {Spacing} Возвращает уменьшенный объект.
 */
export function shrink(target: Spacing, shrinkBy: Spacing): Spacing {
  return {
    // двигаем назад, чтобы уменьшить размер
    bottom: target.bottom - shrinkBy.bottom,
    left: target.left + shrinkBy.left,
    right: target.right - shrinkBy.right,
    // двигаем вперед, чтобы уменьшить размер
    top: target.top + shrinkBy.top,
  }
}

const noSpacing: Spacing = {
  bottom: 0,
  left: 0,
  right: 0,
  top: 0,
}

interface CreateBoxArgs {
  borderBox: AnyRectType
  margin?: Spacing
  border?: Spacing
  padding?: Spacing
}

export function createBox({
  border = noSpacing,
  borderBox,
  margin = noSpacing,
  padding = noSpacing,
}: CreateBoxArgs): BoxModel {
  // marginBox = borderBox + margin
  const marginBox: Rect = getRect(expand(borderBox, margin))
  // borderBox = borderBox - padding
  const paddingBox: Rect = getRect(shrink(borderBox, border))
  // contentBox = paddingBox - padding
  const contentBox: Rect = getRect(shrink(paddingBox, padding))

  return {
    border,
    borderBox: getRect(borderBox),
    contentBox,
    margin,
    marginBox,
    padding,
    paddingBox,
  }
}

/**
 * Получает прямоугольник на основе заданных значений.
 *
 * @param {Spacing} param0 - Объект с полями bottom, left, right, top.
 * @returns {Rect} Возвращает прямоугольник.
 */
export function getRect({ bottom, left, right, top }: Spacing): Rect {
  const width: number = right - left
  const height: number = bottom - top

  const rect: Rect = {
    bottom,
    // Rect
    center: {
      x: (right + left) / 2,
      y: (bottom + top) / 2,
    },
    height,
    left,
    right,
    // ClientRect
    top,
    width,
    // DOMRect
    x: left,
    y: top,
  }

  return rect
}

/**
 * Вычисленные стили отступов всегда будут в пикселях.
 * Парсит строку в число.
 * @see https://codepen.io/alexreardon/pen/OZyqXe
 *
 * @param {string} raw - Строка для парсинга.
 * @returns {number} Возвращает число.
 */
function parse(raw: string): number {
  const value: string = raw.slice(0, -2)
  const suffix: string = raw.slice(-2)

  // ## Используемые значения против вычисленных значений
  // `getComputedStyle` вернет * используемые значения *, если
  // элемент имеет `display: none` и *вычисленные значения* в противном случае
  // *используемые значения* могут включать 'rem' и т.д.
  // Вместо выбрасывания исключения мы возвращаем `0`.
  // Учитывая, что элемент _not visible_, он не занимает видимого пространства, поэтому `0` - это правильно
  // ## `jsdom`
  // Сырое значение также может не быть заполнено в jsdom
  if (suffix !== 'px')
    return 0

  const result: number = Number(value)

  invariant(
    !Number.isNaN(result),
      `Could not parse value [raw: ${raw}, without suffix: ${value}]`,
  )

  return result
}

/**
 * Получает текущую позицию прокрутки окна.
 *
 * @returns {Position} Возвращает позицию прокрутки.
 */
function getWindowScroll(): Position {
  return {
    x: window.scrollX,
    y: window.scrollY,
  }
}

/**
 * Смещает целевой объект на заданную позицию.
 *
 * @param {Spacing} target - Целевой объект.
 * @param {Position} shiftBy - Позиция для смещения.
 * @returns {Spacing} Возвращает смещенный объект.
 */
function shift(target: Spacing, shiftBy: Position): Spacing {
  return {
    bottom: target.bottom + shiftBy.y,
    left: target.left + shiftBy.x,
    right: target.right + shiftBy.x,
    top: target.top + shiftBy.y,
  }
}
