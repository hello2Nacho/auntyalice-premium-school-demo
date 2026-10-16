// Header: scrolled state and accessible mobile menu.
(function () {
  const header = document.querySelector('[data-header]');
  const toggle = document.querySelector('[data-nav-toggle]');
  const panel = document.querySelector('[data-nav-panel]');
  if (!header || !toggle || !panel) return;

  const desktop = window.matchMedia('(min-width: 1024px)');

  function setOpen(open, { returnFocus = false } = {}) {
    toggle.setAttribute('aria-expanded', String(open));
    panel.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (open) {
      const first = panel.querySelector('a');
      if (first) first.focus();
    } else if (returnFocus) {
      toggle.focus();
    }
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  panel.addEventListener('click', (event) => {
    if (event.target.closest('a') && !desktop.matches) setOpen(false);
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false, { returnFocus: true });
    }
  });

  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });

  // Keep keyboard focus inside the open mobile menu.
  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab' || desktop.matches || !panel.classList.contains('is-open')) return;
    const focusables = [toggle, ...panel.querySelectorAll('a')];
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  toggle.addEventListener('keydown', (event) => {
    if (event.key === 'Tab' && event.shiftKey && panel.classList.contains('is-open') && !desktop.matches) {
      event.preventDefault();
      const links = panel.querySelectorAll('a');
      links[links.length - 1].focus();
    }
  });

  const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 4);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
