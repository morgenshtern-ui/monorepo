export default function onScroll() {
  const swiper = this
  const { wrapperEl, rtlTranslate, enabled } = swiper

  if (!enabled)
    return

  swiper.previousTranslate = swiper.translate

  swiper.translate = swiper.isHorizontal() ? -wrapperEl.scrollLeft : -wrapperEl.scrollTop

  // eslint-disable-next-line
  if (swiper.translate === 0) swiper.translate = 0;

  swiper.updateActiveIndex()
  swiper.updateSlidesClasses()

  let newProgress
  const translatesDiff = swiper.maxTranslate() - swiper.minTranslate()

  newProgress = translatesDiff === 0 ? 0 : (swiper.translate - swiper.minTranslate()) / translatesDiff

  if (newProgress !== swiper.progress)
    swiper.updateProgress(rtlTranslate ? -swiper.translate : swiper.translate)

  swiper.emit('setTranslate', swiper.translate, false)
}
