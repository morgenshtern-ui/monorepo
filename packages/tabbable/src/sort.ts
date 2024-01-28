import type { CandidateScope } from './candidates.js'
import { getTabindex } from './node.js'
import type { Arrayable, FocusableElement } from './types.js'

export interface TabbableItem {
  documentOrder: number
  item: CandidateScope | FocusableElement
  tabIndex: number
  isScope: boolean
  content: Arrayable<FocusableElement>
}

export function sortOrderedTabbables(a: TabbableItem, b: TabbableItem) {
  return a.tabIndex === b.tabIndex ? a.documentOrder - b.documentOrder : a.tabIndex - b.tabIndex
}

export function sortByOrder(candidates: Array<CandidateScope | FocusableElement>): FocusableElement[] {
  const regularTabbables: FocusableElement[] = []
  const orderedTabbables: TabbableItem[] = []

  for (const [i, item] of candidates.entries()) {
    const isScope = !!(item as CandidateScope).scopeParent
    const element: FocusableElement = resolveFocusableElement(item)
    const candidateTabindex = getTabindex(element as HTMLElement, isScope)
    const elements: Arrayable<FocusableElement> = isScope ? sortByOrder((item as CandidateScope).candidates) : element

    if (candidateTabindex === 0) {
      if (isScope)
        regularTabbables.push(...(elements as FocusableElement[]))
      else
        regularTabbables.push(elements as FocusableElement)
    }
    else {
      orderedTabbables.push({
        documentOrder: i,
        tabIndex: candidateTabindex,
        item,
        isScope,
        content: elements,
      })
    }
  }

  const sortedOrderedTabbables = orderedTabbables.sort(sortOrderedTabbables)

  const list: FocusableElement[] = []

  for (const item of sortedOrderedTabbables) {
    if (item.isScope)
      list.push(...(item.content as FocusableElement[]))
    else
      list.push(item.content as FocusableElement)
  }

  return [
    ...list,
    ...regularTabbables,
  ]
}

function resolveFocusableElement(item: CandidateScope | FocusableElement): FocusableElement {
  const isScope = !!(item as CandidateScope).scopeParent

  if (isScope)
    return (item as CandidateScope).scopeParent as FocusableElement

  return item as FocusableElement
}
