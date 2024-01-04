import { Swiper } from './swiper.ts'

const swiper = new Swiper('.swiper', {
  slidesPerView: 5,
  spaceBetween: 30,
  loop: true,
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
})
