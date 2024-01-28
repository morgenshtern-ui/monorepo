import { candidateSelector } from './constants.js'
import { isInert, matches } from './node.js'
import type { FocusableElement, GetShadowRoot } from './types.js'

export type ShadowRootFilter = (shadowHostNode: Element) => boolean

export interface CandidateScope {
  scopeParent: Element
  candidates: FocusableElement[]
}

export interface IterativeOptions {
  getShadowRoot: GetShadowRoot | boolean
  filter: (node: Element) => boolean
  flatten: boolean
  shadowRootFilter?: ShadowRootFilter
}

export function getCandidates(
  container: Element,
  includeContainer: boolean,
  filter: (node: Element) => boolean,
): FocusableElement[] {
  // даже если `includeContainer=false`, мы все равно должны проверить его на инертность, потому что
  // если он инертен, то все его дочерние элементы инертны
  if (isInert(container))
    return []

  const candidates = [...container.querySelectorAll<FocusableElement>(candidateSelector)]

  if (includeContainer && matches.call(container, candidateSelector))
    candidates.unshift(container as FocusableElement)

  return candidates.filter(filter)
}

export function getCandidatesIteratively(
  elements: Element[],
  includeContainer: boolean,
  options: IterativeOptions,
): Array<CandidateScope | FocusableElement> {
  const candidates: Array<CandidateScope | FocusableElement> = []
  const elementsToCheck = [...elements]

  function pushCandidates(list: FocusableElement[], scopeParent?: Element) {
    if (options.flatten) {
      candidates.push(...list)

      return
    }

    if (scopeParent) {
      candidates.push({
        scopeParent,
        candidates: list,
      })
    }
  }

  while (elementsToCheck.length > 0) {
    const element = elementsToCheck.shift()

    if (!element)
      continue

    if (isInert(element, false)) {
      // нет необходимости смотреть, так как мы углубляемся
      continue
    }

    if (element.tagName === 'SLOT') {
      // добавить область действия слота Shadow dom (сам слот не может быть сфокусирован)
      const assigned = (element as HTMLSlotElement).assignedElements()
      const content = (assigned.length > 0 ? assigned : element.children) as Element[]
      const nestedCandidates = getCandidatesIteratively(content, true, options) as FocusableElement[]

      pushCandidates(nestedCandidates, element)
    }
    else {
      // проверьте элемент-кандидат
      const validCandidate = matches.call(element, candidateSelector)

      if (validCandidate && options.filter(element) && (includeContainer || !elements.includes(element)))
        candidates.push(element as FocusableElement)

      // перебирать теневой контент, если это возможно
      const shadowRoot
        = element.shadowRoot
        // check for an undisclosed shadow
        || (typeof options.getShadowRoot === 'function' && options.getShadowRoot(element))

      const validShadowRoot
        = !isInert(shadowRoot as ShadowRoot, false) && (!options.shadowRootFilter || options.shadowRootFilter(element))

      if (shadowRoot && validShadowRoot) {
        // add shadow dom scope IIF a shadow root node was given; otherwise, an undisclosed
        //  shadow exists, so look at light dom children as fallback BUT create a scope for any
        //  child candidates found because they're likely slotted elements (elements that are
        //  children of the web component element (which has the shadow), in the light dom, but
        //  slotted somewhere _inside_ the undisclosed shadow) -- the scope is created below,
        //  _after_ we return from this recursive call
        const nestedCandidates = getCandidatesIteratively(
          shadowRoot === true ? [...element.children] : [...shadowRoot.children],
          true,
          options,
        ) as FocusableElement[]

        pushCandidates(nestedCandidates, element)
      }
      else {
        // там нет тени, поэтому просто копайтесь в дочерних элементах элемента (light dom) __without__ придания элементу специальной обработки области видимости
        elementsToCheck.unshift(...element.children)
      }
    }
  }

  return candidates
}
