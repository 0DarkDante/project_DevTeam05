import Swiper from 'swiper';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const feedbacksSwiper = new Swiper('.feedbacks__slider', {
  modules: [Navigation, Pagination],
  slidesPerView: 1,
  spaceBetween: 16,
  pagination: {
    el: '.feedbacks__pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.feedbacks__btn--next',
    prevEl: '.feedbacks__btn--prev',
  },
  breakpoints: {
    1024: {
      slidesPerView: 2,
      spaceBetween: 20,
    },
    1440: {
      slidesPerView: 3,
      spaceBetween: 24,
    },
  },
});
