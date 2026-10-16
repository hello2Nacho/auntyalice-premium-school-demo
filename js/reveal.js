// Fade-up reveal for [data-reveal] elements as they enter the viewport.
(function () {
  const items = document.querySelectorAll('[data-reveal]');
  if (!items.length) return;

  const reveal = (el) => el.classList.add('is-revealed');

  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    items.forEach(reveal);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      reveal(entry.target);
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.12 });

  items.forEach((el) => observer.observe(el));
})();
