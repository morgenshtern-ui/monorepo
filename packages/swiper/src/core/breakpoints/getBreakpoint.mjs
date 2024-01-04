import { getWindow } from '@teleskop-labs/ssr-window'

export default function getBreakpoint(breakpoints, base = 'window', containerEl) {
  if (!breakpoints || (base === 'container' && !containerEl))
    return undefined

  let breakpoint = false

  const window = getWindow()
  const currentHeight = base === 'window' ? window.innerHeight : containerEl.clientHeight

  const points = Object.keys(breakpoints).map((point) => {
    if (typeof point === 'string' && point.startsWith('@')) {
      const minRatio = Number.parseFloat(point.slice(1))
      const value = currentHeight * minRatio

      return { value, point }
    }

    return { value: point, point }
  })

  points.sort((a, b) => Number.parseInt(a.value, 10) - Number.parseInt(b.value, 10))

  for (const { point, value } of points) {
    if (base === 'window') {
      if (window.matchMedia(`(min-width: ${value}px)`).matches)
        breakpoint = point
    }
    else if (value <= containerEl.clientWidth) {
      breakpoint = point
    }
  }

  return breakpoint || 'max'
}
