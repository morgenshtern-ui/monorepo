import { beforeEach, describe, expect, it } from 'vitest'

import { focusable, tabbable } from '../../src/index.js'
import { fixtures } from '../fixtures/fixtures'

const getElementIds = (elements: Element[]) => elements.map(el => el.id)

function expectElementsInOrder(receivedIds: string[], expectedIds: string[]) {
  expect(receivedIds).toStrictEqual(expectedIds)
}

describe('unit tests', () => {
  let options: any

  beforeEach(() => {
    // NOTE: in jest, the only display check that's expected to work is 'none' because
    //  jsDom doesn't support the APIs needed to make the other modes work
    options = { displayCheck: 'none' }
  })

  describe('tabbable', () => {
    // NOTE: the attached node check only applies when displayCheck is NOT 'none'
    //  and since that's the only displayCheck we can use in JSDom, we expect to
    //  find the same nodes regardless of whether they're attached or not

    describe('basic example', () => {
      let container: any

      beforeEach(() => {
        container = document.createElement('div')
        container.innerHTML = fixtures.basic

        document.body.append(container)
      })

      it('correctly identifies tabbable elements', () => {
        const elements = tabbable(container, options)

        expectElementsInOrder(getElementIds(elements), [
          'tabindex-hrefless-anchor',
          'contenteditable-true', // JSDom doesn't appear to support contenteditable
          'contenteditable-nesting', // JSDom doesn't appear to support contenteditable
          'contenteditable-NaN-tabindex',
          'input',
          'input-readonly',
          'select',
          'select-readonly',
          'href-anchor',
          'textarea',
          'textarea-readonly',
          'button',
          'tabindex-div',
          'displaynone-textarea',
          'hiddenParentVisible-button',
          'displaycontents',
          'displaycontents-child',
          'displaycontents-child-displaynone',
          'audio-control',
          'audio-control-NaN-tabindex',
          'video-control',
          'video-control-NaN-tabindex',
        ])
      })
    })

    describe('inert example', () => {
      let container: any

      beforeEach(() => {
        container = document.createElement('div')
        container.innerHTML = fixtures.inert
        document.body.append(container)
      })

      it('correctly identifies tabbable elements', () => {
        const elements = tabbable(container, options)

        expectElementsInOrder(getElementIds(elements), [])
      })
    })
  })

  describe('focusable', () => {
    // NOTE: the attached node check only applies when displayCheck is NOT 'none'
    //  and since that's the only displayCheck we can use in JSDom, we expect to
    //  find the same nodes regardless of whether they're attached or not

    describe('basic example', () => {
      let container: any

      beforeEach(() => {
        container = document.createElement('div')
        container.innerHTML = fixtures.basic
        document.body.append(container)
      })

      it('correctly identifies focusable elements', () => {
        const elements = focusable(container, options)

        expectElementsInOrder(getElementIds(elements), [
          'contenteditable-true',
          'contenteditable-nesting',
          'contenteditable-negative-tabindex',
          'contenteditable-NaN-tabindex',
          'input',
          'input-readonly',
          'select',
          'select-readonly',
          'href-anchor',
          'tabindex-hrefless-anchor',
          'textarea',
          'textarea-readonly',
          'button',
          'tabindex-div',
          'negative-select',
          'displaynone-textarea',
          'hiddenParentVisible-button',
          'displaycontents',
          'displaycontents-child',
          'displaycontents-child-displaynone',
          'audio-control',
          'audio-control-NaN-tabindex',
          'video-control',
          'video-control-NaN-tabindex',
        ])
      })
    })

    describe('inert example', () => {
      let container: any

      beforeEach(() => {
        container = document.createElement('div')
        container.innerHTML = fixtures.inert
        document.body.append(container)
      })

      it('correctly identifies focusable elements', () => {
        const elements = focusable(container, options)

        expectElementsInOrder(getElementIds(elements), [])
      })
    })
  })
})
