import { themeMode } from '$stores/themeMode';
import { derived } from 'svelte/store';

// from paul
const vibrant = ['#ee7733', '#0077bb', '#009988', '#cc3311', '#33bbee', '#ee3377', '#bbbbbb'];

// Use these colors for axis text when in dark mode.
// These colors are lightened versions of the vibrant colors to ensure sufficient
// contrast against a dark background. They are designed to be used for text elements
// in charts and visualizations. Tthe original vibrant colors should be used
// for chart marks and legend swatches.
// Use the `vibrantText` derived store to get the appropriate colors for the current theme mode.
const vibrantDarkText = [
  '#ffa239',
  '#6cbeff',
  '#53cab8',
  '#fe9e88',
  '#41c5f8',
  '#fe9bb2',
  '#bbbbbb',
];

function named(palette: string[]) {
  return {
    colors: palette,
    orange: palette[0],
    blue: palette[1],
    teal: palette[2],
    maroon: palette[3],
    lightblue: palette[4],
    magenta: palette[5],
    gray: palette[6],
  };
}

export const colors = {
  vibrant: named(vibrant),
  vibrantText: {
    light: named(vibrant),
    dark: named(vibrantDarkText),
  },
};

/**
 * Vibrant colors to use for text.
 * They always match the current theme mode
 **/
export const vibrantText = derived(themeMode, (mode) => colors.vibrantText[mode]);
