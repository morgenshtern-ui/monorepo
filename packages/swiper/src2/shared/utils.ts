import { getDocument, getWindow } from '@teleskop-labs/ssr-window'
import { classesToTokens } from './classesToTokens.js'

export function deleteProps(obj) {
  const object = obj

  for (const key of Object.keys(object)) {
    try {
      object[key] = null
    }
    catch {
      // no getter for object
    }
    try {
      delete object[key]
    }
    catch {
      // something got wrong
    }
  }
}

export function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay)
}

export function now() {
  return Date.now()
}

export function getComputedStyle(el) {
  const window = getWindow()
  let style

  if (window.getComputedStyle)
    style = window.getComputedStyle(el, null)

  if (!style && el.currentStyle)
    style = el.currentStyle

  if (!style)
    style = el.style

  return style
}

export function getTranslate(el, axis = 'x') {
  const window = getWindow()
  let matrix
  let curTransform
  let transformMatrix

  const curStyle = getComputedStyle(el, null)

  if (window.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform

    if (curTransform.split(',').length > 6) {
      curTransform = curTransform
        .split(', ')
        .map(a => a.replace(',', '.'))
        .join(', ')
    }

    // Some old versions of Webkit choke when 'none' is passed; pass
    // empty string instead in this case
    transformMatrix = new window.WebKitCSSMatrix(curTransform === 'none' ? '' : curTransform)
  }
  else {
    transformMatrix
      = curStyle.MozTransform
      || curStyle.OTransform
      || curStyle.MsTransform
      || curStyle.msTransform
      || curStyle.transform
      || curStyle.getPropertyValue('transform').replace('translate(', 'matrix(1, 0, 0, 1,')
    matrix = transformMatrix.toString().split(',')
  }

  if (axis === 'x') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix)
      curTransform = transformMatrix.m41
    // Crazy IE10 Matrix
    else if (matrix.length === 16)
      curTransform = Number.parseFloat(matrix[12])
    // Normal Browsers
    else curTransform = Number.parseFloat(matrix[4])
  }

  if (axis === 'y') {
    // Latest Chrome and webkits Fix
    if (window.WebKitCSSMatrix)
      curTransform = transformMatrix.m42
    // Crazy IE10 Matrix
    else if (matrix.length === 16)
      curTransform = Number.parseFloat(matrix[13])
    // Normal Browsers
    else curTransform = Number.parseFloat(matrix[5])
  }

  return curTransform || 0
}

export function isObject(o) {
  return (
    typeof o === 'object'
    && o !== null
    && o.constructor
    && Object.prototype.toString.call(o).slice(8, -1) === 'Object'
  )
}

function isNode(node) {
  // eslint-disable-next-line
  if (typeof window !== 'undefined' && typeof window.HTMLElement !== 'undefined') {
    return node instanceof HTMLElement
  }

  return node && (node.nodeType === 1 || node.nodeType === 11)
}

export function extend(...args) {
  const to = new Object(args[0])
  const noExtend = new Set(['__proto__', 'constructor', 'prototype'])

  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i]

    if (nextSource !== undefined && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(new Object(nextSource)).filter(key => !noExtend.has(key))

      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex]
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey)

        if (desc !== undefined && desc.enumerable) {
          if (isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__)
              to[nextKey] = nextSource[nextKey]

            else
              extend(to[nextKey], nextSource[nextKey])
          }
          else if (!isObject(to[nextKey]) && isObject(nextSource[nextKey])) {
            to[nextKey] = {}

            if (nextSource[nextKey].__swiper__)
              to[nextKey] = nextSource[nextKey]

            else
              extend(to[nextKey], nextSource[nextKey])
          }
          else {
            to[nextKey] = nextSource[nextKey]
          }
        }
      }
    }
  }

  return to
}

export function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue)
}

export function animateCSSModeScroll({ swiper, targetPosition, side }) {
  const window = getWindow()
  const startPosition = -swiper.translate
  let startTime = null
  let time
  const duration = swiper.params.speed

  swiper.wrapperEl.style.scrollSnapType = 'none'
  window.cancelAnimationFrame(swiper.cssModeFrameID)

  const dir = targetPosition > startPosition ? 'next' : 'prev'

  const isOutOfBound = (current, target) => {
    return (dir === 'next' && current >= target) || (dir === 'prev' && current <= target)
  }

  const animate = () => {
    time = Date.now()

    if (startTime === null)
      startTime = time

    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0)
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition)

    if (isOutOfBound(currentPosition, targetPosition))
      currentPosition = targetPosition

    swiper.wrapperEl.scrollTo({
      [side]: currentPosition,
    })

    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper.wrapperEl.style.overflow = 'hidden'
      swiper.wrapperEl.style.scrollSnapType = ''
      setTimeout(() => {
        swiper.wrapperEl.style.overflow = ''
        swiper.wrapperEl.scrollTo({
          [side]: currentPosition,
        })
      })
      window.cancelAnimationFrame(swiper.cssModeFrameID)

      return
    }

    swiper.cssModeFrameID = window.requestAnimationFrame(animate)
  }

  animate()
}

export function getSlideTransformEl(slideEl) {
  return (
    slideEl.querySelector('.swiper-slide-transform')
    || (slideEl.shadowRoot?.querySelector('.swiper-slide-transform'))
    || slideEl
  )
}

export function findElementsInElements(elements = [], selector = '') {
  const found = []

  for (const el of elements)
    found.push(...el.querySelectorAll(selector))

  return found
}

export function elementChildren(element, selector = '') {
  return [...element.children].filter(el => el.matches(selector))
}

export function showWarning(text) {
  try {
    console.warn(text)
  }
  catch {
    // err
  }
}

export function createElement(tag, classes = []) {
  const el = document.createElement(tag)

  el.classList.add(...(Array.isArray(classes) ? classes : classesToTokens(classes)))

  return el
}

export function elementOffset(el) {
  const window = getWindow()
  const document = getDocument()
  const box = el.getBoundingClientRect()
  const body = document.body
  const clientTop = el.clientTop || body.clientTop || 0
  const clientLeft = el.clientLeft || body.clientLeft || 0
  const scrollTop = el === window ? window.scrollY : el.scrollTop
  const scrollLeft = el === window ? window.scrollX : el.scrollLeft

  return {
    top: box.top + scrollTop - clientTop,
    left: box.left + scrollLeft - clientLeft,
  }
}

export function elementPrevAll(el, selector) {
  const prevEls = []

  while (el.previousElementSibling) {
    const prev = el.previousElementSibling; // eslint-disable-line

    if (selector) {
      if (prev.matches(selector))
        prevEls.push(prev)
    }
    else { prevEls.push(prev) }

    el = prev
  }

  return prevEls
}

export function elementNextAll(el, selector) {
  const nextEls = []

  while (el.nextElementSibling) {
    const next = el.nextElementSibling; // eslint-disable-line

    if (selector) {
      if (next.matches(selector))
        nextEls.push(next)
    }
    else { nextEls.push(next) }

    el = next
  }

  return nextEls
}

export function elementStyle(el, prop) {
  const window = getWindow()

  return window.getComputedStyle(el, null).getPropertyValue(prop)
}

export function elementIndex(el) {
  let child = el
  let i

  if (child) {
    i = 0
    // eslint-disable-next-line
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1)
        i += 1
    }

    return i
  }

  return undefined
}

export function elementParents(el, selector) {
  const parents = []; // eslint-disable-line
  let parent = el.parentElement; // eslint-disable-line

  while (parent) {
    if (selector) {
      if (parent.matches(selector))
        parents.push(parent)
    }
    else {
      parents.push(parent)
    }

    parent = parent.parentElement
  }

  return parents
}

export function elementTransitionEnd(el, callback) {
  function fireCallBack(e) {
    if (e.target !== el)
      return

    callback.call(el, e)
    el.removeEventListener('transitionend', fireCallBack)
  }

  if (callback)
    el.addEventListener('transitionend', fireCallBack)
}

export function elementOuterSize(el, size, includeMargins) {
  const window = getWindow()

  if (includeMargins) {
    return (
      el[size === 'width' ? 'offsetWidth' : 'offsetHeight']
      + Number.parseFloat(
        window
          .getComputedStyle(el, null)
          .getPropertyValue(size === 'width' ? 'margin-right' : 'margin-top'),
      )
      + Number.parseFloat(
        window
          .getComputedStyle(el, null)
          .getPropertyValue(size === 'width' ? 'margin-left' : 'margin-bottom'),
      )
    )
  }

  return el.offsetWidth
}
