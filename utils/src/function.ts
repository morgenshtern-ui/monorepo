import type { Fn, Nillable } from './types.js'

/**
 * Call every function in an array
 */
export function batchInvoke(functions: Nillable<Fn>[]) {
  for (const fn of functions) fn?.()
}

/**
 * Call the function
 */
export function invoke(fn: Fn) {
  fn()
}

/**
 * Pass the value through the callback, and return the value
 *
 * @example
 * ```
 * function createUser(name: string): User {
 *   return tap(new User, user => {
 *     user.name = name
 *   })
 * }
 * ```
 */
export function tap<T>(value: T, callback: (value: T) => void): T {
  callback(value)

  return value
}
