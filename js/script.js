document.documentElement.classList.add('js');

const header = document.getElementById('header');
const menuBtn = document.getElementById('menuBtn');
const navMenu = document.getElementById('navMenu');
const toTop = document.getElementById('toTop');
const navLinks = document.querySelectorAll('.nav-link');

function setMenu(open) {
  navMenu.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  menuBtn.querySelector('i').className = open ? 'fa-solid fa-xmark' : 'fa-solid fa-bars';
}
menuBtn.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')));
navLinks.forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

function onScroll() {
  header.classList.toggle('scrolled', window.scrollY > 10);
  toTop.classList.toggle('show', window.scrollY > 500);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();
toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

const sections = document.querySelectorAll('main section[id]');
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { rootMargin: '-45% 0px -50% 0px' });
sections.forEach(s => navObserver.observe(s));

const revealObserver = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); obs.unobserve(entry.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const form = document.getElementById('contactForm');
const status = document.getElementById('formStatus');
const rules = {
  name: v => v.trim().length >= 2 || 'Enter your name.',
  email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Enter a valid email address.',
  subject: v => v.trim().length >= 3 || 'Enter a subject.',
  message: v => v.trim().length >= 10 || 'Write at least 10 characters.'
};

function check(field) {
  const result = rules[field.name](field.value);
  const err = document.getElementById(field.id + 'Err');
  err.textContent = result === true ? '' : result;
  field.classList.toggle('invalid', result !== true);
  field.setAttribute('aria-invalid', String(result !== true));
  return result === true;
}

form.querySelectorAll('input, textarea').forEach(f => f.addEventListener('blur', () => check(f)));

form.addEventListener('submit', e => {
  e.preventDefault();
  const fields = [...form.querySelectorAll('input, textarea')];
  const allValid = fields.map(check).every(Boolean);
  if (!allValid) {
    status.textContent = 'Please fix the highlighted fields.';
    fields.find(f => f.classList.contains('invalid')).focus();
    return;
  }

  const d = Object.fromEntries(new FormData(form));
  const body = `${d.message}\n\nFrom: ${d.name} (${d.email})`;
  window.location.href = `mailto:sanjananaradala7@gmail.com?subject=${encodeURIComponent(d.subject)}&body=${encodeURIComponent(body)}`;
  status.textContent = 'Your email app should open with the message ready. Press send there to deliver it.';
  form.reset();
});
