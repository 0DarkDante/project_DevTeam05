import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';

new Swiper('.events-slider', {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  spaceBetween: 16,
  grabCursor: true,
  navigation: {
    prevEl: '.events-arrow-left',
    nextEl: '.events-arrow-right',
  },
  pagination: {
    el: '.events-dots',
    clickable: true,
    bulletClass: 'events-dot',
    bulletActiveClass: 'active',
    modifierClass: 'events-dots-',
    horizontalClass: 'events-dots-horizontal',
    renderBullet: (index, className) =>
      `<button class="${className}" type="button" aria-label="Show event ${index + 1}"></button>`,
  },
  breakpoints: {
    768: {
      slidesPerView: 2,
      spaceBetween: 24,
    },
    1440: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  },
});
