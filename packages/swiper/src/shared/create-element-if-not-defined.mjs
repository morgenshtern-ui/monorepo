import { createElement, elementChildren } from './utils.mjs'

export default function createElementIfNotDefined(swiper, originalParams, params, checkProps) {
  if (swiper.params.createElements) {
    for (const key of Object.keys(checkProps)) {
      if (!params[key] && params.auto === true) {
        let element = elementChildren(swiper.el, `.${checkProps[key]}`)[0]

        if (!element) {
          element = createElement('div', checkProps[key])
          element.className = checkProps[key]
          swiper.el.append(element)
        }

        params[key] = element
        originalParams[key] = element
      }
    }
  }

  return params
}
