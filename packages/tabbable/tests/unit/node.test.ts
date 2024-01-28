/* eslint-disable ts/ban-ts-comment */
import { describe, expect, it } from 'vitest'

import { isFocusable, isTabbable } from '../../src/index.js'

describe('tabbable unit tests', () => {
  it('should throw with no input node', () => {
    // @ts-expect-error
    expect(() => isFocusable()).toThrow()
    // @ts-expect-error
    expect(() => isTabbable()).toThrow()
  })
})
