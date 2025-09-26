// -------- utilities
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// ======== THEME TOGGLE ========
(function themeToggle() {
  const btn = $('#theme-toggle');
  if (!btn) return;

  const STORAGE_KEY = 'theme'; // 'light' | 'dark'
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

  function applyTheme(mode) {
    // tell the UA to render form controls/scrollbars appropriately
    document.documentElement.style.colorScheme = mode === 'light' ? 'light' : 'dark';
    btn.textContent = mode === 'light' ? '🌙 Dark' : '☀️ Light';
    localStorage.setItem(STORAGE_KEY, mode);
  }

  // initialize from storage or system
  const initial = localStorage.getItem(STORAGE_KEY) || (prefersDark.matches ? 'dark' : 'light');
  applyTheme(initial);

  // toggle on click
  btn.addEventListener('click', () => {
    const current = localStorage.getItem(STORAGE_KEY) || (prefersDark.matches ? 'dark' : 'light');
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  // optional: react if system preference changes (only if user hasn't set a manual choice yet)
  prefersDark.addEventListener?.('change', e => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  // keyboard shortcut: D toggles theme
  addEventListener('keydown', (e) => {
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