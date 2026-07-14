/* ═══════════════════════════════════════════════════════════════
   NABIHAH PERFORMANCE DASHBOARD 2026  ·  app.js
   Interactions: Nav, Canvas Particles, Scroll Reveal,
                 Skill Bar Animation, Active Nav Tracking,
                 Card Glow, Progress Meter Animation
═══════════════════════════════════════════════════════════════ */

'use strict';

/* ── 0. THEME TOGGLE (LIGHT / DARK) ─────────────────────────── */
const themeToggle = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

// Load saved preference or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
htmlEl.setAttribute('data-theme', savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const currentTheme = htmlEl.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    htmlEl.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  });
}

/* ── 1. NAV — SCROLL STICKY + MOBILE BURGER ─────────────────── */
const nav    = document.getElementById('nav');
const burger = document.getElementById('nav-burger');
const links  = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
  nav.classList.toggle('stuck', window.scrollY > 60);
}, { passive: true });

burger.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', String(open));
});

links.querySelectorAll('.nav-link').forEach(a => {
  a.addEventListener('click', () => links.classList.remove('open'));
});


/* ── 2. ACTIVE NAV LINK (IntersectionObserver) ───────────────── */
const navAnchors = document.querySelectorAll('.nav-link[href^="#"]');

const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

document.querySelectorAll('section[id], header[id]').forEach(s => sectionObserver.observe(s));


/* ── 3. SMOOTH SCROLL FOR ALL ANCHOR LINKS ───────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 66;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: 'smooth' });
  });
});


/* ── 4. CANVAS PARTICLE FIELD ────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const colors = [
    [45, 212, 191],
    [129, 140, 248],
    [167, 139, 250],
    [251, 191, 36],
    [228, 238, 255],
  ];

  let W, H, particles = [];

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x    = Math.random() * W;
      this.y    = init ? Math.random() * H : H + 10;
      this.r    = Math.random() * 2 + 0.5;
      this.vx   = (Math.random() - 0.5) * 0.25;
      this.vy   = -(Math.random() * 0.4 + 0.15);
      this.life = 0;
      this.maxL = Math.random() * 220 + 120;
      const c   = colors[Math.floor(Math.random() * colors.length)];
      this.col  = `rgba(${c[0]},${c[1]},${c[2]},`;
    }
    draw() {
      const alpha = Math.sin((this.life / this.maxL) * Math.PI) * 0.55;
      if (alpha <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.col + alpha + ')';
      ctx.shadowColor = this.col + '0.4)';
      ctx.shadowBlur  = this.r * 3;
      ctx.fill();
      ctx.shadowBlur  = 0;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.life++;
      if (this.life >= this.maxL) this.reset();
    }
  }

  function initParticles() {
    particles = Array.from({ length: 55 }, () => new Particle());
  }

  let raf;
  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    raf = requestAnimationFrame(loop);
  }

  const ro = new ResizeObserver(() => { resize(); initParticles(); });
  ro.observe(canvas.parentElement);

  resize();
  initParticles();
  loop();

  // Pause when tab not visible
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else loop();
  });
})();


/* ── 5. SCROLL REVEAL ────────────────────────────────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      // stagger siblings
      const siblings = [...e.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
      const idx = siblings.indexOf(e.target);
      setTimeout(() => {
        e.target.classList.add('visible');
      }, Math.min(idx * 80, 320));
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));


/* ── 6. SKILL BARS & PROGRESS METERS — animate on visibility ─── */
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.animationPlayState = 'running';
      barObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.sk-fill, .rmp-fill').forEach(el => {
  el.style.animationPlayState = 'paused';
  barObs.observe(el);
});


/* ── 7. QUAD CARD MOUSE-GLOW ─────────────────────────────────── */
document.querySelectorAll('.quad-card, .rm-card, .tl-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
    card.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
  });
});


/* ── 8. HERO ELEMENT FADE-IN SEQUENCE ────────────────────────── */
(function heroEntrance() {
  const els = document.querySelectorAll(
    '.hero-meta, .hero-h1, .hero-tagline, .hero-info-strip, .focus-row, .scroll-hint'
  );
  els.forEach((el, i) => {
    el.style.cssText += `
      opacity:0;
      transform:translateY(16px);
      transition:opacity .7s ease ${0.12 + i * 0.13}s, transform .7s ease ${0.12 + i * 0.13}s;
    `;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      el.style.opacity  = '1';
      el.style.transform = 'translateY(0)';
    }));
  });
})();


/* ── 9. TIMELINE HOVER — DOT GLOW COLOR ─────────────────────── */
document.querySelectorAll('.tl-item').forEach(item => {
  const dot = item.querySelector('.tl-dot');
  if (!dot) return;
  const clr = dot.classList.contains('tld-teal')   ? 'var(--teal-g)'
            : dot.classList.contains('tld-violet')  ? 'var(--violet-g)'
            : dot.classList.contains('tld-amber')   ? 'var(--amber-g)'
            : 'var(--blue-g)';
  item.addEventListener('mouseenter', () => { dot.style.boxShadow = `0 0 14px ${clr}`; });
  item.addEventListener('mouseleave', () => { dot.style.boxShadow = ''; });
});


/* ── 10. ANIMATED COUNTER FOR KPI CARDS ─────────────────────── */
function countUp(el, to, suffix = '', duration = 900) {
  const isText = isNaN(parseFloat(to));
  if (isText) return; // skip non-numeric (e.g. "On-Chip")
  const start = 0;
  const num   = parseFloat(to);
  const step  = 1000 / 60;
  const steps = Math.round(duration / step);
  let current = 0;
  const inc   = (num - start) / steps;
  const timer = setInterval(() => {
    current += inc;
    if (current >= num) { current = num; clearInterval(timer); }
    el.textContent = (Number.isInteger(num) ? Math.round(current) : current.toFixed(1)) + suffix;
  }, step);
}

const kpiObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const valEl = e.target.querySelector('.kpi-val');
    if (!valEl) return;
    const raw  = valEl.textContent.trim();
    const num  = parseFloat(raw.replace(/[^0-9.]/g, ''));
    const suf  = raw.replace(/[0-9.]/g, '').trim();
    if (!isNaN(num)) countUp(valEl, num, suf);
    kpiObs.unobserve(e.target);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.kpi-card').forEach(el => kpiObs.observe(el));


/* ── 11. TIMELINE LAZY COLOUR-CODING ────────────────────────── */
// Colour tl-tag chips based on keywords
document.querySelectorAll('.tl-tag').forEach(tag => {
  const t = tag.textContent.toLowerCase();
  if (t.includes('★') || t.includes('critical') || t.includes('deployed') || t.includes('on-chip')) {
    tag.style.background = 'var(--teal-d)';
    tag.style.color      = 'var(--teal)';
    tag.style.border     = '1px solid rgba(45,212,191,.22)';
  } else if (t.includes('esp32') || t.includes('firmware') || t.includes('first contact') || t.includes('tinyml') || t.includes('voice')) {
    tag.style.background = 'var(--amber-d)';
    tag.style.color      = 'var(--amber)';
    tag.style.border     = '1px solid rgba(251,191,36,.22)';
  } else if (t.includes('handover') || t.includes('pktom delivered') || t.includes('team')) {
    tag.style.background = 'var(--violet-d)';
    tag.style.color      = 'var(--violet)';
    tag.style.border     = '1px solid rgba(167,139,250,.22)';
  }
});


/* ── CONSOLE BRANDING ────────────────────────────────────────── */
console.log('%c🚀 Nabihah · Performance Dashboard · FY 2026',
  'color:#2dd4bf;font-size:13px;font-weight:800;font-family:monospace;');
console.log('%cData sourced from: Weekly_Report_2026_nabihah_Updated.xlsx + Self_Performance_Evaluation_Form.xlsx',
  'color:#818cf8;font-size:10px;font-family:monospace;');
console.log('%c© Ingenious Technology Solutions Sdn. Bhd.',
  'color:#3d5470;font-size:10px;font-family:monospace;');
