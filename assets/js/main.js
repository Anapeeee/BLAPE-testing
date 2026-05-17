/* ============================================================
   BLAPE — Main JavaScript
   assets/js/main.js
   ============================================================ */

document.addEventListener('DOMContentLoaded', function() {
  // Tab navigation
  initTabs();
  // Course modals
  initCourseModals();
  // Set active nav link
  setActiveNav();
});

function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var tabId = this.dataset.tab;
      var group = this.dataset.tabGroup;
      var shell = this.closest('.tab-shell');

      if (!shell) return;

      // Remove active from all buttons in this group
      shell.querySelectorAll('.tab-btn[data-tab-group="' + group + '"]').forEach(function(b) {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });

      // Hide all panels in this group
      shell.querySelectorAll('.tab-panel[data-panel-group="' + group + '"]').forEach(function(p) {
        p.classList.remove('active');
      });

      // Activate clicked button
      this.classList.add('active');
      this.setAttribute('aria-selected', 'true');

      // Show corresponding panel
      var panel = shell.querySelector('.tab-panel[data-panel-group="' + group + '"][data-panel="' + tabId + '"]');
      if (panel) panel.classList.add('active');
    });
  });
}

function initCourseModals() {
  document.querySelectorAll('[data-course-open]').forEach(function(button) {
    button.addEventListener('click', function() {
      var courseId = this.dataset.courseOpen;
      var modalId = 'course-' + courseId;
      var modal = document.getElementById(modalId);
      if (!modal) return;
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  document.querySelectorAll('[data-course-close]').forEach(function(button) {
    button.addEventListener('click', closeCourseModals);
  });

  document.querySelectorAll('.course-modal').forEach(function(modal) {
    modal.addEventListener('click', function(event) {
      if (event.target === modal) closeCourseModals();
    });
  });

  document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') closeCourseModals();
  });
}

function closeCourseModals() {
  document.querySelectorAll('.course-modal').forEach(function(modal) {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
  });
  document.body.style.overflow = '';
}

function setActiveNav() {
  var currentPath = window.location.pathname;
  document.querySelectorAll('.nav a').forEach(function(link) {
    var href = link.getAttribute('href');
    if (href && href !== '#' && currentPath.includes(href.replace(/\/$/, ''))) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}
