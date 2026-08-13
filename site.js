/* Arciom — shared behaviour, loaded by every page.
   The `js` class is set inline in the document head so styles never flash. */
(function () {
  // CSS cannot switch off SMIL, so remove it outright when motion is reduced
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('svg animate, svg animateTransform, svg animateMotion')
      .forEach(function (n) { n.remove(); });
  }

  // reveal-once: adds .in when an element scrolls into view, then stops watching it
  var els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!('IntersectionObserver' in window) || reduce) {
    for (var i = 0; i < els.length; i++) els[i].classList.add('in');
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.25 });
  for (var j = 0; j < els.length; j++) io.observe(els[j]);
})();

/* theme toggle — remembers the choice, falls back to the OS preference */
(function () {
  var btn = document.getElementById('theme-t');
  if (!btn) return;
  var root = document.documentElement;
  function label() {
    var dark = root.getAttribute('data-theme') === 'dark';
    btn.setAttribute('aria-label', dark ? 'Switch to light theme' : 'Switch to dark theme');
  }
  label();
  btn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('arciom-theme', next); } catch (e) {}
    label();
  });
})();

/* mobile navigation */
(function () {
  var nav = document.querySelector('body > nav');
  if (!nav) return;
  var btn = nav.querySelector('.nav-burger');
  var menu = nav.querySelector('.nav-menu');
  if (!btn || !menu) return;

  function setOpen(open) {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(nav.classList.contains('open') === false);
  });

  // a tap on any destination closes it
  menu.addEventListener('click', function (e) {
    if (e.target.closest('a')) setOpen(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setOpen(false); btn.focus(); }
  });

  document.addEventListener('click', function (e) {
    if (nav.classList.contains('open') && !nav.contains(e.target)) setOpen(false);
  });

  // if the viewport grows past the breakpoint while open, reset state
  window.addEventListener('resize', function () {
    if (window.innerWidth > 760 && nav.classList.contains('open')) setOpen(false);
  });
})();

/* Pause animation that is off-screen.
   SMIL and CSS animations keep running whether or not you can see them, so a hero
   full of them stays on the compositor for the whole page. That competes with
   whatever you are actually scrolled to, and shows up as repaint flicker. */
(function () {
  if (!('IntersectionObserver' in window)) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var all = document.querySelectorAll('svg'), animated = [];
  for (var i = 0; i < all.length; i++) {
    if (all[i].querySelector('animate, animateTransform, animateMotion')) animated.push(all[i]);
  }
  var css = document.querySelectorAll('.cbrain, .hero-brain, .hero-twin, .wave, .capshot, .report');
  if (!animated.length && !css.length) return;

  var io = new IntersectionObserver(function (entries) {
    for (var k = 0; k < entries.length; k++) {
      var e = entries[k], el = e.target;
      if (el.tagName && el.tagName.toLowerCase() === 'svg') {
        try { e.isIntersecting ? el.unpauseAnimations() : el.pauseAnimations(); } catch (err) {}
      } else {
        el.classList.toggle('anim-off', !e.isIntersecting);
      }
    }
  }, { rootMargin: '200px 0px' });   // resume slightly before it scrolls into view

  for (var a = 0; a < animated.length; a++) io.observe(animated[a]);
  for (var c = 0; c < css.length; c++) io.observe(css[c]);
})();
