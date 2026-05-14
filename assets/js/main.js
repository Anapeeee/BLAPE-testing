document.addEventListener('DOMContentLoaded', function() {
  setActiveNav();
  initMobileMenu();
});

function setActiveNav() {
  var path = window.location.pathname;
  document.querySelectorAll('.nav a').forEach(function(link) {
    link.classList.remove('active');
    var href = link.getAttribute('href');
    if (!href || href === '#') return;
    var clean = href.replace(/^\.\.\//, '/').replace(/\/$/, '');
    if (path.endsWith(clean) || path.endsWith(clean + '/')) {
      link.classList.add('active');
    }
  });
}

function initMobileMenu() {
  var toggle = document.getElementById('nav-toggle');
  var menu = document.getElementById('nav-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', function() {
    var open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
}

