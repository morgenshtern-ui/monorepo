/* eslint-disable unicorn/no-thenable */
/* eslint-disable ts/no-unsafe-return */
/* eslint-disable ts/await-thenable */
/* eslint-disable ts/promise-function-async */
/* eslint-disable unicorn/no-array-reduce */
import pLimit from 'p-limit'

/**
 * Internal marker for filtered items
 */
const VOID = Symbol('p-void')

interface POptions {
  /**
   * How many promises are resolved at the same time.
   */
  concurrency?: number | undefined
}

class PInstance<T = any> extends Promise<Awaited<T>[]> {
  public items: Iterable<T> = []
  public options?: POptions | undefined
  private readonly promises = new Set<Promise<T> | T>()

  public constructor(items: Iterable<T> = [], options?: POptions) {
    super(() => {})
    this.items = items
    this.options = options
  }

  public get promise(): Promise<Awaited<T>[]> {
    let batch
    const items = [...this.items, ...this.promises]

    if (this.options?.concurrency) {
      const limit = pLimit(this.options.concurrency)

      // eslint-disable-next-line ts/no-shadow
      batch = Promise.all(items.map(p => limit(() => p)))
    }
    else {
      batch = Promise.all(items)
    }

    return batch.then(l => l.filter((i: any) => i !== VOID))
  }

  public add(...args: (Promise<T> | T)[]) {
    for (const i of args)
      this.promises.add(i)
  }

  public map<U>(fn: (value: Awaited<T>, index: number) => U): PInstance<Promise<U>> {
    return new PInstance(
      [...this.items]
        .map(async (i, idx) => {
          const v = await i

          if ((v as any) === VOID)
            return VOID as unknown as U

          return fn(v, idx)
        }),
      this.options,
    )
  }

  public filter(fn: (value: Awaited<T>, index: number) => Promise<boolean> | boolean): PInstance<Promise<T>> {
    return new PInstance(
      [...this.items]
        .map(async (i, idx) => {
          const v = await i
          const r = await fn(v, idx)

          if (!r)
            return VOID as unknown as T

          return v
        }),
      this.options,
    )
  }

  public forEach(fn: (value: Awaited<T>, index: number) => void): Promise<void> {
    return this.map(fn).then()
  }

  public reduce<U>(fn: (previousValue: U, currentValue: Awaited<T>, currentIndex: number, array: Awaited<T>[]) => U, initialValue: U): Promise<U> {
    return this.promise.then(array => array.reduce(fn, initialValue))
  }

  public clear() {
    this.promises.clear()
  }

  public override then(fn?: () => PromiseLike<any>) {
    // eslint-disable-next-line ts/no-shadow
    const p = this.promise

    return fn ? p.then(fn) : p
  }

  public override catch(fn?: (err: unknown) => PromiseLike<any>) {
    return this.promise.catch(fn)
  }

  public override finally(fn?: () => void) {
    return this.promise.finally(fn)
  }
}

/**
 * Utility for managing multiple promises.
 *
 * @see https://github.com/antfu/utils/tree/main/docs/p.md
 * @category Promise
 * @example
 * ```
 * import { p } from '@antfu/utils'
 *
 * const items = [1, 2, 3, 4, 5]
 *
 * await p(items)
 *   .map(async i => await multiply(i, 3))
 *   .filter(async i => await isEven(i))
 * // [6, 12]
 * ```
 */
// ts/promise-function-async
export function p<T = any>(items?: Iterable<T>, options?: POptions): PInstance<T> {
  return new PInstance(items, options)
}
