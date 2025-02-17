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
  window.forceColorScheme?.(mode);
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
