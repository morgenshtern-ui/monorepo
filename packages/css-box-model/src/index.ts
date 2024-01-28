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

export function getBox(el: Element): BoxModel {
  // getBoundingClientRect always returns the borderBox
  const borderBox: DOMRect = el.getBoundingClientRect()
  const styles: CSSStyleDeclaration = window.getComputedStyle(el)

  return calculateBox(borderBox, styles)
}

// Exposing this function directly for performance. If you have already computed these things
// then you can simply pass them in
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

export function withScroll(original: BoxModel, scroll: Position = getWindowScroll()): BoxModel {
  return offset(original, scroll)
}

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

export function shrink(target: Spacing, shrinkBy: Spacing): Spacing {
  return {
    // pulling backwards to decrease size
    bottom: target.bottom - shrinkBy.bottom,
    left: target.left + shrinkBy.left,
    right: target.right - shrinkBy.right,
    // pushing forward to decrease size
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

// Computed spacing styles will always be in pixels
// https://codepen.io/alexreardon/pen/OZyqXe
function parse(raw: string): number {
  const value: string = raw.slice(0, -2)
  const suffix: string = raw.slice(-2)

  // ## Used values vs computed values
  // `getComputedStyle` will return the * used values * if the
  // element has `display: none` and the *computed values* otherwise
  // *used values* can include 'rem' etc.
  // Rather than throwing we are returning `0`.
  // Given that the element is _not visible_ it takes up no visible space and so `0` is correct
  // ## `jsdom`
  // The `raw` value can also not be populated in jsdom
  if (suffix !== 'px')
    return 0

  const result: number = Number(value)

  if (Number.isNaN(result))
    throw new Error(`Could not parse value [raw: ${raw}, without suffix: ${value}]`)

  return result
}

function getWindowScroll(): Position {
  return {
    x: window.scrollX,
    y: window.scrollY,
  }
}

function shift(target: Spacing, shiftBy: Position): Spacing {
  return {
    bottom: target.bottom + shiftBy.y,
    left: target.left + shiftBy.x,
    right: target.right + shiftBy.x,
    top: target.top + shiftBy.y,
  }
}
