const backdrop = document.querySelector('.contact-modal-backdrop');
const closeBtn = document.querySelector('.contact-modal-close');
const modalEventTitle = document.querySelector('.contact-modal-event');

const registerBtns = document.querySelectorAll('.events-item button.link');

const contactForm = document.querySelector('.contact-form');

let selectedEvent = '';

registerBtns.forEach(button => {
  button.addEventListener('click', onRegisterBtnClick);
});

function onRegisterBtnClick(event) {
  const eventCard = event.currentTarget.closest('.events-item');

  if (!eventCard) {
    return;
  }

  const titleElement = eventCard.querySelector('.text-size-sm');

  if (!titleElement) {
    return;
  }

  selectedEvent = titleElement.textContent.trim();

  modalEventTitle.textContent = selectedEvent;

  openContactModal();
}

closeBtn.addEventListener('click', closeContactModal);

backdrop.addEventListener('click', event => {
  if (event.target === event.currentTarget) {
    closeContactModal();
  }
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && !backdrop.classList.contains('is-hidden')) {
    closeContactModal();
  }
});

contactForm.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  const registration = {
    event: selectedEvent,
    name: event.target.elements.name.value.trim(),
    email: event.target.elements.email.value.trim(),
    message: event.target.elements.message.value.trim(),
    createdAt: new Date().toISOString(),
  };

  const registrations = JSON.parse(localStorage.getItem('registrations')) || [];

  registrations.push(registration);

  localStorage.setItem('registrations', JSON.stringify(registrations));

  console.log('Registration saved:', registration);

  event.target.reset();

  closeContactModal();
}

function openContactModal() {
  backdrop.classList.remove('is-hidden');

  document.body.classList.add('no-scroll');
}

function closeContactModal() {
  backdrop.classList.add('is-hidden');

  document.body.classList.remove('no-scroll');
}
