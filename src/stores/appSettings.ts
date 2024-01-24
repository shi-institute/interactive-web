import storage from '$lib/store';

export const basemapNames = ['Positron | Dark Matter', 'OpenStreetMap', 'Voyager'] as const;

interface AppOptions {
  basemap: (typeof basemapNames)[number];
}

export const appSettings = storage<AppOptions>('appSettings', {
  basemap: basemapNames[0],
});
