export default function updateSlidesOffset() {
  const swiper = this
  const slides = swiper.slides

  const minusOffset = swiper.isElement
    ? swiper.isHorizontal()
      ? swiper.wrapperEl.offsetLeft
      : swiper.wrapperEl.offsetTop
    : 0

  for (const slide of slides) {
    slide.swiperSlideOffset
      = (swiper.isHorizontal() ? slide.offsetLeft : slide.offsetTop)
      - minusOffset
      - swiper.cssOverflowAdjustment()
  }
}
