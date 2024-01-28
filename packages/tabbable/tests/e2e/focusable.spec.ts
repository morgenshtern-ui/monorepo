/* eslint-disable ts/no-non-null-assertion */
import { expect, test } from '@playwright/test'
import { fixtures } from '../fixtures/fixtures.js'
import { type Window, baseUrl, setupFixture } from './e2e.helpers.js'

// See here how to get started:
// https://playwright.dev/docs/intro

test.describe('focusable', () => {
  test.describe('example fixtures', () => {
    for (const displayCheck of [undefined, 'full'] as const) {
      for (const inDocument of [true, false]) {
        const inDocumentName = inDocument ? '(container IN doc' : '(container NOT in doc'
        const displayCheckName = displayCheck ? `displayCheck=${displayCheck}` : '<default>'

        test(`correctly identifies focusable elements in the "basic" example ${inDocumentName}, displayCheck=${displayCheckName})`, async ({ page }) => {
          // eslint-disable-next-line playwright/no-conditional-in-test
          const expectedFocusableIds: string[] = inDocument
            ? [
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
                'hiddenParentVisible-button',
                'displaycontents-child',
                'audio-control',
                'audio-control-NaN-tabindex',
                'video-control',
                'video-control-NaN-tabindex',
              ]
            : []

          await page.goto(baseUrl)

          const ids = await page.evaluate((props) => {
            const { tabbable } = window as unknown as Window
            const container = document.createElement('div')

            container.innerHTML = props.content

            if (props.inDocument)
              document.body.append(container)

            const els = tabbable.focusable(container, { displayCheck: props.displayCheck })
            const res: string[] = []

            for (const el of els)
              res.push(el.id)

            return res
          }, {
            content: fixtures.basic,
            displayCheck,
            inDocument,
          })

          expect(ids).toEqual(expectedFocusableIds)
        })
      }
    }
  })

  test.describe('inertness', () => {
    for (const displayCheck of [undefined, 'full', 'non-zero-area', 'none'] as const) {
      const displayCheckName = displayCheck || '<default>'

      test(`correctly identifies focusable elements in the "inert" example with displayCheck=${displayCheckName}`, async ({ page }) => {
        await page.goto(baseUrl)

        const ids = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          document.body.append(container)

          // non-inert container, but every element inside of it is
          const els = tabbable.focusable(container, { displayCheck: props.displayCheck })
          const res: string[] = []

          for (const el of els)
            res.push(el.id)

          return res
        }, {
          content: fixtures.inert,
          displayCheck,
        })

        expect(ids).toEqual([])
      })

      test(`correctly identifies focusable elements in the "basic" example with displayCheck=${displayCheckName} when placed directly inside an inert container`, async ({ page }) => {
        await page.goto(baseUrl)

        const ids = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          container.inert = true
          document.body.append(container)

          // non-inert container, but every element inside of it is
          const els = tabbable.focusable(container, { displayCheck: props.displayCheck })
          const res: string[] = []

          for (const el of els)
            res.push(el.id)

          return res
        }, {
          content: fixtures.basic,
          displayCheck,
        })

        expect(ids).toEqual([])
      })

      test(`correctly identifies focusable elements in the "basic" example with displayCheck=${displayCheckName} when nested inside an inert container`, async ({ page }) => {
        await page.goto(baseUrl)

        const ids = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          container.inert = true

          const parentContainer = document.createElement('div')

          parentContainer.append(container)
          document.body.append(parentContainer)

          // non-inert parent has inert container which has non-inert children
          const els = tabbable.focusable(parentContainer, { displayCheck: props.displayCheck })
          const res: string[] = []

          for (const el of els)
            res.push(el.id)

          return res
        }, {
          content: fixtures.basic,
          displayCheck,
        })

        expect(ids).toEqual([])
      })

      test(`correctly identifies focusable elements in the "basic" example with displayCheck=${displayCheckName} when deeply nested inside an inert container`, async ({ page }) => {
        await page.goto(baseUrl)

        const ids = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content

          const parentContainer = document.createElement('div')

          parentContainer.inert = true
          parentContainer.append(container)

          const grandparentContainer = document.createElement('div')

          grandparentContainer.append(parentContainer)
          document.body.append(grandparentContainer)

          // non-inert grandparent has inert parent, which has non-container with children
          const els = tabbable.focusable(grandparentContainer, { displayCheck: props.displayCheck })
          const res: string[] = []

          for (const el of els)
            res.push(el.id)

          return res
        }, {
          content: fixtures.basic,
          displayCheck,
        })

        expect(ids).toEqual([])
      })
    }
  })

  test('correctly identifies focusable elements in the "nested" example', async ({ page }) => {
    await page.goto(baseUrl)

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures.nested,
    })

    const expectedFocusableIds = ['tabindex-div-0', 'tabindex-div-2', 'input']

    expect(ids).toEqual(expectedFocusableIds)
  })

  test('correctly identifies focusable elements in the "jqueryui" example', async ({ page }) => {
    await page.goto(baseUrl)

    const expectedFocusableIds = [
      'formTabindex',
      'visibleAncestor-inputTypeNone',
      'visibleAncestor-inputTypeText',
      'visibleAncestor-inputTypeCheckbox',
      'visibleAncestor-inputTypeRadio',
      'visibleAncestor-inputTypeButton',
      'visibleAncestor-button',
      'visibleAncestor-select',
      'visibleAncestor-textarea',
      'visibleAncestor-anchorWithHref',
      'visibleAncestor-spanWithTabindex',
      'visibleAncestor-divWithNegativeTabindex',
      'positionFixedButton',
      'inputTabindex0',
      'inputTabindex10',
      'inputTabindex-1',
      'inputTabindex-50',
      'spanTabindex0',
      'spanTabindex10',
      'spanTabindex-1',
      'spanTabindex-50',
      'dimensionlessParent',
      'dimensionlessParent-dimensionless',
    ]

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures.jqueryui,
    })

    expect(ids).toEqual(expectedFocusableIds)
  })

  test('correctly identifies focusable elements in the "non-linear" example', async ({ page }) => {
    await page.goto(baseUrl)

    const expectedFocusableIds = [
      'input',
      'select',
      'href-anchor',
      'textarea',
      'button',
      'tabindex-div-0',
      'input-1',
      'select-3',
      'href-anchor-1',
      'tabindex-hrefless-anchor-4',
      'textarea-12',
      'button-2',
      'tabindex-div-3',
    ]

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures['non-linear'],
    })

    expect(ids).toEqual(expectedFocusableIds)
  })

  test('correctly identifies focusable elements in the "changing content" example', async ({ page }) => {
    await page.goto(baseUrl)
    const expectedFocusableIds = ['visible-button-1', 'visible-button-2', 'visible-button-3']

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      container.id = 'container'
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures['changing-content'],
    })

    expect(ids).toEqual(expectedFocusableIds)

    const expectedFocusableIdsAfterSectionIsUnhidden = [
      'visible-button-1',
      'visible-button-2',
      'visible-button-3',
      'initially-hidden-button-1',
      'initially-hidden-button-2',
    ]

    const idsAfterSectionIsUnhidden = await page.evaluate(() => {
      const { tabbable } = window as unknown as Window

      const container = document.querySelector<HTMLElement>('#container')!

      container.querySelector<HTMLElement>('#initially-hidden')!.style.display = 'block'

      const els = tabbable.focusable(container)

      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    })

    expect(idsAfterSectionIsUnhidden).toEqual(expectedFocusableIdsAfterSectionIsUnhidden)
  })

  test('correctly identifies focusable elements in the "svg" example', async ({ page }) => {
    await page.goto(baseUrl)
    const expectedFocusableIds = ['svg-btn', 'svg-1', 'svg-2']

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures.svg,
    })

    expect(ids).toEqual(expectedFocusableIds)
  })

  test('correctly identifies focusable elements in the "radio" example', async ({ page }) => {
    await page.goto(baseUrl)

    const expectedFocusableIds = [
      'form1-radioA',
      'form1-radioB',
      'form2-radioA',
      'form2-radioB',
      'form3-radioA',
      'form3-radioB',
      'noform-radioA',
      'noform-radioB',
      'noform-groupB-radioA',
      'noform-groupB-radioB',
      'noform-groupC-radioA',
      'noform-groupC-radioB',
    ]

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures.radio,
    })

    expect(ids).toEqual(expectedFocusableIds)
  })

  test('correctly identifies focusable elements in the "details" example', async ({ page }) => {
    await page.goto(baseUrl)
    const expectedFocusableIds = ['details-a-summary', 'details-b-summary', 'visible-input', 'details-c']

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures.details,
    })

    expect(ids).toEqual(expectedFocusableIds)
  })

  test('correctly identifies focusable elements in the "fieldset" example', async ({ page }) => {
    await page.goto(baseUrl)

    const expectedFocusableIds = [
      'free-enabled-button',
      'fieldset-enabled-legend-button',
      'fieldset-enabled-legend-input',
      'fieldset-enabled-legend-select',
      'fieldset-enabled-legend-textarea',
      'fieldset-enabled-button',
      'fieldset-enabled-input',
      'fieldset-enabled-select',
      'fieldset-enabled-textarea',
      'fieldset-enabled-fieldset-disabled-legend-button',
      'fieldset-enabled-anchor',
      'fieldset-disabled-legend1-button',
      'fieldset-disabled-legend1-input',
      'fieldset-disabled-legend1-select',
      'fieldset-disabled-legend1-textarea',
      'fieldset-disabled-anchor',
    ]

    const ids = await page.evaluate((props) => {
      const { tabbable } = window as unknown as Window
      const container = document.createElement('div')

      container.innerHTML = props.content
      document.body.append(container)

      const els = tabbable.focusable(container)
      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    }, {
      content: fixtures.fieldset,
    })

    expect(ids).toEqual(expectedFocusableIds)
  })

  test('correctly identifies focusable elements in the "shadow-dom" example', async ({ page }) => {
    await page.goto(baseUrl)

    const expectedFocusableIds = ['input']

    await setupFixture(page, fixtures['shadow-dom'])

    const ids = await page.evaluate(() => {
      const { tabbable } = window as unknown as Window
      const container = document.querySelector<HTMLElement>('#root')!
      const host = container.querySelector<HTMLElement>('test-shadow')!

      const els = tabbable.focusable(host.shadowRoot!.querySelector('#container')!)

      const res: string[] = []

      for (const el of els)
        res.push(el.id)

      return res
    })

    expect(ids).toEqual(expectedFocusableIds)
  })

  test.describe('options argument', () => {
    test('includes the container element when the `includeContainer` property is true', async ({ page }) => {
      await page.goto(baseUrl)

      const expectedFocusableIds = ['container-div', 'tabindex-div-0', 'tabindex-div-2', 'input']

      const ids = await page.evaluate((props) => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.id = 'container-div'
        container.setAttribute('tabindex', '0')
        container.innerHTML = props.content
        document.body.append(container)

        const els = tabbable.focusable(container, {
          includeContainer: true,
        })

        const res: string[] = []

        for (const el of els)
          res.push(el.id)

        return res
      }, {
        content: fixtures.nested,
      })

      expect(ids).toEqual(expectedFocusableIds)
    })

    test('does not include the container element when the `includeContainer` property is false', async ({ page }) => {
      await page.goto(baseUrl)

      const expectedFocusableIds = ['tabindex-div-0', 'tabindex-div-2', 'input']

      const ids = await page.evaluate((props) => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.id = 'container-div'
        container.setAttribute('tabindex', '0')
        container.innerHTML = props.content
        document.body.append(container)

        const els = tabbable.focusable(container, {
          includeContainer: false,
        })

        const res: string[] = []

        for (const el of els)
          res.push(el.id)

        return res
      }, {
        content: fixtures.nested,
      })

      expect(ids).toEqual(expectedFocusableIds)
    })

    test.describe('displayed check', () => {
      test('return browser visible elements by default ("full" option)', async ({ page }) => {
        await page.goto(baseUrl)

        const expectedFocusableIds = [
          'displayed-top',
          'displayed-nested',
          'displayed-zero-size',
          'nested-under-displayed-contents',
        ]

        const ids = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          document.body.append(container)

          const els = tabbable.focusable(container)
          const elsFull = tabbable.focusable(container, {
            displayCheck: 'full',
          })

          const res = {
            default: [] as string[],
            full: [] as string[],
          }

          for (const el of els)
            res.default.push(el.id)

          for (const el of elsFull)
            res.full.push(el.id)

          return res
        }, {
          content: fixtures.displayed,
        })

        expect(ids.default).toEqual(expectedFocusableIds)
        expect(ids.full).toEqual(ids.default)
      })

      test('return only elements with size ("non-zero-area" option)', async ({ page }) => {
        await page.goto(baseUrl)
        const expectedFocusableIds = ['displayed-top', 'displayed-nested', 'nested-under-displayed-contents']

        const ids = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          document.body.append(container)

          const els = tabbable.focusable(container, {
            displayCheck: 'non-zero-area',
          })

          const res: string[] = []

          for (const el of els)
            res.push(el.id)

          return res
        }, {
          content: fixtures.displayed,
        })

        expect(ids).toEqual(expectedFocusableIds)
      })

      test('return elements without checking display ("none" option)', async ({ page }) => {
        await page.goto(baseUrl)

        const expectedFocusableIds = [
          'displayed-top',
          'displayed-nested',
          'displayed-none-top',
          'nested-under-displayed-none',
          'displayed-zero-size',
          'displayed-contents-top',
          'nested-under-displayed-contents',
        ]

        const ids = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          document.body.append(container)

          const els = tabbable.focusable(container, {
            displayCheck: 'none',
          })

          const res: string[] = []

          for (const el of els)
            res.push(el.id)

          return res
        }, {
          content: fixtures.displayed,
        })

        expect(ids).toEqual(expectedFocusableIds)
      })
    })
  })
})
