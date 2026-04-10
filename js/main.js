/* Frankli Studios — Main JavaScript */

(function () {
  'use strict';

  // Signal that JS is available (enables scroll-reveal CSS rules)
  document.documentElement.classList.add('js-enabled');

  // ── Footer year ────────────────────────────────────────────
  const yearEl = document.getElementById('footer-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Header: add 'scrolled' class after scrolling ───────────
  const header = document.getElementById('site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run once on load

  // ── Mobile nav toggle ──────────────────────────────────────
  const toggle  = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');

  function openMenu() {
    navMenu.classList.add('open');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    navMenu.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', function () {
    const isOpen = navMenu.classList.contains('open');
    isOpen ? closeMenu() : openMenu();
  });

  // Close when a nav link is clicked
  navMenu.querySelectorAll('.nav__link').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
      closeMenu();
      toggle.focus();
    }
  });

  // ── Scroll reveal ──────────────────────────────────────────
  function initReveal() {
    const revealEls = document.querySelectorAll(
      '.service-card, .film-card, .process__step, ' +
      '.about__grid, .contact__grid, .section__header, ' +
      '.film-strip, .about__stats'
    );

    // Add reveal class
    revealEls.forEach(function (el) {
      el.classList.add('reveal');
    });

    // Grids get stagger class
    document.querySelectorAll('.services__grid, .films__grid, .process__steps').forEach(function (grid) {
      grid.classList.add('reveal-stagger');
      // remove individual reveal from children (parent handles stagger)
      grid.querySelectorAll('.reveal').forEach(function (child) {
        child.classList.remove('reveal');
      });
    });

    var revealAll = document.querySelectorAll('.reveal, .reveal-stagger');

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      // Start revealing before elements fully enter the viewport
      rootMargin: '0px 0px -60px 0px'
    });

    revealAll.forEach(function (el) {
      observer.observe(el);
    });

    // Safety net: reveal everything after 2.5 s in case observer misses any
    setTimeout(function () {
      revealAll.forEach(function (el) { el.classList.add('visible'); });
    }, 2500);
  }

  if ('IntersectionObserver' in window) {
    initReveal();
  } else {
    // Fallback: show everything immediately
    document.querySelectorAll('.reveal, .reveal-stagger').forEach(function (el) {
      el.classList.add('visible');
    });
  }

  // ── Animated counters ──────────────────────────────────────
  function animateCounter(el, target, duration) {
    var start = 0;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      // ease out cubic
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var statsObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.stat__number').forEach(function (num) {
          var target = parseInt(num.getAttribute('data-target'), 10);
          animateCounter(num, target, 1200);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  var statsEl = document.querySelector('.about__stats');
  if (statsEl) statsObserver.observe(statsEl);

  // ── Contact form ───────────────────────────────────────────
  var form       = document.getElementById('contact-form');
  var successMsg = document.getElementById('form-success');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      // Basic HTML5 validation
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      // Simulate async submit (replace with real endpoint as needed)
      var submitBtn = form.querySelector('[type="submit"]');
      submitBtn.textContent = 'Sending…';
      submitBtn.disabled = true;

      setTimeout(function () {
        successMsg.hidden = false;
        form.reset();
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
      }, 1000);
    });
  }

}());
