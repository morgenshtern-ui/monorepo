import { isHidden } from './dom.js'
import {
  getTabindex,
  isDetailsWithSummary,
  isDisabledFromFieldset,
  isHiddenInput,
  isInert,
  isNonTabbableRadio,
} from './node.js'
import type { TabbableCheckOptions } from './types.js'

export function isNodeMatchingSelectorFocusable(options: TabbableCheckOptions, node: Element) {
  if (
    (node as HTMLInputElement).disabled
    || isInert(node)
    || isHiddenInput(node)
    || isHidden(node, options)
    || isDetailsWithSummary(node)
    || isDisabledFromFieldset(node)
  )
    return false

  return true
}

export function isNodeMatchingSelectorTabbable(options: TabbableCheckOptions, node: Element) {
  if (
    isNonTabbableRadio(node)
    || getTabindex(node as HTMLElement) < 0
    || !isNodeMatchingSelectorFocusable(options, node)
  )
    return false

  return true
}

export function isValidShadowRootTabbable(shadowHostNode: Element) {
  const tabIndex = Number.parseInt(shadowHostNode.getAttribute('tabindex') ?? '')

  if (Number.isNaN(tabIndex) || tabIndex >= 0)
    return true

  // If a custom element has an explicit negative tabindex,
  // browsers will not allow tab targeting said element's children.
  return false
}
