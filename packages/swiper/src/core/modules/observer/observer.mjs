import { getWindow } from '@teleskop-labs/ssr-window'
import { elementParents } from '../../../shared/utils.mjs'

export default function Observer({ swiper, extendParams, on, emit }) {
  const observers = []
  const window = getWindow()
  const attach = (target, options = {}) => {
    const ObserverFunc = window.MutationObserver || window.WebkitMutationObserver
    const observer = new ObserverFunc((mutations) => {
      // The observerUpdate event should only be triggered
      // once despite the number of mutations.  Additional
      // triggers are redundant and are very costly
      if (swiper.__preventObserver__)
        return

      if (mutations.length === 1) {
        emit('observerUpdate', mutations[0])

        return
      }

      const observerUpdate = function observerUpdate() {
        emit('observerUpdate', mutations[0])
      }

      if (window.requestAnimationFrame)
        window.requestAnimationFrame(observerUpdate)

      else
        window.setTimeout(observerUpdate, 0)
    })

    observer.observe(target, {
      attributes: options.attributes === undefined ? true : options.attributes,
      childList: options.childList === undefined ? true : options.childList,
      characterData: options.characterData === undefined ? true : options.characterData,
    })

    observers.push(observer)
  }
  const init = () => {
    if (!swiper.params.observer)
      return

    if (swiper.params.observeParents) {
      const containerParents = elementParents(swiper.hostEl)

      for (const containerParent of containerParents)
        attach(containerParent)
    }

    // Observe container
    attach(swiper.hostEl, {
      childList: swiper.params.observeSlideChildren,
    })

    // Observe wrapper
    attach(swiper.wrapperEl, { attributes: false })
  }
  const destroy = () => {
    for (const observer of observers)
      observer.disconnect()

    observers.splice(0, observers.length)
  }

  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false,
  })
  on('init', init)
  on('destroy', destroy)
}
