/* eslint-disable ts/no-unsafe-return */
/* eslint-disable ts/no-loop-func */
/* eslint-disable unicorn/consistent-destructuring */
import { elementTransitionEnd } from './utils.js'

export function effectVirtualTransitionEnd({
  swiper,
  duration,
  transformElements,
  allSlides,
}: any) {
  const { activeIndex } = swiper
  const getSlide = (el: Node) => {
    if (!el.parentElement) {
      // assume shadow root
      const slide = swiper.slides.find(
        slideEl => slideEl.shadowRoot && slideEl.shadowRoot === el.parentNode,
      )

      return slide
    }

    return el.parentElement
  }

  if (swiper.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false
    const transitionEndTarget = allSlides
      ? transformElements
      : transformElements.filter((transformEl) => {
        const el = transformEl.classList.contains('swiper-slide-transform')
          ? getSlide(transformEl)
          : transformEl

        return swiper.getSlideIndex(el) === activeIndex
      })

    for (const el of transitionEndTarget) {
      elementTransitionEnd(el, () => {
        if (eventTriggered)
          return

        if (!swiper || swiper.destroyed)
          return

        eventTriggered = true
        swiper.animating = false
        const evt = new window.CustomEvent('transitionend', {
          bubbles: true,
          cancelable: true,
        })

        swiper.wrapperEl.dispatchEvent(evt)
      })
    }
  }
}
