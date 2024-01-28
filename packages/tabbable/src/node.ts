export const NoElement = typeof Element === 'undefined'

// eslint-disable-next-line ts/unbound-method
export const matches = NoElement ? () => false : Element.prototype.matches || Element.prototype.webkitMatchesSelector

export const getRootNode = NoElement
  ? (element: Element) => element?.ownerDocument
  : (element: Element) => element?.getRootNode?.()

export function isRadio(node: Element): node is HTMLInputElement {
  return isInput(node) && node.type === 'radio'
}

export function getCheckedRadio(nodes: HTMLInputElement[], form: HTMLFormElement) {
  for (const node of nodes) {
    if (node.checked && node.form === form)
      return node
  }

  return undefined
}

export function isElement(node: Node): node is Element {
  return node && node.nodeType === 1
}

export function isInput(node: Node): node is HTMLInputElement {
  if (!isElement(node))
    return false

  return node.tagName === 'INPUT'
}

export function isHiddenInput(node: Element): node is HTMLInputElement {
  return isInput(node) && node.type === 'hidden'
}

export function isDisabledFromFieldset(node: Element) {
  if (/^(?:INPUT|BUTTON|SELECT|TEXTAREA)$/.test(node.tagName)) {
    let parentNode = node.parentElement as HTMLFieldSetElement

    // check if `node` is contained in a disabled <fieldset>
    while (parentNode) {
      if (parentNode.tagName === 'FIELDSET' && parentNode.disabled) {
        // look for the first <legend> among the children of the disabled <fieldset>
        for (let index = 0; index < parentNode.children.length; index++) {
          const child = parentNode.children.item(index) as HTMLElement

          // when the first <legend> (in document order) is found
          if (child.tagName === 'LEGEND') {
            // if its parent <fieldset> is not nested in another disabled <fieldset>,
            // return whether `node` is a descendant of its first <legend>
            return matches.call(parentNode, 'fieldset[disabled] *') ? true : !child.contains(node)
          }
        }

        // the disabled <fieldset> containing `node` has no <legend>
        return true
      }

      parentNode = parentNode.parentElement as HTMLFieldSetElement
    }
  }

  // else, node's tabbable/focusable state should not be affected by a fieldset's
  //  enabled/disabled state
  return false
}

export function isDetailsWithSummary(node: Element) {
  return node.tagName === 'DETAILS' && [...node.children].some(child => child.tagName === 'SUMMARY')
}

export function isInert(node: Element | ShadowRoot, lookUp = true): boolean {
  // CAREFUL: JSDom does not support inert at all, so we can't use the `HTMLElement.inert`
  const inertAtt = (node as Element)?.getAttribute?.('inert')
  const inert = inertAtt === '' || inertAtt === 'true'
  const result = inert || (lookUp && node && isInert(node.parentNode as Element)) // recursive

  return result
}

export function isContentEditable(node: Element) {
  // CAREFUL: JSDom does not support the `HTMLElement.isContentEditable`
  const attValue = node?.getAttribute?.('contenteditable')

  return attValue === '' || attValue === 'true'
}

export function getTabindex(node: HTMLElement, isScope?: boolean) {
  if (
    node.tabIndex < 0
    && (isScope || /^(?:AUDIO|VIDEO|DETAILS)$/.test(node.tagName) || isContentEditable(node))
    && Number.isNaN(Number.parseInt(node.getAttribute('tabindex') ?? ''))
  )
    return 0

  return node.tabIndex
}

export function isTabbableRadio(node: HTMLInputElement) {
  if (!node.name)
    return true

  const radioScope = (node.form || getRootNode(node)) as HTMLElement

  function queryRadios(name: string): HTMLInputElement[] {
    return [...radioScope.querySelectorAll(`input[type="radio"][name="${name}"]`)] as HTMLInputElement[]
  }

  let radioSet: HTMLInputElement[]

  if (window?.CSS !== undefined && typeof window.CSS.escape === 'function') {
    radioSet = queryRadios(window.CSS.escape(node.name))
  }
  else {
    try {
      radioSet = queryRadios(node.name)
    }
    catch (error) {
      console.error(
        'Looks like you have a radio button with a name attribute containing invalid CSS selector characters and need the CSS.escape polyfill: %s',
        (error as Error).message,
      )

      return false
    }
  }

  const checked = node.form && getCheckedRadio(radioSet, node.form)

  return !checked || checked === node
}

export function isNonTabbableRadio(node: Element) {
  return isRadio(node) && !isTabbableRadio(node)
}
