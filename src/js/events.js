const eventsItem = document.querySelectorAll('.events-item');
const eventsDots = document.querySelectorAll('.events-dot');
const prevButton = document.querySelector('.events-arrow-left');
const nextButton = document.querySelector('.events-arrow-right');

let currentIndex = 0;

function getCardsToShow() {
  if (window.innerWidth >= 1440) return 3;
  if (window.innerWidth >= 768) return 2;
  return 1;
}

function showEvent(index) {
  eventsItem.forEach((item, i) => {
    item.classList.toggle('active', i >= index && i < index + getCardsToShow());
  });

  eventsDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === index);
  });
  updateArrows();
}

function updateArrows() {
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === eventsItem.length - getCardsToShow();
}

nextButton.addEventListener('click', () => {
  if (currentIndex < eventsItem.length - getCardsToShow()) {
    currentIndex++;
    showEvent(currentIndex);
  }
});

prevButton.addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showEvent(currentIndex);
  }
});

showEvent(currentIndex);

window.addEventListener('resize', () => {
  showEvent(currentIndex);
});
