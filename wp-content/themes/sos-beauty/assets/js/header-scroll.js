(function () {
  var header = document.getElementById('masthead');
  if (!header) {
    return;
  }

  var lastScrollY = window.scrollY;
  var ticking = false;
  var threshold = 64;
  var delta = 8;

  header.classList.add('site-header--float', 'site-header--visible');

  function setHeaderOffset() {
    document.documentElement.style.setProperty(
      '--header-offset',
      header.offsetHeight + 'px'
    );
  }

  function onScroll() {
    var currentScrollY = window.scrollY;

    if (currentScrollY <= threshold) {
      header.classList.remove('site-header--hidden');
      header.classList.add('site-header--visible');
    } else if (currentScrollY > lastScrollY + delta) {
      header.classList.add('site-header--hidden');
      header.classList.remove('site-header--visible');
    } else if (currentScrollY < lastScrollY - delta) {
      header.classList.remove('site-header--hidden');
      header.classList.add('site-header--visible');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener(
    'scroll',
    function () {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener('resize', setHeaderOffset);
  window.addEventListener('load', setHeaderOffset);
  setHeaderOffset();
})();
