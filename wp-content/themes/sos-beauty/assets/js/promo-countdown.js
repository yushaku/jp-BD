(function () {
  var tile = document.querySelector('.beauty-promo__countdown[data-countdown-end]');
  if (!tile) {
    return;
  }

  var endStr = tile.getAttribute('data-countdown-end');
  var end = Date.parse(endStr);
  if (isNaN(end)) {
    return;
  }

  var values = {
    days: tile.querySelector('[data-unit="days"]'),
    hours: tile.querySelector('[data-unit="hours"]'),
    mins: tile.querySelector('[data-unit="mins"]'),
    secs: tile.querySelector('[data-unit="secs"]'),
  };

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function tick() {
    var diff = end - Date.now();
    if (diff <= 0) {
      tile.classList.add('beauty-promo__countdown--ended');
      var timer = tile.querySelector('.beauty-promo__timer');
      if (timer) {
        timer.setAttribute('aria-hidden', 'true');
      }
      return;
    }

    var secs = Math.floor(diff / 1000);
    var days = Math.floor(secs / 86400);
    secs -= days * 86400;
    var hours = Math.floor(secs / 3600);
    secs -= hours * 3600;
    var mins = Math.floor(secs / 60);
    secs -= mins * 60;

    if (values.days) values.days.textContent = pad(days);
    if (values.hours) values.hours.textContent = pad(hours);
    if (values.mins) values.mins.textContent = pad(mins);
    if (values.secs) values.secs.textContent = pad(secs);

    window.setTimeout(tick, 1000);
  }

  tick();
})();
