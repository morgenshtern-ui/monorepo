export type Nillable<T> = T | null | undefined
export type Arrayable<T> = Array<T> | T
export type FocusableElement = Element | HTMLElement | SVGElement

export type GetShadowRoot = (element: Element) => Nillable<ShadowRoot | boolean>

export interface TabbableCheckOptions {
  displayCheck?: 'full' | 'non-zero-area' | 'none' | undefined
  getShadowRoot?: GetShadowRoot | boolean | undefined
}

export interface TabbableOptions {
  includeContainer?: boolean | undefined
}
