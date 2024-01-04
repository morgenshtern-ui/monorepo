function isObject(o) {
  return (
    typeof o === 'object'
    && o !== null
    && o.constructor
    && Object.prototype.toString.call(o).slice(8, -1) === 'Object'
    && !o.__swiper__
  )
}

function extend(target, src) {
  const noExtend = new Set(['__proto__', 'constructor', 'prototype'])

  for (const key of Object.keys(src)
    .filter(key => !noExtend.has(key))) {
    if (target[key] === undefined) { target[key] = src[key] }
    else if (isObject(src[key]) && isObject(target[key]) && Object.keys(src[key]).length > 0) {
      if (src[key].__swiper__)
        target[key] = src[key]
      else extend(target[key], src[key])
    }
    else {
      target[key] = src[key]
    }
  }
}

function needsNavigation(params = {}) {
  return (
    params.navigation
    && params.navigation.nextEl === undefined
    && params.navigation.prevEl === undefined
  )
}

function needsPagination(params = {}) {
  return params.pagination && params.pagination.el === undefined
}

function needsScrollbar(params = {}) {
  return params.scrollbar && params.scrollbar.el === undefined
}

function uniqueClasses(classNames = '') {
  const classes = classNames
    .split(' ')
    .map(c => c.trim())
    .filter(c => !!c)
  const unique = []

  for (const c of classes) {
    if (!unique.includes(c))
      unique.push(c)
  }

  return unique.join(' ')
}

function attrToProp(attrName = '') {
  return attrName.replaceAll(/-[a-z]/g, l => l.toUpperCase().replace('-', ''))
}

function wrapperClass(className = '') {
  if (!className)
    return 'swiper-wrapper'

  if (!className.includes('swiper-wrapper'))
    return `swiper-wrapper ${className}`

  return className
}

export {
  isObject,
  extend,
  needsNavigation,
  needsPagination,
  needsScrollbar,
  uniqueClasses,
  attrToProp,
  wrapperClass,
}
