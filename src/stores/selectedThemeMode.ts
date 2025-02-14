import { browser } from '$app/environment';
import { hasKey } from '$utils';
import { writable } from 'svelte/store';

const STORAGE_KEY = 'theme-mode';

type ThemeMode = 'light' | 'dark' | 'auto';

// read initial theme mode from localStorage if in the browser
const getInitialMode = (): ThemeMode => {
  if (!browser) return 'auto'; // default to 'auto' in ssr

  const savedMode = localStorage.getItem(STORAGE_KEY);
  return savedMode === 'light' || savedMode === 'dark' || savedMode === 'auto' ? savedMode : 'auto';
};

// apply the theme based on the selected mode (only in browser)
const applyTheme = (mode: ThemeMode) => {
  if (!browser) return;

  const prefersColorSchemeRules = Array.from(document.styleSheets)
    .flatMap((styleSheet) => {
      try {
        return Array.from(styleSheet.cssRules);
      } catch (e) {
        return [];
      }
    })
    .filter((rule): rule is CSSMediaRule => hasKey(rule, 'media'))
    .filter((rule) => rule.media.mediaText.includes('prefers-color-scheme'))
    .map((rule) => rule.media);

  if (!prefersColorSchemeRules.length) return;

  prefersColorSchemeRules.forEach((media) => {
    const containsLight = media.mediaText.includes('(prefers-color-scheme: light)');
    const containsDark = media.mediaText.includes('(prefers-color-scheme: dark)');
    const containsOriginalLight = media.mediaText.includes(
      '(original-prefers-color-scheme: light)'
    );
    const containsOriginalDark = media.mediaText.includes('(original-prefers-color-scheme: dark)');

    // Step 1: Store original media queries if not already tracked
    if (!containsOriginalLight && !containsOriginalDark) {
      if (containsLight) {
        media.appendMedium('(original-prefers-color-scheme: light)');
      }
      if (containsDark) {
        media.appendMedium('(original-prefers-color-scheme: dark)');
      }
    }

    // Step 2: Apply theme overrides
    switch (mode) {
      case 'light':
        // remove current media queries
        if (containsLight) media.deleteMedium('(prefers-color-scheme: light)');
        if (containsDark) media.deleteMedium('(prefers-color-scheme: dark)');

        // make the light theme active
        if (containsOriginalLight) {
          media.appendMedium('(prefers-color-scheme: light)');
          media.appendMedium('(prefers-color-scheme: dark)');
        }

        break;
      case 'dark':
        // remove current media queries
        if (containsLight) media.deleteMedium('(prefers-color-scheme: light)');
        if (containsDark) media.deleteMedium('(prefers-color-scheme: dark)');

        // make the light theme active
        if (containsOriginalDark) {
          media.appendMedium('(prefers-color-scheme: light)');
          media.appendMedium('(prefers-color-scheme: dark)');
        }

        break;
      case 'auto':
        // remove current media queries
        if (containsLight) media.deleteMedium('(prefers-color-scheme: light)');
        if (containsDark) media.deleteMedium('(prefers-color-scheme: dark)');

        // restore the original media queries
        if (containsOriginalLight) media.appendMedium('(prefers-color-scheme: light)');
        if (containsOriginalDark) media.appendMedium('(prefers-color-scheme: dark)');

        break;
    }
  });

  // Force reflow to ensure styles apply correctly
  document.documentElement.style.display = 'none';
  requestAnimationFrame(() => {
    document.documentElement.style.display = '';
  });
};

// create a writable store with the initial mode
const selectedThemeMode = writable<ThemeMode>(getInitialMode(), (set) => {
  if (!browser) return () => {}; // no-op in ssr

  // apply the theme initially
  applyTheme(getInitialMode());

  // sync with localStorage changes from other tabs
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY && event.newValue) {
      const newMode = event.newValue as ThemeMode;
      set(newMode);
      applyTheme(newMode);
    }
  };

  window.addEventListener('storage', handleStorageChange);

  return () => window.removeEventListener('storage', handleStorageChange);
});

// subscribe to store changes to update localStorage and apply theme (only in browser)
if (browser) {
  selectedThemeMode.subscribe((mode) => {
    localStorage.setItem(STORAGE_KEY, mode);
    applyTheme(mode);
  });
}

export default selectedThemeMode;
