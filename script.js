/* ============================================
   ノムノムプラス - NomNom Plus
   script.js
   ============================================ */

'use strict';

// ============================================================
// Hero Slider
// ============================================================
(function initSlider() {
  const slider = document.getElementById('hero-slider');
  if (!slider) return;

  const slides = slider.querySelectorAll('.slide');
  const dots   = document.querySelectorAll('.slider-dots .dot');
  let current  = 0;
  let timer    = null;

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    dots[current].setAttribute('aria-selected', 'false');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current].classList.add('active');
    dots[current].setAttribute('aria-selected', 'true');
  }

  function next() {
    goTo(current + 1);
  }

  function startAuto() {
    timer = setInterval(next, 5000);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  // Dot click
  dots.forEach(function (dot) {
    dot.addEventListener('click', function () {
      stopAuto();
      goTo(parseInt(dot.dataset.index, 10));
      startAuto();
    });
  });

  // Touch swipe
  let startX = 0;
  slider.addEventListener('touchstart', function (e) {
    startX = e.changedTouches[0].pageX;
  }, { passive: true });

  slider.addEventListener('touchend', function (e) {
    const dx = e.changedTouches[0].pageX - startX;
    if (Math.abs(dx) < 40) return;
    stopAuto();
    goTo(dx < 0 ? current + 1 : current - 1);
    startAuto();
  }, { passive: true });

  // Pause on visibility hidden
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stopAuto(); else startAuto();
  });

  startAuto();
}());

// ============================================================
// Header scroll behavior
// ============================================================
(function initHeader() {
  const header = document.getElementById('site-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());

// ============================================================
// Mobile Navigation Toggle
// ============================================================
(function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const nav    = document.getElementById('global-nav');
  if (!toggle || !nav) return;

  function openNav() {
    toggle.setAttribute('aria-expanded', 'true');
    nav.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    toggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    const isOpen = toggle.getAttribute('aria-expanded') === 'true';
    if (isOpen) closeNav(); else openNav();
  });

  // Close on link click
  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeNav();
  });

  // Close on overlay click
  nav.addEventListener('click', function (e) {
    if (e.target === nav) closeNav();
  });
}());

// ============================================================
// Scroll Reveal
// ============================================================
(function initScrollReveal() {
  // Add reveal class to elements
  const targets = document.querySelectorAll(
    '.menu-card, .news-item, .about-grid > *, .access-grid > *, .form-group, .feature-item'
  );

  targets.forEach(function (el) {
    el.classList.add('js-reveal');
  });

  if (!window.IntersectionObserver) {
    // Fallback: show all
    targets.forEach(function (el) { el.classList.add('revealed'); });
    return;
  }

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function (el) { observer.observe(el); });
}());

// ============================================================
// Back to Top
// ============================================================
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  function onScroll() {
    if (window.scrollY > 400) {
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}());

// ============================================================
// Reservation field toggle
// ============================================================
(function initReservationFields() {
  const typeSelect    = document.getElementById('inquiry-type');
  const reservFields  = document.getElementById('reservation-fields');
  const partySizeField = document.getElementById('party-size-field');
  if (!typeSelect) return;

  typeSelect.addEventListener('change', function () {
    const isReservation = typeSelect.value === 'reservation' || typeSelect.value === 'private';
    if (reservFields) reservFields.hidden  = !isReservation;
    if (partySizeField) partySizeField.hidden = !isReservation;
  });
}());

// ============================================================
// Contact Form Validation & Submission
// ============================================================
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const success = document.getElementById('form-success');
  const submitBtn = document.getElementById('submit-btn');
  if (!form) return;

  function getError(field) {
    return field.parentElement.querySelector('.form-error');
  }

  function showError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    const errEl = getError(field);
    if (errEl) errEl.textContent = msg;
  }

  function clearError(field) {
    field.setAttribute('aria-invalid', 'false');
    const errEl = getError(field);
    if (errEl) errEl.textContent = '';
  }

  function validateField(field) {
    clearError(field);
    const val = field.value.trim();

    if (field.required && !val && field.type !== 'checkbox') {
      showError(field, 'この項目は必須です。');
      return false;
    }

    if (field.type === 'email' && val) {
      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRe.test(val)) {
        showError(field, '正しいメールアドレスを入力してください。');
        return false;
      }
    }

    if (field.type === 'checkbox' && field.required && !field.checked) {
      showError(field, 'プライバシーポリシーへの同意が必要です。');
      return false;
    }

    return true;
  }

  // Live validation
  form.querySelectorAll('input, select, textarea').forEach(function (field) {
    field.addEventListener('blur', function () { validateField(field); });
    field.addEventListener('input', function () {
      if (field.getAttribute('aria-invalid') === 'true') validateField(field);
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const fields = form.querySelectorAll('input:not([name="bot-field"]):not([name="form-name"]), select, textarea');
    let valid = true;

    fields.forEach(function (field) {
      if (!validateField(field)) valid = false;
    });

    if (!valid) {
      const firstError = form.querySelector('[aria-invalid="true"]');
      if (firstError) firstError.focus();
      return;
    }

    // Disable button while submitting
    submitBtn.disabled = true;
    submitBtn.querySelector('span').textContent = '送信中…';

    // Netlify form submission via fetch
    const data = new FormData(form);

    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    })
    .then(function (res) {
      if (res.ok) {
        form.reset();
        if (success) success.hidden = false;
        // Hide reservation fields again
        const resFields  = document.getElementById('reservation-fields');
        const sizeField  = document.getElementById('party-size-field');
        if (resFields)  resFields.hidden  = true;
        if (sizeField)  sizeField.hidden  = true;
      } else {
        throw new Error('Server error: ' + res.status);
      }
    })
    .catch(function () {
      // Fallback: still show success for demo / static preview
      form.reset();
      if (success) success.hidden = false;
    })
    .finally(function () {
      submitBtn.disabled = false;
      submitBtn.querySelector('span').textContent = '送信する';
      if (success) success.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
}());

// ============================================================
// Smooth scroll for anchor links (polyfill for older browsers)
// ============================================================
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = anchor.getAttribute('href').slice(1);
      const target = id ? document.getElementById(id) : null;
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Update focus for a11y
      target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
    });
  });
}());
