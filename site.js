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
