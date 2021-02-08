const plugin = (editor) => {
  const offset = editor.settings.sticky_offset ?
    editor.settings.sticky_offset :
    0;

  const stickyToolbar = editor.settings.sticky_toolbar_container ?
    editor.settings.sticky_toolbar_container :
    '.tox-toolbar';

  const stickyMenu = editor.settings.sticky_menubar_container ?
    editor.settings.sticky_menubar_container :
    '.tox-menubar';

  const stickyStatus = editor.settings.sticky_statusbar_container ?
    editor.settings.sticky_statusbar_container :
    '.tox-statusbar';

  const stickyParentClass = editor.settings.sticky_scrolling_container ?
    editor.settings.sticky_scrolling_container :
    null;
  const stickyParent = document.querySelector(stickyParentClass);

  editor.on('init', () => {
    setTimeout(() => {
      setSticky();
    }, 0);
  });

  window.addEventListener('resize', () => {
    setSticky();
  });

  if (stickyParent) {
    stickyParent.addEventListener('scroll', () => {
      setSticky();
    });
  }

  window.addEventListener('scroll', () => {
    setSticky();
  });

  function setSticky() {
    const container = editor.getContainer();

    const toolbars = container.querySelectorAll(`${stickyToolbar}, ${stickyMenu}`) || [];
    let toolbarHeights = 0;
    toolbars.forEach(toolbar => {
      toolbarHeights += toolbar.offsetHeight;
    });

    if (container.getBoundingClientRect().bottom - toolbarHeights < toolbarHeights) {
      container.style.paddingTop = 0;

      toolbars.forEach(toolbar => {
        toolbar.style = null;
      });

      return;
    }

    if (!editor.inline && container && container.offsetParent) {
      let statusbar = '';

      if (editor.settings.statusbar !== false) {
        statusbar = container.querySelector(stickyStatus);
      }

      if (isSticky()) {
        container.style.paddingTop = `${toolbarHeights}px`;

        if (isAtBottom()) {
          let nextToolbarHeight = 0;

          const toolbarsArray = [].slice.call(toolbars).reverse();

          toolbarsArray.forEach(toolbar => {
            toolbar.style.top = null;
            toolbar.style.width = '100%';
            toolbar.style.position = 'absolute';
            toolbar.style.bottom = statusbar ? `${statusbar.offsetHeight + nextToolbarHeight}px` : 0;
            toolbar.style.zIndex = 1;

            nextToolbarHeight = toolbar.offsetHeight;
          });
        } else {
          let prevToolbarHeight = 0;

          toolbars.forEach(toolbar => {
            toolbar.style.bottom = null;

            if (stickyParent) {
              const parentTop = stickyParent.getBoundingClientRect().top,
                parentOffset = parentTop > 0 ? parentTop : 0;

              if (offset && parentTop <= offset) {
                toolbar.style.top = `${offset + prevToolbarHeight}px`;
              } else {
                toolbar.style.top = `${parentOffset + prevToolbarHeight}px`;
              }
            } else {
              toolbar.style.top = `${offset + prevToolbarHeight}px`;
            }

            toolbar.style.position = 'fixed';
            toolbar.style.width = `${container.clientWidth}px`;
            toolbar.style.zIndex = 1;

            prevToolbarHeight = toolbar.offsetHeight;
          });
        }
      } else {
        container.style.paddingTop = 0;

        toolbars.forEach(toolbar => {
          toolbar.style = null;
        });
      }
    }
  }

  function isSticky() {
    const editorPosition = editor.getContainer().getBoundingClientRect().top;

    if (!stickyParent && editorPosition < offset) {
      return true;
    } else if (stickyParent) {
      const parentTop = stickyParent.getBoundingClientRect().top,
        relativeTop = editorPosition - parentTop;

      if (relativeTop < 0 || parentTop < (offset || 0)) {
        return true;
      }
    }

    return false;
  }

  function isAtBottom() {
    const container = editor.getContainer();

    const editorPosition = container.getBoundingClientRect().top,
      statusbar = container.querySelector(stickyStatus),
      toolbars = container.querySelectorAll(`${stickyToolbar}, ${stickyMenu}`) || [];

    const statusbarHeight = statusbar ? statusbar.offsetHeight : 0;

    let toolbarHeights = 0;
    toolbars.forEach(toolbar => {
      toolbarHeights += toolbar.offsetHeight;
    });

    const stickyHeight = -(container.offsetHeight - toolbarHeights - statusbarHeight);

    return editorPosition < stickyHeight + offset;
  }
};

export default plugin;
