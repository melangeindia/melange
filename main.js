// year
document.getElementById('yr').textContent = new Date().getFullYear();

// sticky nav shadow
const nav = document.getElementById('nav');
addEventListener('scroll', () => nav.classList.toggle('scrolled', scrollY > 30));

// mobile menu
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => {
  burger.classList.toggle('x');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(a =>
  a.addEventListener('click', () => { burger.classList.remove('x'); navLinks.classList.remove('open'); })
);

// logo fallback — if logo image is missing/empty, show text wordmark
document.querySelectorAll('.brand img, .foot-logo, #brandLogo').forEach(img => {
  const showFallback = () => {
    img.style.display = 'none';
    const fb = img.parentElement.querySelector('.brand-fallback');
    if (fb) fb.style.display = 'flex';
  };
  img.addEventListener('error', showFallback);
  if (img.complete && img.naturalWidth === 0) showFallback();
});

// scroll reveal
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el, i) => {
  el.style.transitionDelay = (i % 4 * 0.08) + 's';
  io.observe(el);
});

// animated counters
const counters = document.querySelectorAll('.num');
const cio = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el = e.target, target = +el.dataset.target;
    let cur = 0; const step = Math.max(1, target / 60);
    const tick = () => {
      cur += step;
      if (cur >= target) { el.textContent = target.toLocaleString(); }
      else { el.textContent = Math.floor(cur).toLocaleString(); requestAnimationFrame(tick); }
    };
    tick(); cio.unobserve(el);
  });
}, { threshold: 0.5 });
counters.forEach(c => cio.observe(c));
