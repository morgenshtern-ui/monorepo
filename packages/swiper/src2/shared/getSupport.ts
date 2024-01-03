import { getDocument, getWindow } from '@teleskop-labs/ssr-window'

let support: ReturnType<typeof calcSupport>

export function getSupport() {
  if (!support)
    support = calcSupport()

  return support
}

function calcSupport() {
  const window = getWindow() as any
  const document = getDocument()

  return {
    smoothScroll:
      document.documentElement?.style
      && 'scrollBehavior' in document.documentElement.style,

    touch: !!(
      'ontouchstart' in window
      || (window.DocumentTouch && document instanceof window.DocumentTouch)
    ),
  }
}
