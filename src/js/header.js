const burgerBtn = document.querySelector('.burger-btn');
if (burgerBtn) {
  burgerBtn.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('openMobileMenu'));
  });
}