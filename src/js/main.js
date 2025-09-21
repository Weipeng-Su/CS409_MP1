/* Your JS here. */
// main.js - functionality for MP1 page
// Features:
// - Sticky/resizing navbar
// - Scroll spy / position indicator
// - Smooth scrolling when nav clicked
// - Carousel (prev/next + auto rotate)
// - Modal open/close
// - Set year in footer

document.addEventListener('DOMContentLoaded', function () {
  // Elements
  var navbar = document.getElementById('navbar');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('#nav-links a'));
  var sections = navLinks.map(function (a) {
    var id = a.getAttribute('data-target') || a.getAttribute('href').slice(1);
    return document.getElementById(id);
  });
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth scroll on nav clicks
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      var targetId = link.getAttribute('data-target') || link.getAttribute('href').slice(1);
      var el = document.getElementById(targetId);
      if (el) {
        // account for navbar height
        var navH = navbar.offsetHeight;
        var top = el.getBoundingClientRect().top + window.scrollY - navH + 6;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });

  // Navbar resize on scroll
  function updateActiveLink() {
    if (window.scrollY > 50) {
      navbar.classList.remove('nav-large');
      navbar.classList.add('nav-small');
    } else {
      navbar.classList.remove('nav-small');
      navbar.classList.add('nav-large');
    }

    var navH = navbar.offsetHeight;
    var scrollPosition = window.scrollY + navH + 4; // navbar 底部位置
    var activeIndex = -1;

    for (var i = 0; i < sections.length; i++) {
      var sectionTop = sections[i].offsetTop;
      var sectionBottom = sectionTop + sections[i].offsetHeight;

      // Determine which section is located directly below the bottom of navbar
      if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
        activeIndex = i;
        break;
      }
    }

    // Special case: Scroll to the bottom of the page and force highlight of the last one
    if ((window.innerHeight + window.scrollY) >= (document.body.scrollHeight - 2)) {
      activeIndex = sections.length - 1;
    }

    navLinks.forEach(function (a, idx) {
      if (idx === activeIndex) {
        a.classList.add('active');
      } else {
        a.classList.remove('active');
      }
    });
  }
  
  updateActiveLink();
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  window.addEventListener('resize', updateActiveLink);

  // Carousel
  (function () {
    var carousel = document.querySelector('.carousel');
    if (!carousel) return;
    var slidesNode = carousel.querySelector('.slides');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('.slide'));
    var prevBtn = carousel.querySelector('.carousel-arrow.prev');
    var nextBtn = carousel.querySelector('.carousel-arrow.next');
    var index = 0;
    var slideCount = slides.length;
    var autoTimer = null;
    function show(i) {
      index = (i + slideCount) % slideCount;
      slidesNode.style.transform = 'translateX(' + (-index * 100) + '%)';
    }
    function next() { show(index + 1); }
    function prev() { show(index - 1); }
    if (prevBtn) prevBtn.addEventListener('click', function () { prev(); restart(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { next(); restart(); });

    // auto rotate
    function startAuto() {
      stopAuto();
      autoTimer = setInterval(function () { next(); }, 4000);
    }
    function stopAuto() { if (autoTimer) { clearInterval(autoTimer); autoTimer = null; } }
    function restart() { stopAuto(); startAuto(); }
    // pause on hover
    carousel.addEventListener('mouseenter', stopAuto);
    carousel.addEventListener('mouseleave', startAuto);

    show(0);
    startAuto();
  })();

  // Modal behavior
  (function () {
    var modal = document.getElementById('modal');
    var openBtn = document.getElementById('open-modal');
    var openBtn2 = document.getElementById('open-modal-2');
    var closeBtn = modal && modal.querySelector('.modal-close');

    function open() {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'false');
      // trap focus superficially
      document.body.style.overflow = 'hidden';
    }
    function close() {
      if (!modal) return;
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (openBtn) openBtn.addEventListener('click', open);
    if (openBtn2) openBtn2.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === modal) close();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') close();
      });
    }
  })();

  // small enhancement: fade-in sections when near viewport (CSS class already set for one element)
  (function lazyFade() {
    var faders = document.querySelectorAll('.fade-in');
    var onScroll = function () {
      faders.forEach(function (el) {
        var rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight - 60) {
          el.style.animationDelay = '150ms';
          el.classList.add('visible');
        }
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  // ensure last nav item gets highlighted on load if near bottom
  updateActiveLink();
});