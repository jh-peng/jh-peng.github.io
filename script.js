(() => {
  const themeKey = 'jh-peng-theme';
  const root = document.documentElement;
  let theme = 'light';

  try {
    if (localStorage.getItem(themeKey) === 'dark') theme = 'dark';
  } catch {
    // The page also works when browser storage is unavailable.
  }

  const applyTheme = (nextTheme) => {
    theme = nextTheme;
    root.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content =
      theme === 'dark' ? '#171b24' : '#f8f7f4';
  };
  applyTheme(theme);

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    const toggle = document.querySelector('.theme-toggle');
    const updateToggle = () => {
      const label = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
      toggle.setAttribute('aria-label', label);
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      toggle.title = label;
    };
    updateToggle();
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      applyTheme(theme === 'dark' ? 'light' : 'dark');
      updateToggle();
      try {
        localStorage.setItem(themeKey, theme);
      } catch {
        // Keep the toggle usable without persisting the preference.
      }
    });

    const links = [...document.querySelectorAll('.nav a')].filter((link) =>
      link.getAttribute('href').startsWith('#') && document.getElementById(link.hash.slice(1))
    );
    if (!links.length) return;
    const sections = links.map((link) => document.querySelector(link.hash));
    let scheduled = false;
    const updateNavigation = () => {
      const threshold = document.querySelector('.site-header').offsetHeight + 70;
      let currentId;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= threshold) currentId = section.id;
      }
      if (window.scrollY > 0 && window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
        currentId = sections[sections.length - 1].id;
      }
      for (const link of links) {
        if (link.hash === `#${currentId}`) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
      scheduled = false;
    };
    window.addEventListener('scroll', () => {
      if (!scheduled) {
        scheduled = true;
        requestAnimationFrame(updateNavigation);
      }
    }, { passive: true });
    window.addEventListener('resize', updateNavigation);
    updateNavigation();
  });
})();
