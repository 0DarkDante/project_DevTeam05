
const heroSlides = document.querySelectorAll('.hero-slide');
const heroPrevButton = document.querySelector('.hero-prev');
const heroNextButton = document.querySelector('.hero-next');

let currentSlide = 0;

function updateHeroSlider() {
  heroSlides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });

  heroPrevButton.disabled = currentSlide === 0;
  heroNextButton.disabled = currentSlide === heroSlides.length - 1;
}

heroPrevButton.addEventListener('click', () => {
  if (currentSlide > 0) {
    currentSlide -= 1;
    updateHeroSlider();
  }
});

heroNextButton.addEventListener('click', () => {
  if (currentSlide < heroSlides.length - 1) {
    currentSlide += 1;
    updateHeroSlider();
  }
});

updateHeroSlider();
