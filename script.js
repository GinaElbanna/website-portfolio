// -------- utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ======== THEME TOGGLE ========
(function themeToggle() {
  const btn = document.getElementById('theme-toggle');
  if (!btn) return;

  const STORAGE_KEY = 'theme'; // 'light' | 'dark'
  const mq = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(mode) {
    // set attribute for CSS variables
    document.documentElement.setAttribute('data-theme', mode);
    // hints for form controls/scrollbars
    document.documentElement.style.colorScheme = mode === 'light' ? 'light' : 'dark';
    btn.textContent = mode === 'light' ? '🌙 Dark' : '☀️ Light';
    localStorage.setItem(STORAGE_KEY, mode);
  }

  // init: stored → system → default('dark')
  const initial = localStorage.getItem(STORAGE_KEY) || (mq.matches ? 'dark' : 'light');
  applyTheme(initial);

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || initial;
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // if user hasn't chosen manually, follow system changes
  mq.addEventListener?.('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // keyboard: D
  addEventListener('keydown', e => {
    if (e.key.toLowerCase() === 'd') btn.click();
  });
})();

// ======== FOOTER YEAR ========
(function setYear() {
  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();

// ======== PROJECT FILTERING ========
// Buttons: <button class="btn" data-filter="firebase">...</button>
// Cards:   <article class="card" data-tags="firebase web">...</article>
(function projectFilter() {
  const buttons = $$('[data-filter]');
  const cards = $$('#project-cards .card');
  if (!buttons.length || !cards.length) return;

  function applyFilter(filter) {
    cards.forEach(card => {
      const tags = (card.getAttribute('data-tags') || '').toLowerCase();
      const show = (filter === 'all') || tags.includes(filter);
      card.style.display = show ? '' : 'none';
    });
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => applyFilter((btn.dataset.filter || 'all').toLowerCase()));
  });

  // default state: show all
  applyFilter('all');
})();

// ======== SKILL BARS FROM data-level ========
(function hydrateSkillMeters() {
  document.querySelectorAll('.meter > i[data-level]').forEach(i => {
    const n = parseInt(i.getAttribute('data-level'), 10);
    const clamped = Number.isFinite(n) ? Math.max(0, Math.min(100, n)) : 0;
    i.style.width = clamped + '%';
  });
})();
