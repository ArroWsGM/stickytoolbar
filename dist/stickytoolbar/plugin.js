/******/ (() => { // webpackBootstrap
/******/ 	"use strict";

;// CONCATENATED MODULE: ./src/plugin.js
var plugin_plugin = function plugin(editor) {
  var offset = editor.settings.sticky_offset ? editor.settings.sticky_offset : 0;
  var stickyToolbar = editor.settings.sticky_toolbar_container ? editor.settings.sticky_toolbar_container : '.tox-toolbar';
  var stickyMenu = editor.settings.sticky_menubar_container ? editor.settings.sticky_menubar_container : '.tox-menubar';
  var stickyStatus = editor.settings.sticky_statusbar_container ? editor.settings.sticky_statusbar_container : '.tox-statusbar';
  var stickyParentClass = editor.settings.sticky_scrolling_container ? editor.settings.sticky_scrolling_container : null;
  var stickyParent = document.querySelector(stickyParentClass);
  editor.on('init', function () {
    setTimeout(function () {
      setSticky();
    }, 0);
  });
  window.addEventListener('resize', function () {
    setSticky();
  });

  if (stickyParent) {
    stickyParent.addEventListener('scroll', function () {
      setSticky();
    });
  }

  window.addEventListener('scroll', function () {
    setSticky();
  });

  function setSticky() {
    var container = editor.getContainer();
    var toolbars = container.querySelectorAll("".concat(stickyToolbar, ", ").concat(stickyMenu)) || [];
    var toolbarHeights = 0;
    toolbars.forEach(function (toolbar) {
      toolbarHeights += toolbar.offsetHeight;
    });

    if (container.getBoundingClientRect().bottom - toolbarHeights < toolbarHeights) {
      container.style.paddingTop = 0;
      toolbars.forEach(function (toolbar) {
        toolbar.style = null;
      });
      return;
    }

    if (!editor.inline && container && container.offsetParent) {
      var statusbar = '';

      if (editor.settings.statusbar !== false) {
        statusbar = container.querySelector(stickyStatus);
      }

      if (isSticky()) {
        container.style.paddingTop = "".concat(toolbarHeights, "px");

        if (isAtBottom()) {
          var nextToolbarHeight = 0;
          var toolbarsArray = [].slice.call(toolbars).reverse();
          toolbarsArray.forEach(function (toolbar) {
            toolbar.style.top = null;
            toolbar.style.width = '100%';
            toolbar.style.position = 'absolute';
            toolbar.style.bottom = statusbar ? "".concat(statusbar.offsetHeight + nextToolbarHeight, "px") : 0;
            toolbar.style.zIndex = 1;
            nextToolbarHeight = toolbar.offsetHeight;
          });
        } else {
          var prevToolbarHeight = 0;
          toolbars.forEach(function (toolbar) {
            toolbar.style.bottom = null;

            if (stickyParent) {
              var parentTop = stickyParent.getBoundingClientRect().top,
                  parentOffset = parentTop > 0 ? parentTop : 0;

              if (offset && parentTop <= offset) {
                toolbar.style.top = "".concat(offset + prevToolbarHeight, "px");
              } else {
                toolbar.style.top = "".concat(parentOffset + prevToolbarHeight, "px");
              }
            } else {
              toolbar.style.top = "".concat(offset + prevToolbarHeight, "px");
            }

            toolbar.style.position = 'fixed';
            toolbar.style.width = "".concat(container.clientWidth, "px");
            toolbar.style.zIndex = 1;
            prevToolbarHeight = toolbar.offsetHeight;
          });
        }
      } else {
        container.style.paddingTop = 0;
        toolbars.forEach(function (toolbar) {
          toolbar.style = null;
        });
      }
    }
  }

  function isSticky() {
    var editorPosition = editor.getContainer().getBoundingClientRect().top;

    if (!stickyParent && editorPosition < offset) {
      return true;
    } else if (stickyParent) {
      var parentTop = stickyParent.getBoundingClientRect().top,
          relativeTop = editorPosition - parentTop;

      if (relativeTop < 0 || parentTop < (offset || 0)) {
        return true;
      }
    }

    return false;
  }

  function isAtBottom() {
    var container = editor.getContainer();
    var editorPosition = container.getBoundingClientRect().top,
        statusbar = container.querySelector(stickyStatus),
        toolbars = container.querySelectorAll("".concat(stickyToolbar, ", ").concat(stickyMenu)) || [];
    var statusbarHeight = statusbar ? statusbar.offsetHeight : 0;
    var toolbarHeights = 0;
    toolbars.forEach(function (toolbar) {
      toolbarHeights += toolbar.offsetHeight;
    });
    var stickyHeight = -(container.offsetHeight - toolbarHeights - statusbarHeight);
    return editorPosition < stickyHeight + offset;
  }
};

/* harmony default export */ const src_plugin = (plugin_plugin);
;// CONCATENATED MODULE: ./src/index.js

tinymce.PluginManager.add('stickytoolbar', src_plugin);
/******/ })()
;