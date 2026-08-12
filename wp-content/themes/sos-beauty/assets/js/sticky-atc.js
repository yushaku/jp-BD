(function () {
  if (!document.body.classList.contains('single-product')) {
    return;
  }

  var form = document.querySelector('form.cart');
  var gallery = document.querySelector('.woocommerce-product-gallery');
  if (!form || !gallery) {
    return;
  }

  var bar = document.createElement('div');
  bar.className = 'beauty-sticky-atc';
  bar.hidden = true;

  var price = document.querySelector('.summary .price');
  var btn = form.querySelector('.single_add_to_cart_button');
  if (!price || !btn) {
    return;
  }

  var priceClone = price.cloneNode(true);
  var btnClone = btn.cloneNode(true);
  btnClone.addEventListener('click', function (e) {
    e.preventDefault();
    btn.click();
  });

  bar.appendChild(priceClone);
  bar.appendChild(btnClone);
  document.body.appendChild(bar);

  var observer = new IntersectionObserver(
    function (entries) {
      bar.hidden = entries[0].isIntersecting;
    },
    { threshold: 0 }
  );
  observer.observe(form);

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    bar.style.transition = 'none';
  }
})();
