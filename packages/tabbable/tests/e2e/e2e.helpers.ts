/* eslint-disable unicorn/consistent-function-scoping */
import { URL, fileURLToPath } from 'node:url'
import type { Page } from '@playwright/test'
import type * as pkg from '../../src/index.js'

export type Tabbable = typeof pkg

export type Window = typeof globalThis & { tabbable: Tabbable }

export const baseUrl = `file://${fileURLToPath(new URL('../fixtures/index.html', import.meta.url))}`

export async function setupFixture(page: Page, content: string, options: Record<string, any> = {}) {
  await page.evaluate((props) => {
    function appendHTMLWithShadowRoots(container: Element) {
      defineCustomTestElement()
      // create dom fragments with shadow dom (if supported)
      const fragment = (new DOMParser() as any).parseFromString(props.content, 'text/html', {
        includeShadowRoots: true,
      })

      // append content
      if (props.options.caseId) {
        container.append(fragment.querySelector(`#${props.options.caseId}`))
      }
      else {
        const nodes = fragment.children[0].children[1].children

        while (nodes.length > 0)
          container.append(nodes[0])
      }

      // polyfill shadow hydration if not supported
      if (!supportsDeclarativeShadowDOM())
        scanAndHydrateShadowDom(container)
    }

    function defineCustomTestElement() {
      // register custom element to expose closed shadow for tests
      if (!customElements.get('test-shadow')) {
        customElements.define(
          'test-shadow',
          class TestShadow extends HTMLElement {
            private readonly closedShadowRoot: ShadowRoot | null = null

            public constructor() {
              super()

              if (supportsDeclarativeShadowDOM()) {
                // expose closed shadow root for tests
                const { shadowRoot } = this.attachInternals()

                if (shadowRoot && shadowRoot.mode === 'closed')
                  this.closedShadowRoot = shadowRoot
              }
              else {
                // polyfill nested shadow hydration
                const shadowRoot = this.shadowRoot || this.closedShadowRoot

                if (shadowRoot)
                  scanAndHydrateShadowDom(shadowRoot)
              }
            }
          },
        )
      }
    }

    function supportsDeclarativeShadowDOM() {
      // eslint-disable-next-line no-prototype-builtins
      return HTMLTemplateElement.prototype.hasOwnProperty('shadowRoot')
    }

    function scanAndHydrateShadowDom(container: Element | ShadowRoot) {
      for (const el of container.querySelectorAll<HTMLTemplateElement>('template[shadowroot]'))
        hydrateShadowDomPolyfill(el)
    }

    function hydrateShadowDomPolyfill(template: HTMLTemplateElement) {
      const mode = template.getAttribute('shadowroot')
      const delegatesFocus = !!template.getAttribute('shadowrootdelegatesfocus')
      const host = template.parentNode as any
      const shadowRoot = host.attachShadow({ delegatesFocus, mode })

      // expose closed shadow root for tests
      if (mode === 'closed')
        host.closedShadowRoot = shadowRoot

      shadowRoot.append(template.content)
      template.remove()
    }

    const container = document.createElement('div')

    container.id = 'root'

    appendHTMLWithShadowRoots(container)

    document.body.append(container)
  }, {
    content,
    options,
  })
}
