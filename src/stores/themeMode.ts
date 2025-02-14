import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import selectedThemeMode from './selectedThemeMode';

const prefersDarkMode = browser && !!window?.matchMedia('(prefers-color-scheme: dark)').matches;

export const themeMode = writable<'light' | 'dark'>(prefersDarkMode ? 'dark' : 'light');

selectedThemeMode.subscribe((mode) => {
  if (mode === 'auto') {
    const prefersDarkMode = browser && !!window?.matchMedia('(prefers-color-scheme: dark)').matches;
    themeMode.set(prefersDarkMode ? 'dark' : 'light');
    return;
  }
  themeMode.set(mode);
});
