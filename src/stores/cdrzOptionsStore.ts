import storage from '$lib/store';

interface CDRZOptions {
  year: number;
  showMore: boolean;
}

export const cdrzOptionsStore = storage<CDRZOptions>('cdrzOptions', {
  year: 2020,
  showMore: false,
});
