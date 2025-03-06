import { browser, dev } from '$app/environment';
import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
import type { LayoutLoad } from './$types';

overrideItemIdKeyNameBeforeInitialisingDndZones('_id');

export const load = (async ({ data, url }) => {
  const isEmbedded =
    url.searchParams.get('embedded') === '1' ||
    (browser && url.searchParams.get('embedded') !== '1' && window.self !== window.top);

  const isDeployedPreview =
    !dev &&
    url.origin !== 'https://shi.institute' &&
    import.meta.env.VITE_IGNORE_DEPLOYED_PREVIEW !== '1';

  return { ...data, isEmbedded, isDeployedPreview };
}) satisfies LayoutLoad;
