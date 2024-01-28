/* eslint-disable ts/no-non-null-assertion */
import { type Page, expect, test } from '@playwright/test'
import { as } from 'vitest/dist/reporters-O4LBziQ_.js'
import { fixtures } from '../fixtures/fixtures.js'
import { type Window, baseUrl } from './e2e.helpers.js'

test.describe('isFocusable', () => {
  test('throws an error if no node is provided', async ({ page }) => {
    await page.goto(baseUrl)

    const err = await page.evaluate(() => {
      try {
        // @ts-expect-error: Testing invalid input.
        tabbable.isFocusable()

        return null
      }
      catch (error: unknown) {
        return error
      }
    })

    expect(err).toBeTruthy()
  })

  test.describe('returns true', () => {
    test('returns true for a `button` element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<button>Click me</button>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('button')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for an `input` element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<input data-testid="testInput" />'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('input')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for a `select` element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<select><option value="foo">foo</option></select>`
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('select')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for a `textarea` element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<textarea></textarea>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('textarea')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for an `a` anchor element with an `href` attribute', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.innerHTML = '<a href="https://github.com">Focusable</a>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('a')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for an `audio` element with a `controls` attribute', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.innerHTML = '<audio controls></audio>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('audio')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for a `video` element with a `controls` attribute', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.innerHTML = '<video controls></video>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('video')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for the first `summary` child element that is a direct descendant of a `details` element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.innerHTML = `<details id="details">
            <summary id="summary1">Summary 1</summary>
            <summary id="summary2">Summary 2</summary>
          </details>`
        document.body.append(container)

        return {
          details: tabbable.isFocusable(document.querySelector('#details')!),
          summary1: tabbable.isFocusable(document.querySelector('#summary1')!),
          summary2: tabbable.isFocusable(document.querySelector('#summary2')!),
        }
      })

      expect(result).toEqual({
        details: false,
        summary1: true,
        summary2: false,
      })
    })

    test('returns true for a `details` element without a `summary` child element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.innerHTML = `<details id="details">Details content</details>`
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('#details')!)
      })

      expect(result).toEqual(true)
    })

    test('returns true for any element with a `contenteditable` attribute with a truthy value', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<div id="a1" contenteditable="true">contenteditable div</div>
        <p id="a2" contenteditable="true">contenteditable paragraph</p>
        <div id="a3" contenteditable="true" tabindex="-1">contenteditable div focusable but not tabbable</div>
        <div id="a4" contenteditable="true" tabindex="NaN">contenteditable div focusable and tabbable</div>
        <audio id="a5" tabindex="foo" controls>audio controls focusable and tabbable</audio>
        <video id="a6" tabindex="bar" controls>video controls focusable and tabbable</video>`
        document.body.append(container)

        const editableDiv = document.querySelector('#a1')!
        const editableParagraph = document.querySelector('#a2')!
        const editableDivWithNegativeTabIndex = document.querySelector('#a3')!
        const editableDivWithNanTabIndex = document.querySelector('#a4')!
        const audioWithNanTabIndex = document.querySelector('#a5')!
        const videoWithNanTabIndex = document.querySelector('#a6')!

        return {
          audioWithNanTabIndex: tabbable.isFocusable(audioWithNanTabIndex),
          editableDiv: tabbable.isFocusable(editableDiv),
          editableDivWithNanTabIndex: tabbable.isFocusable(editableDivWithNanTabIndex),
          editableDivWithNegativeTabIndex: tabbable.isFocusable(editableDivWithNegativeTabIndex),
          editableParagraph: tabbable.isFocusable(editableParagraph),
          videoWithNanTabIndex: tabbable.isFocusable(videoWithNanTabIndex),
        }
      })

      expect(result).toEqual({
        audioWithNanTabIndex: true,
        editableDiv: true,
        editableDivWithNanTabIndex: true,
        editableDivWithNegativeTabIndex: true,
        editableParagraph: true,
        videoWithNanTabIndex: true,
      })
    })

    test('returns true for any element with a non-negative `tabindex` attribute', async ({ page }) => {
      await page.goto(baseUrl)
      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.innerHTML = `<p id="a1" tabindex="2">Focusable paragraph</p>
          <div id="a2" tabindex="1">Focusable div</div>
          <span id="a3" tabindex="0">Focusable span</span>`
        document.body.append(container)

        return {
          div: tabbable.isFocusable(document.querySelector('#a2')!),
          paragraph: tabbable.isFocusable(document.querySelector('#a1')!),
          span: tabbable.isFocusable(document.querySelector('#a3')!),
        }
      })

      expect(result).toEqual({
        div: true,
        paragraph: true,
        span: true,
      })
    })

    test('returns true for all radio `input` elements in a group, regardless of checked status', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window

        const container = document.createElement('div')

        container.innerHTML = `<form>
          <fieldset>
            <legend>form 1 groupA - initial checked</legend>
            <input type="radio" name="groupA" checked value="a" data-testid="radioA" />
            <input type="radio" name="groupA" value="b" data-testid="radioB" />
          </fieldset>
        </form>`
        document.body.append(container)

        return {
          radioA: tabbable.isFocusable(document.querySelector('[data-testid="radioA"]')!),
          radioB: tabbable.isFocusable(document.querySelector('[data-testid="radioB"]')!),
        }
      })

      expect(result).toEqual({
        radioA: true,
        radioB: true,
      })
    })
  })

  test.describe('returns false', () => {
    test('returns false for elements that are generally not Focusable', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `
        <p>paragraph</p>
          <div>div</div>
        <span>span</span>`
        document.body.append(container)

        return {
          div: tabbable.isFocusable(document.querySelector('div')!),
          paragraph: tabbable.isFocusable(document.querySelector('p')!),
          span: tabbable.isFocusable(document.querySelector('span')!),
        }
      })

      expect(result).toEqual({
        div: false,
        paragraph: false,
        span: false,
      })
    })

    test('returns false for an `a` anchor element without an `href` attribute', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<a>Not focusable</a>`
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('a')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for an `audio` element without a `controls` attribute', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<audio></audio>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('audio')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for a `video` element without a `controls` attribute', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<video></video>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('video')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for a `summary` element that is not a direct descendant of a `details` element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<summary>Summary</summary>'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('summary')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for any element with a `contenteditable` attribute with a falsy value', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<div contenteditable="false">contenteditable div</div>
          <p contenteditable="false">contenteditable paragraph</p>`
        document.body.append(container)

        return {
          div: tabbable.isFocusable(document.querySelector('div')!),
          paragraph: tabbable.isFocusable(document.querySelector('p')!),
        }
      })

      expect(result).toEqual({
        div: false,
        paragraph: false,
      })
    })

    test('returns false for any element with a `disabled` attribute', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<input disabled="true" data-testid="disabledInput" />
          <button disabled="true">Click me</button>`
        document.body.append(container)

        return {
          button: tabbable.isFocusable(document.querySelector('button')!),
          input: tabbable.isFocusable(document.querySelector('input')!),
        }
      })

      expect(result).toEqual({
        button: false,
        input: false,
      })
    })

    test('returns false for any element that is visually hidden with a `display: none` style', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<input style="display: none;" />'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('input')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for any element that is visually hidden with a `visibility: hidden` style', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = '<input style="visibility: hidden;" />'
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('input')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for any element that is a descendant of an ancestor that is visually hidden with a `display: none` style', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<div style="display: none;">
            <input />
          </div>`
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('input')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for any element that is a descendant of an ancestor that is visually hidden with a `visibility: hidden` style', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<div style="visibility: hidden;">
            <input data-testid="inputChildOfHiddenAncestor" />
          </div>`
        document.body.append(container)

        return tabbable.isFocusable(document.querySelector('[data-testid="inputChildOfHiddenAncestor"]')!)
      })

      expect(result).toEqual(false)
    })

    test('returns false for any non-`summary` element descendants of a closed `details` element', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate(() => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = `<details data-testid="closedDetails">
            <input data-testid="childInputInClosedDetails" />
          </details>
          <details open data-testid="openDetails">
            <input data-testid="childInputInOpenDetails" />
          </details>`
        document.body.append(container)

        return {
          childInputInClosedDetails: tabbable.isFocusable(document.querySelector('[data-testid="childInputInClosedDetails"]')!),
          childInputInOpenDetails: tabbable.isFocusable(document.querySelector('[data-testid="childInputInOpenDetails"]')!),
          closedDetails: tabbable.isFocusable(document.querySelector('[data-testid="closedDetails"]')!),
          openDetails: tabbable.isFocusable(document.querySelector('[data-testid="openDetails"]')!),
        }
      })

      expect(result).toEqual({
        childInputInClosedDetails: false,
        childInputInOpenDetails: true,
        closedDetails: true,
        openDetails: true,
      })
    })

    test('returns false for any form element inside a disabled fieldset', async ({ page }) => {
      await page.goto(baseUrl)

      const result = await page.evaluate((props) => {
        const { tabbable } = window as unknown as Window
        const container = document.createElement('div')

        container.innerHTML = props.content
        document.body.append(container)

        const disabledFieldsetFocusable = {
          button: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend1-button')!),
          input: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend1-input')!),
          select: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend1-select')!),
          textarea: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend1-textarea')!),
        }

        const disabledFieldsetNotFocusable = {
          base: {
            button: tabbable.isFocusable(document.querySelector('#fieldset-disabled-button')!),
            input: tabbable.isFocusable(document.querySelector('#fieldset-disabled-input')!),
            select: tabbable.isFocusable(document.querySelector('#fieldset-disabled-select')!),
            textarea: tabbable.isFocusable(document.querySelector('#fieldset-disabled-textarea')!),
          },
          legend2: {
            button: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend2-button')!),
            input: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend2-input')!),
            select: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend2-select')!),
            textarea: tabbable.isFocusable(document.querySelector('#fieldset-disabled-legend2-textarea')!),
          },
        }

        const enabledFieldset = {
          button: tabbable.isFocusable(document.querySelector('#fieldset-disabled-fieldset-enabled-legend-button')!),
          input: tabbable.isFocusable(document.querySelector('#fieldset-disabled-fieldset-enabled-input')!),
        }

        const disabledFieldset = {
          button: tabbable.isFocusable(document.querySelector('#fieldset-disabled-fieldset-disabled-legend-button')!),
          input: tabbable.isFocusable(document.querySelector('#fieldset-disabled-fieldset-disabled-input')!),
        }

        const anchor = tabbable.isFocusable(document.querySelector('#fieldset-disabled-anchor')!)

        return {
          anchor,
          disabledFieldset,
          disabledFieldsetFocusable,
          disabledFieldsetNotFocusable,
          enabledFieldset,
        }
      }, {
        content: fixtures.fieldset,
      })

      expect(result).toEqual({
        anchor: true,
        disabledFieldset: {
          button: false,
          input: false,
        },
        disabledFieldsetFocusable: {
          button: true,
          input: true,
          select: true,
          textarea: true,
        },
        disabledFieldsetNotFocusable: {
          base: {
            button: false,
            input: false,
            select: false,
            textarea: false,
          },
          legend2: {
            button: false,
            input: false,
            select: false,
            textarea: false,
          },
        },
        enabledFieldset: {
          button: false,
          input: false,
        },
      })
    })

    test.describe('inertness', () => {
      test('returns false for any inert element', async ({ page }) => {
        await page.goto(baseUrl)

        const result = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          document.body.append(container)

          const res = []

          for (const child of container.children)
            res.push(tabbable.isFocusable(child))

          return res
        }, {
          content: fixtures.inert,
        })

        for (const child of result)
          expect(child).toEqual(false)
      })

      test('returns false for any element inside an inert parent', async ({ page }) => {
        await page.goto(baseUrl)

        const result = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          container.inert = true
          document.body.append(container)

          const res = []

          for (const child of container.children)
            res.push(tabbable.isFocusable(child))

          return res
        }, {
          content: fixtures.basic,
        })

        for (const child of result)
          expect(child).toEqual(false)
      })

      test('returns false for any element inside an inert ancestor', async ({ page }) => {
        await page.goto(baseUrl)

        const result = await page.evaluate((props) => {
          const { tabbable } = window as unknown as Window
          const container = document.createElement('div')

          container.innerHTML = props.content
          const parent = document.createElement('div')

          parent.inert = true
          parent.append(container)
          document.body.append(parent)

          const res = []

          for (const child of container.children)
            res.push(tabbable.isFocusable(child))

          return res
        }, {
          content: fixtures.basic,
        })

        for (const child of result)
          expect(child).toEqual(false)
      })
    })

    test.describe.only('display check', () => {
      const fixture = `
        <div data-testid="displayed-top" tabindex="0">
          <div data-testid="displayed-nested" tabindex="0"></div>
          <div
            data-testid="displayed-zero-size"
            tabindex="0"
            style="width: 0; height: 0"
          ></div>
        </div>
        <div
          data-testid="displayed-none-top"
          tabindex="0"
          style="display: none"
        >
          <div data-testid="nested-under-displayed-none" tabindex="0"></div>
        </div>
        <div data-testid="displayed-contents-top" tabindex="0" style="display: contents">
          <div data-testid="nested-under-displayed-contents" tabindex="0"></div>
        </div>
      `

      interface Nodes {
        displayedContentsTop: Element
        displayedNested: Element
        displayedNoneTop: Element
        displayedTop: Element
        displayedZeroSize: Element
        nestedUnderDisplayedContents: Element
        nestedUnderDisplayedNone: Element
      }

      // 'full'
      for (const displayCheck of [undefined, 'full'] as const) {
        for (const inDocument of [false, true] as const) {
          const displayName = displayCheck || '(default)'
          const inDocumentName = inDocument ? '' : 'NOT '

          test(`returns browser visible elements by default ("${displayName}" option, container ${inDocumentName}in doc)`, async ({ page }) => {
            await page.goto(baseUrl)

            const options = { displayCheck }

            const result = await page.evaluate((props) => {
              const container = document.createElement('div')

              container.innerHTML = props.fixture

              if (props.inDocument)
                document.body.append(container)

              const { tabbable } = window as unknown as Window & { getNodes: () => Nodes }

              const els = {
                displayedContentsTop: container.querySelector(`[data-testid="displayed-contents-top"]`)!,
                displayedNested: container.querySelector(`[data-testid="displayed-nested"]`)!,
                displayedNoneTop: container.querySelector(`[data-testid="displayed-none-top"]`)!,
                displayedTop: container.querySelector(`[data-testid="displayed-top"]`)!,
                displayedZeroSize: container.querySelector(`[data-testid="displayed-zero-size"]`)!,
                nestedUnderDisplayedContents: container.querySelector(`[data-testid="nested-under-displayed-contents"]`)!,
                nestedUnderDisplayedNone: container.querySelector(`[data-testid="nested-under-displayed-none"]`)!,
              }

              return {
                displayedContentsTop: tabbable.isFocusable(els.displayedContentsTop, props.options),
                displayedNested: tabbable.isFocusable(els.displayedNested, props.options),
                displayedNoneTop: tabbable.isFocusable(els.displayedNoneTop, props.options),
                displayedTop: tabbable.isFocusable(els.displayedTop, props.options),
                displayedZeroSize: tabbable.isFocusable(els.displayedZeroSize, props.options),
                nestedUnderDisplayedContents: tabbable.isFocusable(els.nestedUnderDisplayedContents, props.options),
                nestedUnderDisplayedNone: tabbable.isFocusable(els.nestedUnderDisplayedNone, props.options),
              }
            }, {
              fixture,
              inDocument,
              options,
            })

            expect(result.displayedContentsTop).toEqual(false)
            expect(result.displayedNested).toEqual(inDocument)
            expect(result.displayedNoneTop).toEqual(false)
            expect(result.displayedTop).toEqual(inDocument)
            expect(result.displayedZeroSize).toEqual(inDocument)
            expect(result.nestedUnderDisplayedNone).toEqual(false)
            expect(result.nestedUnderDisplayedContents).toEqual(inDocument)
          })
        }
      }
    })
  })
})
