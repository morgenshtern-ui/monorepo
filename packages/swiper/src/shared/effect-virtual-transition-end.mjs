import { elementTransitionEnd } from './utils.mjs'

export default function effectVirtualTransitionEnd({
  swiper,
  duration,
  transformElements,
  allSlides,
}) {
  const { activeIndex } = swiper
  const getSlide = (el) => {
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
    let transitionEndTarget

    transitionEndTarget = allSlides
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
