import Accordion from 'accordion-js';
import { getBookById } from './api.js';

const MIN_QUANTITY = 1;
const MAX_QUANTITY = 99;

const refs = {
  backdrop: document.querySelector('[data-book-modal]'),
  closeBtn: document.querySelector('[data-book-modal-close]'),
  cover: document.querySelector('[data-book-modal-cover]'),
  title: document.querySelector('[data-book-modal-title]'),
  author: document.querySelector('[data-book-modal-author]'),
  price: document.querySelector('[data-book-modal-price]'),
  details: document.querySelector('[data-book-modal-details]'),
  form: document.querySelector('[data-book-modal-form]'),
  quantity: document.querySelector('[data-quantity-input]'),
  decrease: document.querySelector('[data-quantity-decrease]'),
  increase: document.querySelector('[data-quantity-increase]'),
  addToCart: document.querySelector('[data-add-to-cart]'),
  message: document.querySelector('[data-book-modal-message]'),
  accordion: document.querySelector('[data-book-modal-accordion]'),
};

const accordion = new Accordion(refs.accordion, {
  duration: 300,
  showMultiple: true,
  elementClass: 'accordion__item',
  triggerClass: 'accordion__trigger',
  panelClass: 'accordion__panel',
  activeClass: 'is--active',
});

let currentBook = null;
let lastFocused = null;
let requestId = 0;

function formatPrice(price) {
  const value = Number(price) || 0;
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function clampQuantity(value) {
  const number = Math.round(Number(value)) || MIN_QUANTITY;
  return Math.min(Math.max(number, MIN_QUANTITY), MAX_QUANTITY);
}

function setQuantity(value) {
  const quantity = clampQuantity(value);

  refs.quantity.value = quantity;
  refs.decrease.disabled = quantity <= MIN_QUANTITY;
  refs.increase.disabled = quantity >= MAX_QUANTITY;
}

function showMessage(text) {
  refs.message.textContent = text;
  refs.message.hidden = !text;
}

function renderBook({ title, author, price, description, book_image }) {
  const image = document.createElement('img');

  image.className = 'book-modal__image';
  image.src = book_image;
  image.alt = title;
  image.width = 309;
  image.height = 467;

  refs.cover.replaceChildren(image);
  refs.title.textContent = String(title ?? '').toLowerCase();
  refs.author.textContent = author;
  refs.price.textContent = formatPrice(price);
  refs.details.textContent =
    description?.trim() || 'There is no description for this book yet.';

  setQuantity(MIN_QUANTITY);
  showMessage('');
  accordion.closeAll();
}

function openModal() {
  lastFocused = document.activeElement;
  refs.backdrop.classList.add('is--open');
  document.body.classList.add('is--scroll-locked');
  document.addEventListener('keydown', onDocumentKeydown);
  refs.closeBtn.focus();
}

function closeModal() {
  refs.backdrop.classList.remove('is--open');
  document.body.classList.remove('is--scroll-locked');
  document.removeEventListener('keydown', onDocumentKeydown);
  lastFocused?.focus();
}

async function onBookModalOpen(event) {
  const { id } = event.detail;
  const currentRequest = ++requestId;

  try {
    const book = await getBookById(id);

    if (currentRequest !== requestId) {
      return;
    }

    currentBook = book;
    renderBook(book);
    openModal();
  } catch (error) {
    console.error('Failed to load book details', error);
  }
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape') {
    closeModal();
  }
}

function onBackdropClick(event) {
  if (event.target === event.currentTarget) {
    closeModal();
  }
}

function onAddToCart() {
  const quantity = clampQuantity(refs.quantity.value);

  console.log('Add to cart:', {
    id: currentBook?._id,
    title: currentBook?.title,
    quantity,
  });

  showMessage(
    `Added ${quantity} ${quantity === 1 ? 'book' : 'books'} to cart.`
  );
}

function onFormSubmit(event) {
  event.preventDefault();
  showMessage('Дякуємо за покупку');
}

refs.closeBtn.addEventListener('click', closeModal);
refs.backdrop.addEventListener('click', onBackdropClick);
refs.decrease.addEventListener('click', () =>
  setQuantity(Number(refs.quantity.value) - 1)
);
refs.increase.addEventListener('click', () =>
  setQuantity(Number(refs.quantity.value) + 1)
);
refs.quantity.addEventListener('change', () =>
  setQuantity(refs.quantity.value)
);
refs.addToCart.addEventListener('click', onAddToCart);
refs.form.addEventListener('submit', onFormSubmit);
document.addEventListener('book-modal:open', onBookModalOpen);
