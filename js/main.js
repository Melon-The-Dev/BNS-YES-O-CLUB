/* =============================================
   YES-O — Main JavaScript
   ============================================= */

document.addEventListener('DOMContentLoaded', () => {

  'use strict';

  /* ----- Navbar Scroll Effect ----- */
  const navbar = document.querySelector('.navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.pageYOffset;
    if (current > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = current;
  });

  /* ----- Mobile Menu ----- */
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileOverlay = document.querySelector('.mobile-menu-overlay');

  function openMenu() {
    toggle.classList.add('active');
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    toggle.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.contains('active') ? closeMenu() : openMenu();
    });
  }
  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMenu);
  }

  // Close mobile menu on link click
  document.querySelectorAll('.mobile-menu-links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  /* ----- Active Nav Link ----- */
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath) {
      link.classList.add('active');
    }
  });

  /* ----- Scroll Reveal Animations ----- */
  const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  revealElements.forEach(el => revealObserver.observe(el));

  // Also observe stat cards, event cards, etc with stagger
  document.querySelectorAll('.stat-card, .event-card, .project-card, .testimonial-card, .news-card, .edu-card, .value-card, .officer-card').forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
    revealObserver.observe(el);
  });

  /* ----- Animated Counters ----- */
  const counterElements = document.querySelectorAll('.stat-number');

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent.trim();
        // Parse the number, handling commas and suffixes like +
        const rawNum = parseInt(text.replace(/[^0-9]/g, ''));
        if (isNaN(rawNum)) return;

        // Store suffix if any (+, K, etc)
        const suffix = text.replace(/[0-9,]/g, '').trim();
        const prefix = text.replace(/[0-9,+\s]/g, '').trim();

        animateCounter(el, rawNum, prefix, suffix);
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counterElements.forEach(el => counterObserver.observe(el));

  function animateCounter(el, target, prefix, suffix) {
    let current = 0;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let step = 0;

    function update() {
      step++;
      current = Math.min(Math.round(increment * step), target);
      // Format with commas
      const formatted = current.toLocaleString();
      el.innerHTML = `${prefix ? prefix + ' ' : ''}${formatted}<span class="suffix">${suffix || '+'}</span>`;

      if (current < target) {
        // Ease out for more natural feel
        const ease = 1 - Math.pow(1 - (step / steps), 3);
        const easedVal = Math.round(ease * target);
        const formattedEased = easedVal.toLocaleString();
        el.innerHTML = `${prefix ? prefix + ' ' : ''}${formattedEased}<span class="suffix">${suffix || '+'}</span>`;
        requestAnimationFrame(() => setTimeout(update, duration / steps));
      } else {
        el.innerHTML = `${prefix ? prefix + ' ' : ''}${formatted}<span class="suffix">${suffix || '+'}</span>`;
      }
    }
    update();
  }

  /* ----- Gallery Filter (Events/Projects) ----- */
  const filterTabs = document.querySelectorAll('.filter-tab');
  const filterItems = document.querySelectorAll('.filter-item');

  if (filterTabs.length) {
    filterTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const filter = tab.dataset.filter;

        filterTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        filterItems.forEach(item => {
          if (filter === 'all' || item.dataset.category === filter) {
            item.style.display = 'block';
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            setTimeout(() => {
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }

  /* ----- Lightbox ----- */
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox?.querySelector('img');
  const lightboxClose = lightbox?.querySelector('.lightbox-close');

  if (lightbox) {
    function openLightbox(src, alt) {
      lightboxImg.src = src;
      lightboxImg.alt = alt || '';
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    // Gallery items
    document.querySelectorAll('.gallery-item, .masonry-item').forEach(item => {
      item.addEventListener('click', () => {
        const img = item.querySelector('img');
        if (img) openLightbox(img.src, img.alt);
      });
    });

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeLightbox();
    });
  }

  /* ----- Carousel ----- */
  const carousels = document.querySelectorAll('.carousel-wrapper');

  carousels.forEach(wrapper => {
    const track = wrapper.querySelector('.carousel-track');
    const prev = wrapper.querySelector('.carousel-prev');
    const next = wrapper.querySelector('.carousel-next');
    if (!track || !prev || !next) return;

    let scrollPos = 0;

    function getScrollAmount() {
      const item = track.querySelector('*');
      if (!item) return 300;
      const style = getComputedStyle(track);
      const gap = parseInt(style.gap) || 28;
      return item.offsetWidth + gap;
    }

    function updateButtons() {
      const maxScroll = track.scrollWidth - track.clientWidth;
      prev.disabled = scrollPos <= 0;
      next.disabled = scrollPos >= maxScroll - 1;
    }

    next.addEventListener('click', () => {
      const amount = getScrollAmount();
      const maxScroll = track.scrollWidth - track.clientWidth;
      scrollPos = Math.min(scrollPos + amount, maxScroll);
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateButtons();
    });

    prev.addEventListener('click', () => {
      const amount = getScrollAmount();
      scrollPos = Math.max(scrollPos - amount, 0);
      track.style.transform = `translateX(-${scrollPos}px)`;
      updateButtons();
    });

    updateButtons();
    window.addEventListener('resize', updateButtons);
  });

  /* ----- Smooth Scroll for Anchor Links ----- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ----- Contact Form ----- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit');
      const original = submitBtn.textContent;
      submitBtn.textContent = '✓ Message Sent!';
      submitBtn.style.background = '#2ecc71';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.textContent = original;
        submitBtn.style.background = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    });
  }

  /* ----- Newsletter Form ----- */
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input');
      const btn = newsletterForm.querySelector('button');
      const original = btn.textContent;
      btn.textContent = '✓ Subscribed!';
      btn.style.background = '#2ecc71';

      setTimeout(() => {
        btn.textContent = original;
        btn.style.background = '';
        input.value = '';
      }, 2500);
    });
  }

  /* ----- Parallax Effect on Hero ----- */
  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scroll = window.pageYOffset;
      const speed = 0.4;
      heroBg.style.transform = `translateY(${scroll * speed}px)`;
    });
  }

  /* ----- Glassmorphism Stat Cards on Scroll ----- */
  // Already handled by reveal observer above

  console.log('🌿 YES-O Website initialized');

  /* ----- Education Accordion ----- */
  document.querySelectorAll('.edu-accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const wasActive = item.classList.contains('active');
      // Close all siblings in this card
      item.parentElement.querySelectorAll('.edu-accordion-item').forEach(sib => {
        sib.classList.remove('active');
      });
      // Toggle clicked one
      if (!wasActive) item.classList.add('active');
    });
  });

  /* ----- Theme Toggle ----- */
  const themeToggle = document.getElementById('themeToggle');
  const icon = themeToggle?.querySelector('i');

  // Load saved theme
  const savedTheme = localStorage.getItem('yeso-theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) { icon.className = 'fas fa-sun'; }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const html = document.documentElement;
      const isDark = html.getAttribute('data-theme') === 'dark';
      if (isDark) {
        html.removeAttribute('data-theme');
        localStorage.setItem('yeso-theme', 'light');
        if (icon) { icon.className = 'fas fa-moon'; }
      } else {
        html.setAttribute('data-theme', 'dark');
        localStorage.setItem('yeso-theme', 'dark');
        if (icon) { icon.className = 'fas fa-sun'; }
      }
    });
  }
});
