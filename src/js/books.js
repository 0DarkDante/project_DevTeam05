import { getCategories, getTopBooks, getBooksByCategory } from './api.js';

const ALL_CATEGORIES = 'All categories';
const MOBILE_LIMIT = 10;
const DESKTOP_LIMIT = 24;
const LOAD_STEP = 4;

const refs = {
  filter: document.querySelector('[data-books-filter]'),
  toggle: document.querySelector('[data-books-toggle]'),
  toggleLabel: document.querySelector('[data-books-toggle-label]'),
  categories: document.querySelector('[data-books-categories]'),
  list: document.querySelector('[data-books-list]'),
  counter: document.querySelector('[data-books-counter]'),
  more: document.querySelector('[data-books-more]'),
};

const tabletQuery = window.matchMedia('(min-width: 768px)');
const booksCache = new Map();

const state = {
  category: ALL_CATEGORIES,
  books: [],
  shown: 0,
  extra: 0,
  requestId: 0,
};

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function formatPrice(price) {
  const value = Number(price) || 0;
  return Number.isInteger(value) ? `$${value}` : `$${value.toFixed(2)}`;
}

function getInitialLimit() {
  return tabletQuery.matches ? DESKTOP_LIMIT : MOBILE_LIMIT;
}

function createCategoryMarkup(name) {
  const isActive = name === state.category;

  return `
    <li>
      <button
        class="books__category${isActive ? ' is--active' : ''}"
        type="button"
        data-category="${escapeHtml(name)}"
        ${isActive ? 'aria-current="true"' : ''}
      >
        <span class="text-size-medium">${escapeHtml(name)}</span>
      </button>
    </li>`;
}

function renderCategories(names) {
  refs.categories.innerHTML = [ALL_CATEGORIES, ...names]
    .map(createCategoryMarkup)
    .join('');
}

function createBookMarkup({
  _id,
  title,
  author,
  price,
  book_image,
  book_image_width,
  book_image_height,
}) {
  return `
    <li class="book-card">
      <img
        class="book-card__image"
        src="${escapeHtml(book_image)}"
        alt="${escapeHtml(title)}"
        width="${book_image_width || 333}"
        height="${book_image_height || 500}"
        loading="lazy"
      />
      <div class="book-card__body">
        <div class="book-card__info">
          <div class="book-card__meta">
            <h4 class="text-size-tagline is--truncate is--capitalize">
              ${escapeHtml(String(title ?? '').toLowerCase())}
            </h4>
            <p class="text-size-small">${escapeHtml(author)}</p>
          </div>
          <p class="text-size-large-semibold is--nowrap">${formatPrice(price)}</p>
        </div>
        <button
          class="btn btn--secondary btn--small book-card__btn"
          type="button"
          data-book-id="${escapeHtml(_id)}"
        >
          Learn More
        </button>
      </div>
    </li>`;
}

function renderMessage(text) {
  refs.list.innerHTML = `
    <li>
      <p class="text-size-medium">${escapeHtml(text)}</p>
    </li>`;
}

function updateCounter() {
  refs.counter.textContent = `Showing ${state.shown} of ${state.books.length}`;
}

function updateMoreButton() {
  refs.more.classList.toggle('is--hidden', state.shown >= state.books.length);
}

function syncBooks() {
  const target = Math.min(getInitialLimit() + state.extra, state.books.length);

  if (target > state.shown) {
    const nextBooks = state.books.slice(state.shown, target);

    refs.list.insertAdjacentHTML(
      'beforeend',
      nextBooks.map(createBookMarkup).join('')
    );
  } else if (target < state.shown) {
    [...refs.list.children].slice(target).forEach(item => item.remove());
  }

  state.shown = target;
  updateCounter();
  updateMoreButton();
}

async function fetchBooks(category) {
  if (booksCache.has(category)) {
    return booksCache.get(category);
  }

  const books =
    category === ALL_CATEGORIES
      ? (await getTopBooks()).flatMap(({ books }) => books)
      : await getBooksByCategory(category);

  booksCache.set(category, books);
  return books;
}

async function loadBooks(category) {
  const requestId = ++state.requestId;

  state.books = [];
  state.shown = 0;
  state.extra = 0;
  refs.list.innerHTML = '';
  refs.list.setAttribute('aria-busy', 'true');
  updateCounter();
  updateMoreButton();

  try {
    const books = await fetchBooks(category);

    if (requestId !== state.requestId) {
      return;
    }

    state.books = books;

    if (books.length === 0) {
      renderMessage('No books found in this category.');
      updateCounter();
      return;
    }

    syncBooks();
  } catch {
    if (requestId === state.requestId) {
      renderMessage('Failed to load books. Please try again later.');
    }
  } finally {
    if (requestId === state.requestId) {
      refs.list.removeAttribute('aria-busy');
    }
  }
}

async function loadCategories() {
  try {
    const categories = await getCategories();
    const names = categories.map(({ list_name }) => list_name).filter(Boolean);

    renderCategories(names);
  } catch {
    renderCategories([]);
  }
}

function openFilter() {
  refs.filter.classList.add('is--open');
  refs.toggle.setAttribute('aria-expanded', 'true');
}

function closeFilter() {
  refs.filter.classList.remove('is--open');
  refs.toggle.setAttribute('aria-expanded', 'false');
}

function setActiveCategory(category) {
  state.category = category;
  refs.toggleLabel.textContent =
    category === ALL_CATEGORIES ? 'Categories' : category;

  refs.categories.querySelectorAll('[data-category]').forEach(button => {
    const isActive = button.dataset.category === category;

    button.classList.toggle('is--active', isActive);

    if (isActive) {
      button.setAttribute('aria-current', 'true');
    } else {
      button.removeAttribute('aria-current');
    }
  });
}

function onToggleClick() {
  if (refs.filter.classList.contains('is--open')) {
    closeFilter();
  } else {
    openFilter();
  }
}

function onCategoryClick(event) {
  const button = event.target.closest('[data-category]');

  if (!button) {
    return;
  }

  const { category } = button.dataset;

  closeFilter();

  if (category === state.category) {
    return;
  }

  setActiveCategory(category);
  loadBooks(category);
}

function onDocumentClick(event) {
  if (!refs.filter.contains(event.target)) {
    closeFilter();
  }
}

function onDocumentKeydown(event) {
  if (event.key === 'Escape' && refs.filter.classList.contains('is--open')) {
    closeFilter();
    refs.toggle.focus();
  }
}

function onMoreClick() {
  state.extra += LOAD_STEP;
  syncBooks();
}

function onBreakpointChange() {
  if (state.books.length > 0) {
    syncBooks();
  }
}

function onListClick(event) {
  const button = event.target.closest('[data-book-id]');

  if (!button) {
    return;
  }

  document.dispatchEvent(
    new CustomEvent('book-modal:open', {
      detail: { id: button.dataset.bookId },
    })
  );
}

refs.toggle.addEventListener('click', onToggleClick);
refs.categories.addEventListener('click', onCategoryClick);
refs.more.addEventListener('click', onMoreClick);
refs.list.addEventListener('click', onListClick);
document.addEventListener('click', onDocumentClick);
document.addEventListener('keydown', onDocumentKeydown);
tabletQuery.addEventListener('change', onBreakpointChange);

renderCategories([]);
loadCategories();
loadBooks(ALL_CATEGORIES);
