import Swiper from 'swiper';
import { Navigation } from 'swiper/modules';

import 'swiper/css';

new Swiper('.hero-slider', {
  modules: [Navigation],
  slidesPerView: 1,
  spaceBetween: 16,
  speed: 500,
  grabCursor: true,
  navigation: {
    prevEl: '.hero-prev',
    nextEl: '.hero-next',
  },
});
