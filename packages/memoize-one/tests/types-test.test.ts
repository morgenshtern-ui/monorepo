/* eslint-disable ts/no-unsafe-return */
/* eslint-disable unicorn/consistent-function-scoping */
import { expectTypeOf } from 'expect-type'
import { expect, it } from 'vitest'
import { memoizeOne as memoize } from '../src/index.js'
import type { EqualityFn, MemoizedFn } from './../src/index.js'

function isDeepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2)
    return true

  if (typeof obj1 !== 'object' || obj1 === null || typeof obj2 !== 'object' || obj2 === null)
    return false

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length)
    return false

  for (const key of keys1) {
    if (!keys2.includes(key) || !isDeepEqual(obj1[key], obj2[key]))
      return false
  }

  return true
}

it('should maintain the types of the original function', () => {
  function getLocation(this: Window, _value: number) {
    return this.location
  }
  const memoized = memoize(getLocation)

  expectTypeOf<ThisParameterType<typeof getLocation>>().toEqualTypeOf<
    ThisParameterType<typeof memoized>
  >()
  expectTypeOf<Parameters<typeof getLocation>>().toEqualTypeOf<Parameters<typeof memoized>>()
  expectTypeOf<ReturnType<typeof getLocation>>().toEqualTypeOf<ReturnType<typeof memoized>>()
})

it('should add a .clear function property', () => {
  function add(first: number, second: number) {
    return first + second
  }
  const memoized = memoize(add)

  memoized.clear()

  // @ts-expect-error: foo
  expect(() => memoized.foo()).toThrow()

  expectTypeOf<typeof memoized.clear>().toEqualTypeOf<() => void>()
})

it('should return a `MemoizedFn<T>`', () => {
  function add(first: number, second: number): number {
    return first + second
  }

  const memoized = memoize(add)

  expectTypeOf<typeof memoized>().toEqualTypeOf<MemoizedFn<typeof add>>()
})

it('should allow you to leverage the MemoizedFn generic to allow many memoized functions', () => {
  function withDeepEqual<TFunc extends (...args: any[]) => any>(fn: TFunc): MemoizedFn<TFunc> {
    return memoize(fn, isDeepEqual)
  }

  function add(first: number, second: number): number {
    return first + second
  }

  const memoized = withDeepEqual(add)

  expectTypeOf<typeof memoized>().toEqualTypeOf<MemoizedFn<typeof add>>()
})

it('should return a memoized function that satisies a typeof check for the original function', () => {
  function add(first: number, second: number): number {
    return first + second
  }

  function caller(fn: typeof add) {
    return fn(1, 2)
  }
  const memoized = memoize(add)

  // this line is the actual type test
  const result = caller(memoized)

  expectTypeOf<typeof result>().toEqualTypeOf<number>()
})

it('should allow casting back to the original function type', () => {
  type AddFn = (first: number, second: number) => number

  function add(first: number, second: number): number {
    return first + second
  }
  // baseline
  {
    const memoized = memoize(add)

    // @ts-expect-error: foo
    expectTypeOf<typeof memoized>().toEqualTypeOf<AddFn>()
    expectTypeOf<typeof memoized>().toEqualTypeOf<MemoizedFn<typeof add>>()
    expectTypeOf<typeof memoized>().toEqualTypeOf<MemoizedFn<AddFn>>()
    expectTypeOf<typeof memoized>().toMatchTypeOf<MemoizedFn<typeof add>>()
    expectTypeOf<typeof memoized>().toMatchTypeOf<MemoizedFn<AddFn>>()
  }
  {
    const memoized: typeof add = memoize(add)

    expectTypeOf<typeof memoized>().toEqualTypeOf<AddFn>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<typeof add>>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<AddFn>>()
  }
  {
    const memoized: AddFn = memoize(add)

    expectTypeOf<typeof memoized>().toEqualTypeOf<AddFn>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<typeof add>>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<AddFn>>()
  }
  {
    const memoized = memoize(add) as typeof add

    expectTypeOf<typeof memoized>().toEqualTypeOf<AddFn>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<typeof add>>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<AddFn>>()
  }
  {
    const memoized = memoize(add) as AddFn

    expectTypeOf<typeof memoized>().toEqualTypeOf<AddFn>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<typeof add>>()
    expectTypeOf<typeof memoized>().not.toMatchTypeOf<MemoizedFn<AddFn>>()
  }
})

it('should type the equality function to based on the provided function', () => {
  function add(first: number, second: number) {
    return first + second
  }

  expectTypeOf<EqualityFn<typeof add>>().toEqualTypeOf<
    (newArgs: Parameters<typeof add>, lastArgs: Parameters<typeof add>) => boolean
  >()
  expectTypeOf<EqualityFn<typeof add>>().toEqualTypeOf<
    (newArgs: [number, number], lastArgs: [number, number]) => boolean
  >()
})

it('should allow weaker equality function types', () => {
  function add(first: number, second: number): number {
    return first + second
  }

  // ✅ exact parameters of `add`
  {
    const isEqual = function (_first: Parameters<typeof add>, _second: Parameters<typeof add>) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ tuple of the correct types
  {
    const isEqual = function (_first: [number, number], _second: [number, number]) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ❌ tuple of incorrect types
  {
    const isEqual = function (_first: [number, string], _second: [number, number]) {
      return true
    }

    expectTypeOf<typeof isEqual>().not.toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ array of the correct types
  {
    const isEqual = function (_first: number[], _second: number[]) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ❌ array of incorrect types
  {
    const isEqual = function (_first: string[], _second: number[]) {
      return true
    }

    expectTypeOf<typeof isEqual>().not.toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ tuple of 'unknown'
  {
    const isEqual = function (_first: [unknown, unknown], _second: [unknown, unknown]) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ❌ tuple of 'unknown' of incorrect length
  {
    const isEqual = function (_first: [unknown, unknown, unknown], _second: [unknown, unknown]) {
      return true
    }

    expectTypeOf<typeof isEqual>().not.toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ array of 'unknown'
  {
    const isEqual = function (_first: unknown[], _second: unknown[]) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ spread of 'unknown'
  {
    const isEqual = function (...first: unknown[]) {
      return !!first
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ tuple of 'any'
  {
    const isEqual = function (_first: [any, any], _second: [any, any]) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ❌ tuple of 'any' or incorrect size
  {
    const isEqual = function (_first: [any, any, any], _second: [any, any]) {
      return true
    }

    expectTypeOf<typeof isEqual>().not.toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ array of 'any'
  {
    const isEqual = function (_first: any[], _second: any[]) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ two arguments of type any
  {
    const isEqual = function (_first: any, _second: any) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ a single argument of type any
  {
    const isEqual = function (_first: any) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }

  // ✅ spread of any type
  {
    const isEqual = function (..._first: any[]) {
      return true
    }

    expectTypeOf<typeof isEqual>().toMatchTypeOf<EqualityFn<typeof add>>()
  }
})
