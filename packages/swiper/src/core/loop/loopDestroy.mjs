export default function loopDestroy() {
  const swiper = this
  const { params, slidesEl } = swiper

  if (!params.loop || (swiper.virtual && swiper.params.virtual.enabled))
    return

  swiper.recalcSlides()

  const newSlidesOrder = []

  for (const slideEl of swiper.slides) {
    const index
      = slideEl.swiperSlideIndex === undefined
        ? Number(slideEl.dataset.swiperSlideIndex)
        : slideEl.swiperSlideIndex

    newSlidesOrder[index] = slideEl
  }

  for (const slideEl of swiper.slides)
    delete slideEl.dataset.swiperSlideIndex

  for (const slideEl of newSlidesOrder)
    slidesEl.append(slideEl)

  swiper.recalcSlides()
  swiper.slideTo(swiper.realIndex, 0)
}
