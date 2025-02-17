import { browser } from '$app/environment';
import type { LayoutLoad } from './$types';

export const load = (async ({ data, url }) => {
  const isEmbedded =
    url.searchParams.get('embedded') === '1' ||
    (browser && url.searchParams.get('embedded') !== '1' && window.self !== window.top);

  return { ...data, isEmbedded };
}) satisfies LayoutLoad;
