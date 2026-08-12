(function () {
  var search = document.querySelector('.site-header .site-search');
  if (!search) {
    return;
  }

  var toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'beauty-search-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'beauty-search-panel');
  toggle.innerHTML =
    '<span class="screen-reader-text">Tìm kiếm</span>' +
    '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

  var panel = document.createElement('div');
  panel.id = 'beauty-search-panel';
  panel.className = 'beauty-search-panel';
  panel.hidden = true;
  panel.appendChild(search.cloneNode(true));

  search.parentNode.insertBefore(toggle, search);
  search.parentNode.insertBefore(panel, search.nextSibling);
  search.style.display = 'none';

  function close() {
    panel.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', function () {
    var open = panel.hidden;
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (open) {
      var input = panel.querySelector('input[type="search"], input[type="text"]');
      if (input) {
        input.focus();
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      close();
    }
  });

  document.addEventListener('click', function (e) {
    if (!panel.contains(e.target) && e.target !== toggle && !toggle.contains(e.target)) {
      close();
    }
  });
})();
