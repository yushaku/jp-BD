(function () {
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'beauty-back-to-top';
  btn.hidden = true;
  btn.setAttribute('aria-label', 'Lên đầu trang');
  btn.innerHTML =
    '<svg class="beauty-back-to-top__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M6 14.5 12 8.5l6 6" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>';
  document.body.appendChild(btn);

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener(
    'scroll',
    function () {
      btn.hidden = window.scrollY < 400;
    },
    { passive: true }
  );

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });
})();
