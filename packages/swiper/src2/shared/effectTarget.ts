import { getSlideTransformEl } from './utils.ts'

export function effectTarget(effectParams, slideEl) {
  const transformEl = getSlideTransformEl(slideEl)

  if (transformEl !== slideEl) {
    transformEl.style.backfaceVisibility = 'hidden'
    transformEl.style['-webkit-backface-visibility'] = 'hidden'
  }

  return transformEl
}
