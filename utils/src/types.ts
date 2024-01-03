/**
 * Promise, or maybe not
 */
export type Awaitable<T> = PromiseLike<T> | T

/**
 * Null or undefined or whatever
 */
export type Nillable<T> = T | null | undefined

/**
 * Null  or whatever
 */
export type Nullable<T> = T | null

/**
 * Undefined or whatever
 */
export type Optional<T> = T | undefined

/**
 * Array, or not yet
 */
export type Arrayable<T> = Array<T> | T

/**
 * Function
 */
export type Fn<T = void> = () => T

/**
 * Constructor
 */
export type Constructor<T = void> = new (...args: any[]) => T

/**
 * Infers the element type of an array
 */
export type ElementOf<T> = T extends (infer E)[] ? E : never

/**
 * Defines an intersection type of all union items.
 *
 * @param U Union of any types that will be intersected.
 * @returns U items intersected
 * @see https://stackoverflow.com/a/50375286/9259330
 */
export type UnionToIntersection<U> = (U extends unknown ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

/**
 * Infers the arguments type of a function
 */
export type ArgumentsType<T> = T extends ((...args: infer A) => any) ? A : never

export type MergeInsertions<T> =
  T extends object
    ? { [K in keyof T]: MergeInsertions<T[K]> }
    : T

export type DeepMerge<F, S> = MergeInsertions<{
  [K in keyof F | keyof S]: K extends keyof F & keyof S
    ? DeepMerge<F[K], S[K]>
    : K extends keyof S
      ? S[K]
      : K extends keyof F
        ? F[K]
        : never;
}>
