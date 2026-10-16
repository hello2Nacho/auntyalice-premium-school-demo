// Aunty Alice College — demonstration admissions portal.
// Five-step application with per-step validation, a draft saved in this browser,
// an editable review and a clearly labelled demo success state. Nothing is sent
// anywhere and selected files never leave the device.
(function () {
  const DRAFT_KEY = 'aac-demo-application';
  const COUNTER_KEY = 'aac-demo-reference-counter';
  const TOTAL_STEPS = 5;
  const MAX_FILE_BYTES = 5 * 1024 * 1024;
  const STEP_NAMES = ['Student', 'Parent / Guardian', 'Academic', 'Documents', 'Review'];
  const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  const views = {
    landing: document.querySelector('[data-view="landing"]'),
    form: document.querySelector('[data-view="form"]'),
    success: document.querySelector('[data-view="success"]'),
  };
  const form = document.querySelector('[data-form]');
  const steps = [...form.querySelectorAll('[data-step]')];
  const indicators = [...document.querySelectorAll('[data-step-indicator]')];
  const backBtn = form.querySelector('[data-action="back"]');
  const nextBtn = form.querySelector('[data-action="next"]');
  const formError = form.querySelector('[data-form-error]');
  const review = form.querySelector('[data-review]');
  const resumeBtn = document.querySelector('[data-action="resume"]');

  let current = 1;
  let returnToReview = false;
  const files = {}; // { inputName: { name, size } } — names only, never the file contents

  /* ---------- storage (wrapped: may be unavailable) ---------- */
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* ignore */ } },
    remove(key) { try { localStorage.removeItem(key); } catch (e) { /* ignore */ } },
  };

  /* ---------- views ---------- */
  function showView(name) {
    Object.entries(views).forEach(([key, el]) => { el.hidden = key !== name; });
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /* ---------- steps ---------- */
  function goTo(step, { focus = true } = {}) {
    current = step;
    steps.forEach((el) => { el.hidden = Number(el.dataset.step) !== step; });

    indicators.forEach((li) => {
      const n = Number(li.dataset.stepIndicator);
      li.classList.toggle('is-current', n === step);
      li.classList.toggle('is-done', n < step);
      if (n === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    document.querySelector('[data-step-count]').textContent = `Step ${step} of ${TOTAL_STEPS}`;
    document.querySelector('[data-step-name]').textContent = STEP_NAMES[step - 1];
    document.querySelector('[data-step-bar]').style.width = `${(step / TOTAL_STEPS) * 100}%`;

    backBtn.textContent = step === 1 ? 'Cancel' : 'Back';
    if (step === TOTAL_STEPS) {
      nextBtn.textContent = 'Submit Application';
      buildReview();
    } else {
      nextBtn.textContent = returnToReview ? 'Save and Review' : 'Continue';
    }

    hideFormError();
    saveDraft();
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (focus) steps[step - 1].querySelector('.step__title').focus();
  }

  /* ---------- errors ---------- */
  function labelFor(el) {
    const label = form.querySelector(`label[for="${el.id}"]`);
    if (!label) return 'This field';
    return label.firstChild.textContent.trim();
  }

  function errorId(key) { return `${key}-error`; }

  function setError(target, key, message, anchor) {
    clearError(target, key);
    const p = document.createElement('p');
    p.className = 'error-text';
    p.id = errorId(key);
    p.textContent = message;
    anchor.insertAdjacentElement('afterend', p);
    target.setAttribute('aria-invalid', 'true');
    const described = (target.getAttribute('aria-describedby') || '').split(' ').filter(Boolean);
    if (!described.includes(p.id)) target.setAttribute('aria-describedby', [...described, p.id].join(' '));
  }

  function clearError(target, key) {
    const existing = document.getElementById(errorId(key));
    if (existing) existing.remove();
    target.removeAttribute('aria-invalid');
    const described = (target.getAttribute('aria-describedby') || '').split(' ').filter((id) => id && id !== errorId(key));
    if (described.length) target.setAttribute('aria-describedby', described.join(' '));
    else target.removeAttribute('aria-describedby');
  }

  function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
  }

  function hideFormError() {
    formError.hidden = true;
    formError.textContent = '';
  }

  /* ---------- validation ---------- */
  function validateField(el) {
    const value = el.value.trim();
    if (el.required && !value) {
      const verb = el.tagName === 'SELECT' ? 'Please choose' : 'Please enter';
      setError(el, el.id, `${verb} ${labelFor(el).toLowerCase()}.`, el);
      return false;
    }
    if (value && el.dataset.validate === 'email' && !EMAIL.test(value)) {
      setError(el, el.id, 'Enter a valid email address, like name@example.com.', el);
      return false;
    }
    if (value && el.dataset.validate === 'phone') {
      const digits = value.replace(/[\s()+-]/g, '');
      if (!/^\d{10,14}$/.test(digits)) {
        setError(el, el.id, 'Enter a valid phone number, like 0803 123 4567.', el);
        return false;
      }
    }
    if (value && el.type === 'date') {
      const date = new Date(value);
      if (Number.isNaN(date.getTime()) || date > new Date()) {
        setError(el, el.id, 'Date of birth cannot be in the future.', el);
        return false;
      }
    }
    clearError(el, el.id);
    return true;
  }

  function validateGroup(container) {
    const name = container.dataset.requiredGroup;
    const checked = form.querySelector(`input[name="${name}"]:checked`);
    const group = container.closest('fieldset');
    if (!checked) {
      container.classList.add('is-invalid');
      setError(group, name, `Please choose ${group.querySelector('legend').firstChild.textContent.trim().toLowerCase()}.`, container);
      return false;
    }
    container.classList.remove('is-invalid');
    clearError(group, name);
    return true;
  }

  function validateUpload(upload) {
    const input = upload.querySelector('input[type="file"]');
    const zone = upload.querySelector('.upload__zone');
    if (upload.dataset.required === 'true' && !files[input.name]) {
      upload.classList.add('is-invalid');
      setError(input, input.name, `Please attach the ${upload.querySelector('.upload__title').firstChild.textContent.trim().toLowerCase()}.`, upload.querySelector('[data-remove]'));
      return false;
    }
    upload.classList.remove('is-invalid');
    clearError(input, input.name);
    zone.removeAttribute('aria-invalid');
    return true;
  }

  function validateStep(step) {
    const section = steps[step - 1];
    const invalid = [];

    section.querySelectorAll('[data-required-group]').forEach((group) => {
      if (!validateGroup(group)) invalid.push(group.querySelector('input'));
    });
    section.querySelectorAll('input:not([type="radio"]):not([type="file"]):not([type="checkbox"]), select, textarea').forEach((el) => {
      if (!validateField(el)) invalid.push(el);
    });
    section.querySelectorAll('[data-upload]').forEach((upload) => {
      if (!validateUpload(upload)) invalid.push(upload.querySelector('input[type="file"]'));
    });

    if (step === TOTAL_STEPS) {
      const consent = form.querySelector('#consent');
      const box = consent.closest('.consent');
      if (!consent.checked) {
        box.classList.add('is-invalid');
        setError(consent, 'consent', 'Please confirm the information is correct before submitting.', box);
        invalid.push(consent);
      } else {
        box.classList.remove('is-invalid');
        clearError(consent, 'consent');
      }
    }

    // Sort into document order so focus lands on the first problem on screen.
    invalid.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    return invalid;
  }

  // Clear an error as soon as it is fixed.
  form.addEventListener('input', (event) => {
    const el = event.target;
    if (el.getAttribute('aria-invalid') === 'true' && !['radio', 'file', 'checkbox'].includes(el.type)) validateField(el);
    clearTimeout(saveTimer);
    saveTimer = setTimeout(saveDraft, 400);
  });
  let saveTimer;

  form.addEventListener('change', (event) => {
    const el = event.target;
    if (el.type === 'radio') {
      const container = el.closest('[data-required-group]');
      if (container && container.classList.contains('is-invalid')) validateGroup(container);
    }
    if (el.type === 'checkbox' && el.id === 'consent' && el.checked) {
      el.closest('.consent').classList.remove('is-invalid');
      clearError(el, 'consent');
    }
    saveDraft();
  });

  /* ---------- uploads ---------- */
  function formatSize(bytes) {
    return bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  function renderUpload(upload) {
    const input = upload.querySelector('input[type="file"]');
    const info = files[input.name];
    upload.classList.toggle('has-file', Boolean(info));
    upload.querySelector('[data-file-name]').textContent = info ? `${info.name} · ${formatSize(info.size)}` : '';
    upload.querySelector('.upload__hint').textContent = info ? 'Replace file' : 'Choose a file';
    upload.querySelector('[data-remove]').hidden = !info;
  }

  form.querySelectorAll('[data-upload]').forEach((upload) => {
    const input = upload.querySelector('input[type="file"]');

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const okType = /\.(pdf|jpe?g|png)$/i.test(file.name);
      if (!okType || file.size > MAX_FILE_BYTES) {
        input.value = '';
        delete files[input.name];
        renderUpload(upload);
        upload.classList.add('is-invalid');
        setError(input, input.name, !okType ? 'Please choose a PDF, JPG or PNG file.' : 'This file is larger than 5 MB. Please choose a smaller file.', upload.querySelector('[data-remove]'));
        return;
      }
      files[input.name] = { name: file.name, size: file.size };
      upload.classList.remove('is-invalid');
      clearError(input, input.name);
      renderUpload(upload);
    });

    upload.querySelector('[data-remove]').addEventListener('click', () => {
      input.value = '';
      delete files[input.name];
      renderUpload(upload);
      input.focus();
    });
  });

  /* ---------- review ---------- */
  function value(name) {
    const el = form.elements[name];
    if (!el) return '';
    if (el instanceof RadioNodeList) return el.value || '';
    return el.value.trim();
  }

  function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(`${iso}T00:00:00`);
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  function buildReview() {
    const sections = [
      { step: 1, title: 'Student', rows: [
        ['Full name', [value('studentFirst'), value('studentMiddle'), value('studentLast')].filter(Boolean).join(' ')],
        ['Date of birth', formatDate(value('studentDob'))],
        ['Gender', value('studentGender')],
      ] },
      { step: 2, title: 'Parent / Guardian', rows: [
        ['Full name', value('parentName')],
        ['Relationship', value('parentRelation')],
        ['Phone', value('parentPhone')],
        ['Email', value('parentEmail') || 'Not provided'],
        ['Home address', value('parentAddress')],
      ] },
      { step: 3, title: 'Academic', rows: [
        ['Level', value('level')],
        ['Class applying for', value('classApplying')],
        ['Previous school', value('previousSchool') || 'Not provided'],
        ['Additional notes', value('notes') || 'None'],
      ] },
      { step: 4, title: 'Documents', rows: [
        ['Birth certificate', files.birthCertificate ? files.birthCertificate.name : 'Not attached'],
        ['Passport photograph', files.passportPhoto ? files.passportPhoto.name : 'Not attached'],
        ['School report', files.schoolReport ? files.schoolReport.name : 'Not attached'],
      ] },
    ];

    review.replaceChildren(...sections.map((section) => {
      const wrap = document.createElement('section');
      wrap.className = 'review__section';
      wrap.setAttribute('aria-labelledby', `review-${section.step}`);

      const head = document.createElement('div');
      head.className = 'review__head';
      const h = document.createElement('h2');
      h.className = 'review__title';
      h.id = `review-${section.step}`;
      h.textContent = section.title;
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.className = 'review__edit';
      edit.dataset.edit = section.step;
      edit.innerHTML = `Edit<span class="visually-hidden"> ${section.title.toLowerCase()} details</span>`;
      head.append(h, edit);

      const dl = document.createElement('dl');
      dl.className = 'review__list';
      section.rows.forEach(([label, val]) => {
        const row = document.createElement('div');
        row.className = 'review__row';
        const dt = document.createElement('dt');
        dt.textContent = label;
        const dd = document.createElement('dd');
        dd.textContent = val; // textContent: user input is never parsed as HTML
        row.append(dt, dd);
        dl.append(row);
      });

      wrap.append(head, dl);
      return wrap;
    }));
  }

  review.addEventListener('click', (event) => {
    const button = event.target.closest('[data-edit]');
    if (!button) return;
    returnToReview = true;
    goTo(Number(button.dataset.edit));
  });

  /* ---------- navigation ---------- */
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const invalid = validateStep(current);
    if (invalid.length) {
      showFormError(invalid.length === 1 ? 'Please fix the highlighted field to continue.' : `Please fix the ${invalid.length} highlighted fields to continue.`);
      invalid[0].focus();
      return;
    }

    if (current === TOTAL_STEPS) {
      complete();
      return;
    }

    if (returnToReview) {
      // Re-check every earlier step before jumping back to the review.
      for (let s = 1; s < TOTAL_STEPS; s++) {
        if (validateStep(s).length) { returnToReview = false; goTo(s); return; }
      }
      goTo(TOTAL_STEPS);
      return;
    }
    goTo(current + 1);
  });

  backBtn.addEventListener('click', () => {
    if (current === 1) {
      showView('landing');
      updateResume();
      document.querySelector('[data-action="start"]').focus();
      return;
    }
    if (returnToReview) { returnToReview = false; goTo(TOTAL_STEPS); return; }
    goTo(current - 1);
  });

  /* ---------- draft ---------- */
  function saveDraft() {
    if (views.form.hidden) return;
    const data = { step: current };
    [...form.elements].forEach((el) => {
      if (!el.name || el.type === 'file' || el.type === 'checkbox') return;
      if (el.type === 'radio') { if (el.checked) data[el.name] = el.value; return; }
      data[el.name] = el.value;
    });
    store.set(DRAFT_KEY, JSON.stringify(data));
  }

  function loadDraft() {
    const raw = store.get(DRAFT_KEY);
    if (!raw) return null;
    try { return JSON.parse(raw); } catch (e) { return null; }
  }

  function restoreDraft(data) {
    Object.entries(data).forEach(([name, val]) => {
      if (name === 'step') return;
      const el = form.elements[name];
      if (!el) return;
      if (el instanceof RadioNodeList) {
        [...el].forEach((radio) => { radio.checked = radio.value === val; });
      } else {
        el.value = val;
      }
    });
  }

  function hasDraftContent(data) {
    return data && Object.entries(data).some(([k, v]) => k !== 'step' && v);
  }

  function updateResume() {
    resumeBtn.hidden = !hasDraftContent(loadDraft());
  }

  function resetForm() {
    form.reset();
    Object.keys(files).forEach((k) => delete files[k]);
    form.querySelectorAll('[data-upload]').forEach(renderUpload);
    form.querySelectorAll('.error-text').forEach((p) => p.remove());
    form.querySelectorAll('[aria-invalid]').forEach((el) => el.removeAttribute('aria-invalid'));
    form.querySelectorAll('.is-invalid').forEach((el) => el.classList.remove('is-invalid'));
    returnToReview = false;
  }

  /* ---------- completion ---------- */
  function nextReference() {
    const count = (parseInt(store.get(COUNTER_KEY), 10) || 0) + 1;
    store.set(COUNTER_KEY, String(count));
    return `DEMO-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;
  }

  function complete() {
    document.querySelector('[data-reference]').textContent = nextReference();
    document.querySelector('[data-success-name]').textContent = value('parentName') || 'applicant';
    store.remove(DRAFT_KEY);
    resetForm();
    showView('success');
    document.getElementById('success-title').focus();
  }

  /* ---------- entry points ---------- */
  document.querySelector('[data-action="start"]').addEventListener('click', () => {
    store.remove(DRAFT_KEY);
    resetForm();
    showView('form');
    goTo(1);
  });

  resumeBtn.addEventListener('click', () => {
    const data = loadDraft();
    resetForm();
    if (data) restoreDraft(data);
    showView('form');
    // Files cannot be restored, so a draft past the documents step resumes there.
    goTo(Math.min(Math.max(1, Number(data && data.step) || 1), 4));
  });

  document.querySelector('[data-action="restart"]').addEventListener('click', () => {
    resetForm();
    showView('form');
    goTo(1);
  });

  updateResume();
})();
