export default function updateClickedSlide(el, path) {
  const swiper = this
  const params = swiper.params
  let slide = el.closest(`.${params.slideClass}, swiper-slide`)

  if (!slide && swiper.isElement && path && path.length > 1 && path.includes(el)) {
    for (const pathEl of path.slice(path.indexOf(el) + 1, path.length)) {
      if (!slide && pathEl.matches?.(`.${params.slideClass}, swiper-slide`))
        slide = pathEl
    }
  }

  let slideFound = false
  let slideIndex

  if (slide) {
    for (let i = 0; i < swiper.slides.length; i += 1) {
      if (swiper.slides[i] === slide) {
        slideFound = true
        slideIndex = i
        break
      }
    }
  }

  if (slide && slideFound) {
    swiper.clickedSlide = slide

    swiper.clickedIndex = swiper.virtual && swiper.params.virtual.enabled ? Number.parseInt(slide.dataset.swiperSlideIndex, 10) : slideIndex
  }
  else {
    swiper.clickedSlide = undefined
    swiper.clickedIndex = undefined

    return
  }

  if (
    params.slideToClickedSlide
    && swiper.clickedIndex !== undefined
    && swiper.clickedIndex !== swiper.activeIndex
  )
    swiper.slideToClickedSlide()
}
