(() => {
  const themeKey = 'jh-peng-theme';
  const root = document.documentElement;
  let preference = 'system';
  let theme;
  let darkQuery;
  let lightQuery;
  let updateToggle = () => {};

  try {
    darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
    lightQuery = window.matchMedia('(prefers-color-scheme: light)');
  } catch {
    // Fall back to dark when the browser cannot report a system preference.
  }

  const systemTheme = () => {
    if (darkQuery?.matches) return 'dark';
    if (lightQuery?.matches) return 'light';
    return 'dark';
  };

  try {
    const saved = localStorage.getItem(themeKey);
    if (saved === 'light' || saved === 'dark') preference = saved;
  } catch {
    // The page also works when browser storage is unavailable.
  }

  const applyTheme = () => {
    theme = preference === 'system' ? systemTheme() : preference;
    root.dataset.theme = theme;
    root.dataset.themePreference = preference;
    document.querySelector('meta[name="color-scheme"]').content = theme;
    document.querySelector('meta[name="theme-color"]').content =
      theme === 'dark' ? '#171b24' : '#f8f7f4';
    updateToggle();
  };
  applyTheme();

  const followSystem = () => {
    if (preference === 'system') applyTheme();
  };
  for (const query of [darkQuery, lightQuery]) {
    if (query?.addEventListener) query.addEventListener('change', followSystem);
    else if (query?.addListener) query.addListener(followSystem);
  }

  document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('year').textContent = new Date().getFullYear();
    const toggle = document.querySelector('.theme-toggle');
    const nextPreference = () => ({ system: 'light', light: 'dark', dark: 'system' })[preference];
    updateToggle = () => {
      const current = preference === 'system' ? `System (${theme})` : preference;
      const next = nextPreference() === 'system' ? 'Follow system theme' : `Switch to ${nextPreference()} mode`;
      const label = `Theme: ${current}. ${next}`;
      toggle.setAttribute('aria-label', label);
      toggle.title = label;
    };
    updateToggle();
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      preference = nextPreference();
      applyTheme();
      try {
        localStorage.setItem(themeKey, preference);
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
