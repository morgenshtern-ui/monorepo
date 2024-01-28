import { getCandidates, getCandidatesIteratively } from './candidates.js'
import { candidateSelector, focusableCandidateSelector } from './constants.js'
import { isNodeMatchingSelectorFocusable, isNodeMatchingSelectorTabbable, isValidShadowRootTabbable } from './match.js'
import { matches } from './node.js'
import { sortByOrder } from './sort.js'
import type { FocusableElement, TabbableCheckOptions, TabbableOptions } from './types.js'

export function tabbable(container: Element, options?: TabbableCheckOptions & TabbableOptions): FocusableElement[] {
  options ||= {}

  const candidates = options.getShadowRoot
    ? getCandidatesIteratively([container], options.includeContainer || false, {
      filter: isNodeMatchingSelectorTabbable.bind(undefined, options),
      flatten: false,
      getShadowRoot: options.getShadowRoot,
      shadowRootFilter: isValidShadowRootTabbable,
    })
    : getCandidates(
      container,
      options.includeContainer || false,
      isNodeMatchingSelectorTabbable.bind(undefined, options),
    )

  return sortByOrder(candidates)
}
export function focusable(container: Element, options?: TabbableCheckOptions & TabbableOptions): FocusableElement[] {
  options ||= {}

  const candidates = options.getShadowRoot
    ? getCandidatesIteratively([container], options.includeContainer || false, {
      filter: isNodeMatchingSelectorFocusable.bind(undefined, options),
      flatten: true,
      getShadowRoot: options.getShadowRoot,
    })
    : getCandidates(
      container,
      options.includeContainer || false,
      isNodeMatchingSelectorFocusable.bind(undefined, options),
    )

  return candidates as FocusableElement[]
}

export function isTabbable(node: Element, options?: TabbableCheckOptions): boolean {
  options ||= {}

  if (!node)
    throw new Error('No node provided')

  if (!matches.call(node, candidateSelector))
    return false

  return isNodeMatchingSelectorTabbable(options, node)
}

export function isFocusable(node: Element, options?: TabbableCheckOptions): boolean {
  options ||= {}

  if (!node)
    throw new Error('No node provided')

  if (!matches.call(node, focusableCandidateSelector))
    return false

  return isNodeMatchingSelectorFocusable(options, node)
}
