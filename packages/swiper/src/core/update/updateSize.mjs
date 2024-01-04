import { elementStyle } from '../../shared/utils.mjs'

export default function updateSize() {
  const swiper = this
  let width
  let height
  const el = swiper.el

  width = swiper.params.width !== undefined && swiper.params.width !== null ? swiper.params.width : el.clientWidth

  height = swiper.params.height !== undefined && swiper.params.height !== null ? swiper.params.height : el.clientHeight

  if ((width === 0 && swiper.isHorizontal()) || (height === 0 && swiper.isVertical()))
    return

  // Subtract paddings
  width
    = width
    - Number.parseInt(elementStyle(el, 'padding-left') || 0, 10)
    - Number.parseInt(elementStyle(el, 'padding-right') || 0, 10)
  height
    = height
    - Number.parseInt(elementStyle(el, 'padding-top') || 0, 10)
    - Number.parseInt(elementStyle(el, 'padding-bottom') || 0, 10)

  if (Number.isNaN(width))
    width = 0

  if (Number.isNaN(height))
    height = 0

  Object.assign(swiper, {
    width,
    height,
    size: swiper.isHorizontal() ? width : height,
  })
}
