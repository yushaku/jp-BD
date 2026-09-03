(function () {
  document.addEventListener('DOMContentLoaded', function () {
    var mq = window.matchMedia('(max-width: 767px)');
    var toggle = document.getElementById('site-navigation-menu-toggle');
    var nav = document.getElementById('site-navigation');
    var aside = document.querySelector('.beauty-header-main__aside');
    var cart = document.getElementById('sos-beauty-header-cart');

    if (!toggle || !nav || !aside) {
      return;
    }

    var placeholder = document.createComment('menu-toggle-slot');
    nav.insertBefore(placeholder, toggle);

    function apply() {
      if (mq.matches) {
        aside.appendChild(toggle);
        return;
      }

      if (placeholder.parentNode === nav) {
        nav.insertBefore(toggle, placeholder.nextSibling);
      }
    }

    if (typeof mq.addEventListener === 'function') {
      mq.addEventListener('change', apply);
    } else if (typeof mq.addListener === 'function') {
      mq.addListener(apply);
    }

    apply();
  });
})();
