(function () {
  function init() {
    var wrapper = document.getElementById('wind-slider-wrapper');
    var track = document.getElementById('wind-slider-track');
    var inner = track && track.querySelector('.wind-slider-inner');
    if (!wrapper || !track || !inner) return;

    var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var scrollSpeed = prefersReducedMotion ? 0 : 1;
    var rafId = null;
    var isPaused = false;
    var isDragging = false;
    var didDrag = false;
    var startX = 0;
    var dragThreshold = 5;

    function getTranslateX(el) {
      var style = window.getComputedStyle(el);
      var t = style.transform;
      if (!t || t === 'none') return 0;
      var m = t.match(/matrix\([^,]+, [^,]+, [^,]+, [^,]+, ([^,]+)/);
      if (m) return parseFloat(m[1]);
      var m3 = t.match(/matrix3d\(([^,]+,){12}([^,]+)/);
      if (m3) return parseFloat(m3[2]);
      return 0;
    }

    function getHalf() {
      return inner.scrollWidth / 2;
    }

    function autoScroll() {
      if (isPaused || isDragging) {
        rafId = requestAnimationFrame(autoScroll);
        return;
      }
      if (scrollSpeed === 0) {
        rafId = requestAnimationFrame(autoScroll);
        return;
      }
      var half = getHalf();
      var current = getTranslateX(inner);
      current -= scrollSpeed;
      if (current < -half) current += half;
      inner.style.transform = 'translateX(' + current + 'px)';
      rafId = requestAnimationFrame(autoScroll);
    }

    inner.style.animation = 'none';
    rafId = requestAnimationFrame(autoScroll);

    wrapper.addEventListener('mouseenter', function () {
      isPaused = true;
      wrapper.classList.add('is-paused');
    });
    wrapper.addEventListener('mouseleave', function () {
      isPaused = false;
      wrapper.classList.remove('is-paused');
    });

    wrapper.addEventListener('mousedown', function (e) {
      isDragging = true;
      didDrag = false;
      wrapper.classList.add('is-dragging');
      startX = e.pageX;
    });

    document.addEventListener('mousemove', function (e) {
      if (!isDragging) return;
      var dx = startX - e.pageX;
      if (!didDrag && Math.abs(dx) > dragThreshold) didDrag = true;
      if (didDrag) e.preventDefault();
      startX = e.pageX;
      var half = getHalf();
      var current = getTranslateX(inner);
      var next = current - dx;
      if (next > 0) next = 0;
      if (next < -half) next = -half;
      inner.style.transform = 'translateX(' + next + 'px)';
    });

    document.addEventListener('mouseup', function () {
      if (!isDragging) return;
      isDragging = false;
      wrapper.classList.remove('is-dragging');
    });

    document.addEventListener('mouseleave', function () {
      if (isDragging) {
        isDragging = false;
        wrapper.classList.remove('is-dragging');
      }
    });

    wrapper.addEventListener('click', function (e) {
      if (didDrag) {
        e.preventDefault();
        e.stopPropagation();
      }
      didDrag = false;
    }, true);

    wrapper.addEventListener('touchstart', function (e) {
      isDragging = true;
      didDrag = false;
      wrapper.classList.add('is-dragging');
      startX = e.touches[0].pageX;
    }, { passive: true });

    document.addEventListener('touchmove', function (e) {
      if (!isDragging) return;
      var dx = startX - e.touches[0].pageX;
      if (!didDrag && Math.abs(dx) > dragThreshold) didDrag = true;
      if (didDrag) e.preventDefault();
      startX = e.touches[0].pageX;
      var half = getHalf();
      var current = getTranslateX(inner);
      var next = current - dx;
      if (next > 0) next = 0;
      if (next < -half) next = -half;
      inner.style.transform = 'translateX(' + next + 'px)';
    }, { passive: false });

    document.addEventListener('touchend', function () {
      if (!isDragging) return;
      isDragging = false;
      wrapper.classList.remove('is-dragging');
    });
    document.addEventListener('touchcancel', function () {
      if (isDragging) {
        isDragging = false;
        wrapper.classList.remove('is-dragging');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
