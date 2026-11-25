const mobileMenu = document.querySelector('.mobile-menu');
const closeBtn = document.querySelector('.close-btn');
const navLinks = document.querySelectorAll('.mobile-nav-link');
const openMenu = () => {
  mobileMenu.classList.add('is-open');
  document.body.style.overflow = 'hidden';
};
const closeMenu = () => {
  mobileMenu.classList.remove('is-open');
  document.body.style.overflow = '';
};
if (mobileMenu) {
  document.addEventListener('openMobileMenu', openMenu);
  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }
  navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
      closeMenu();
    }
  });
}
