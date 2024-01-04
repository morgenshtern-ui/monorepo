export default function effectInit(params) {
  const {
    effect,
    swiper,
    on,
    setTranslate,
    setTransition,
    overwriteParams,
    perspective,
    recreateShadows,
    getEffectParams,
  } = params

  on('beforeInit', () => {
    if (swiper.params.effect !== effect)
      return

    swiper.classNames.push(`${swiper.params.containerModifierClass}${effect}`)

    if (perspective?.())
      swiper.classNames.push(`${swiper.params.containerModifierClass}3d`)

    const overwriteParamsResult = overwriteParams ? overwriteParams() : {}

    Object.assign(swiper.params, overwriteParamsResult)
    Object.assign(swiper.originalParams, overwriteParamsResult)
  })
  on('setTranslate', () => {
    if (swiper.params.effect !== effect)
      return

    setTranslate()
  })
  on('setTransition', (_s, duration) => {
    if (swiper.params.effect !== effect)
      return

    setTransition(duration)
  })

  on('transitionEnd', () => {
    if (swiper.params.effect !== effect)
      return

    if (recreateShadows) {
      if (!getEffectParams?.().slideShadows)
        return

      // remove shadows
      for (const slideEl of swiper.slides) {
        for (const shadowEl of slideEl
          .querySelectorAll(
            '.swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left',
          )) shadowEl.remove()
      }

      // create new one
      recreateShadows()
    }
  })

  let requireUpdateOnVirtual

  on('virtualUpdate', () => {
    if (swiper.params.effect !== effect)
      return

    if (swiper.slides.length === 0)
      requireUpdateOnVirtual = true

    requestAnimationFrame(() => {
      if (requireUpdateOnVirtual && swiper.slides?.length) {
        setTranslate()
        requireUpdateOnVirtual = false
      }
    })
  })
}
