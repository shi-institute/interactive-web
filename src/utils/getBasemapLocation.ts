import type { basemapNames } from '$stores/appSettings';

export function getBasemapLocation(name: (typeof basemapNames)[number]) {
  const split = name.split(' | ');

  const lightBasemap = split[0];
  const lightBasemapLocation = (() => {
    switch (lightBasemap) {
      case 'OpenStreetMap':
        return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
      case 'Voyager':
        return 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
      default:
        return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
    }
  })();

  const darkBasemap = split.length === 2 ? split[1] : split[0];
  const darkBasemapLocation = (() => {
    switch (darkBasemap) {
      case 'OpenStreetMap':
        return 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json';
      case 'Voyager':
        return 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';
      default:
        return 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';
    }
  })();

  return [lightBasemapLocation as LightLocation, darkBasemapLocation as DarkLocation];
}

type LightLocation = string;
type DarkLocation = string;
