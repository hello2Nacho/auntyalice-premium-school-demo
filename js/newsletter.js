// Newsletter: client-side validation and a clearly labelled demo success state.
// Nothing is sent anywhere; the address is only remembered in this browser.
(function () {
  const form = document.querySelector('[data-newsletter]');
  if (!form) return;

  const input = form.querySelector('input[type="email"]');
  const status = form.querySelector('[role="status"]');
  const STORAGE_KEY = 'aac-demo-newsletter';
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function show(message, kind) {
    status.textContent = message;
    status.classList.toggle('is-error', kind === 'error');
    status.classList.toggle('is-success', kind === 'success');
  }

  input.addEventListener('input', () => {
    if (input.getAttribute('aria-invalid') === 'true' && EMAIL.test(input.value.trim())) {
      input.removeAttribute('aria-invalid');
      show('', null);
    }
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = input.value.trim();

    if (!value) {
      input.setAttribute('aria-invalid', 'true');
      show('Please enter your email address.', 'error');
      input.focus();
      return;
    }
    if (!EMAIL.test(value)) {
      input.setAttribute('aria-invalid', 'true');
      show('Please enter a valid email address, like name@example.com.', 'error');
      input.focus();
      return;
    }

    input.removeAttribute('aria-invalid');
    try { localStorage.setItem(STORAGE_KEY, value); } catch (e) { /* storage unavailable: fine for a demo */ }
    form.reset();
    show('Thank you. In the live website, ' + value + ' would now be subscribed. (Demo only: nothing was sent.)', 'success');
  });
})();
