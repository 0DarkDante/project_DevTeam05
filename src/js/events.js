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

function getMaxIndex() {
  return Math.max(0, eventsItem.length - getCardsToShow());
}

function showEvent(index) {
  currentIndex = Math.min(Math.max(index, 0), getMaxIndex());

  eventsItem.forEach((item, i) => {
    item.classList.toggle(
      'active',
      i >= currentIndex && i < currentIndex + getCardsToShow()
    );
  });

  eventsDots.forEach((dot, i) => {
    dot.classList.toggle('active', i === currentIndex);
  });
  updateArrows();
}

function updateArrows() {
  prevButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === getMaxIndex();
}

nextButton.addEventListener('click', () => {
  if (currentIndex < getMaxIndex()) {
    currentIndex++;
    showEvent(currentIndex);
  }
});

eventsDots.forEach((dot, i) => {
  dot.addEventListener('click', () => {
    showEvent(i);
  });
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
