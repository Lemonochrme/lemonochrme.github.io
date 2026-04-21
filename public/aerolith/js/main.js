/* ============================================================
   AEROLITH — JavaScript
   Animations, interactions, canvas hero background
   ============================================================ */

/* ─── NAV SCROLL BEHAVIOR ────────────────────────────────── */
(function () {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  const onScroll = () => {
    if (window.scrollY > 40) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* ─── MOBILE NAV ─────────────────────────────────────────── */
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const drawer = document.querySelector('.nav-drawer');
  if (!toggle || !drawer) return;

  toggle.addEventListener('click', () => {
    const isOpen = toggle.classList.toggle('open');
    if (isOpen) {
      drawer.style.display = 'flex';
      requestAnimationFrame(() => drawer.classList.add('open'));
      document.body.style.overflow = 'hidden';
    } else {
      drawer.classList.remove('open');
      setTimeout(() => {
        drawer.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    }
  });

  drawer.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('open');
      drawer.classList.remove('open');
      setTimeout(() => {
        drawer.style.display = 'none';
        document.body.style.overflow = '';
      }, 250);
    });
  });
})();

/* ─── REVEAL ON SCROLL ───────────────────────────────────── */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
})();

/* ─── ACTIVE NAV LINK ────────────────────────────────────── */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navLinks.forEach(link => {
          const href = link.getAttribute('href');
          if (href === '#' + id || (href && href.endsWith('#' + id))) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
})();

/* ─── HERO CANVAS ANIMATION ──────────────────────────────── */
(function () {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, animId;
  let dots = [];
  const DOT_COUNT = 120;
  const MAX_DIST = 150;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function randomDot() {
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r:  Math.random() * 1.5 + 0.5,
    };
  }

  function init() {
    resize();
    dots = Array.from({ length: DOT_COUNT }, randomDot);
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Move dots
    dots.forEach(d => {
      d.x += d.vx;
      d.y += d.vy;
      if (d.x < -20) d.x = W + 20;
      if (d.x > W + 20) d.x = -20;
      if (d.y < -20) d.y = H + 20;
      if (d.y > H + 20) d.y = -20;
    });

    // Draw connections
    for (let i = 0; i < dots.length; i++) {
      for (let j = i + 1; j < dots.length; j++) {
        const dx = dots[i].x - dots[j].x;
        const dy = dots[i].y - dots[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist / MAX_DIST) * 0.25;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.moveTo(dots[i].x, dots[i].y);
          ctx.lineTo(dots[j].x, dots[j].y);
          ctx.stroke();
        }
      }
    }

    // Draw dots
    dots.forEach(d => {
      ctx.beginPath();
      ctx.fillStyle = 'rgba(96,165,250,0.6)';
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });

  init();
  draw();
})();

/* ─── SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────────── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ─── COUNTER ANIMATION ──────────────────────────────────── */
(function () {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // easeOutExpo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const value = eased * target;
        el.textContent = prefix + (Number.isInteger(target) ? Math.round(value) : value.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();

/* ─── FORM SUBMIT (PLACEHOLDER) ──────────────────────────── */
(function () {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Message Sent';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      form.reset();
    }, 3000);
  });
})();
