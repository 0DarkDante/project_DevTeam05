const BASE_URL = 'https://books-backend-v2.b.goit.study/books';

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getCategories() {
  return request('/category-list');
}

export function getTopBooks() {
  return request('/top-books');
}

export function getBooksByCategory(category) {
  return request(`/category?category=${encodeURIComponent(category)}`);
}

export function getBookById(id) {
  return request(`/${id}`);
}
