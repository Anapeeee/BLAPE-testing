/**
 * BLAPE — Main JS  |  assets/js/main.js
 */

/* =============================================
   SSO GUARD
   =============================================
   Provider options: 'auth0' | 'okta' | 'google' | 'microsoft' | 'clerk' | 'none'
   Set provider to 'none' for a fully public site.
   Flip data-requires-auth="true" on <body> of
   any page you want to gate behind login.
   ============================================= */

var BLAPE_SSO = (function () {
  var config = {
    provider:   'none',
    loginUrl:   '/login.html',
    logoutUrl:  '/login.html',
    sessionKey: 'blape_session',
    userKey:    'blape_user',
    debug:      false
  };

  function log(msg) { if (config.debug) console.log('[BLAPE SSO]', msg); }

  function getSession() {
    try {
      var token = localStorage.getItem(config.sessionKey);
      var user  = JSON.parse(localStorage.getItem(config.userKey) || 'null');
      return token ? { token: token, user: user } : null;
    } catch (e) { return null; }
  }

  function setSession(token, user) {
    localStorage.setItem(config.sessionKey, token);
    localStorage.setItem(config.userKey, JSON.stringify(user || {}));
  }

  function clearSession() {
    localStorage.removeItem(config.sessionKey);
    localStorage.removeItem(config.userKey);
  }

  function requiresAuth() {
    return document.body.getAttribute('data-requires-auth') === 'true';
  }

  function redirectToLogin() {
    var returnTo = encodeURIComponent(window.location.href);
    window.location.href = config.loginUrl + '?returnTo=' + returnTo;
  }

  function handleCallback(token, user) {
    if (!token) return;
    setSession(token, user);
    var params   = new URLSearchParams(window.location.search);
    var returnTo = params.get('returnTo') || '/';
    window.location.href = decodeURIComponent(returnTo);
  }

  function renderUserBar(session) {
    var bar = document.getElementById('sso-user-bar');
    if (!bar) return;
    if (session && session.user) {
      var name = session.user.name || session.user.email || 'Signed in';
      bar.innerHTML =
        '<div class="container sso-user-bar-inner">' +
        '<span>Signed in as <strong>' + name + '</strong></span>' +
        '<a href="#" id="sso-logout-btn">Sign out</a>' +
        '</div>';
      var btn = document.getElementById('sso-logout-btn');
      if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); logout(); });
    } else {
      bar.innerHTML =
        '<div class="container sso-user-bar-inner">' +
        '<a href="' + config.loginUrl + '">Sign in</a>' +
        '</div>';
    }
  }

  function logout() {
    clearSession();
    window.location.href = config.logoutUrl;
  }

  function init() {
    log('Init — provider: ' + config.provider);
    var session = getSession();
    if (requiresAuth() && !session) { redirectToLogin(); return; }
    renderUserBar(session);
  }

  return {
    config: config, init: init,
    handleCallback: handleCallback,
    getSession: getSession, setSession: setSession,
    clearSession: clearSession, logout: logout
  };
}());

/* =============================================
   TABS
   ============================================= */
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tabId = this.dataset.tab;
      var group = this.dataset.tabGroup;
      var shell = this.closest('.tab-shell');
      shell.querySelectorAll('.tab-btn[data-tab-group="' + group + '"]').forEach(function (b) {
        b.classList.remove('active'); b.setAttribute('aria-selected', 'false');
      });
      shell.querySelectorAll('.tab-panel[data-panel-group="' + group + '"]').forEach(function (p) {
        p.classList.remove('active');
      });
      this.classList.add('active'); this.setAttribute('aria-selected', 'true');
      var panel = shell.querySelector('.tab-panel[data-panel-group="' + group + '"][data-panel="' + tabId + '"]');
      if (panel) panel.classList.add('active');
    });
  });
}

/* =============================================
   COURSE MODALS
   ============================================= */
function initModals() {
  function closeAll() {
    document.querySelectorAll('.course-modal').forEach(function (m) {
      m.classList.remove('active'); m.setAttribute('aria-hidden', 'true');
    });
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-course-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var modal = document.getElementById('course-' + this.dataset.courseOpen);
      if (!modal) return;
      modal.classList.add('active'); modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('[data-course-close]').forEach(function (btn) {
    btn.addEventListener('click', closeAll);
  });

  document.querySelectorAll('.course-modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target === m) closeAll(); });
  });

  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeAll(); });
}

/* =============================================
   ACTIVE NAV HIGHLIGHT
   ============================================= */
function initActiveNav() {
  var page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(function (link) {
    var href = (link.getAttribute('href') || '').split('/').pop();
    if (href && href === page) link.classList.add('active-page');
  });
}

/* =============================================
   BOOT
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
  BLAPE_SSO.init();
  initTabs();
  initModals();
  initActiveNav();
});
