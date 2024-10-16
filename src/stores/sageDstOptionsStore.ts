import type { WebMapOptions } from '$lib/arcgis/WebMap';
import storage from '$lib/store';

interface SAgEDSTOptions extends WebMapOptions {
  null?: never;
}

export const sageDSTOptionsStore = storage<SAgEDSTOptions>('sageDSTOptions', {
  expanded: { left: true, right: false },
  activeWidget: { left: 'legend', right: null },
});
