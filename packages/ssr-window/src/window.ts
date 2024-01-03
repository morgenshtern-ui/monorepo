import { extend } from './extend.js'
import { ssrDocument } from './document.js'

export const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: '',
  },
  location: {
    hash: '',
    host: '',
    hostname: '',
    href: '',
    origin: '',
    pathname: '',
    protocol: '',
    search: '',
  },
  history: {
    replaceState() {},
    pushState() {},
    go() {},
    back() {},
  },
  CustomEvent: function CustomEvent() {
    return this
  },
  addEventListener() {},
  removeEventListener() {},
  getComputedStyle() {
    return {
      getPropertyValue() {
        return ''
      },
    }
  },
  Image() {},
  Date() {},
  screen: {},
  setTimeout() {},
  clearTimeout() {},
  matchMedia() {
    return {}
  },
  requestAnimationFrame(callback: Function) {
    if (typeof setTimeout === 'undefined') {
      callback()

      return null
    }

    return setTimeout(callback, 0)
  },
  cancelAnimationFrame(handle: number) {
    if (typeof setTimeout === 'undefined')
      return

    clearTimeout(handle)
  },
}

export function getWindow() {
  const win: Window = typeof window !== 'undefined' ? window : ({} as Window)

  extend(win, ssrWindow)

  return win
}
