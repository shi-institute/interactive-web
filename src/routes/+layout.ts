import { browser } from '$app/environment';
import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
import type { LayoutLoad } from './$types';

overrideItemIdKeyNameBeforeInitialisingDndZones('_id');

export const load = (async ({ data, url }) => {
  const isEmbedded =
    url.searchParams.get('embedded') === '1' ||
    (browser && url.searchParams.get('embedded') !== '1' && window.self !== window.top);

  return { ...data, isEmbedded };
}) satisfies LayoutLoad;
