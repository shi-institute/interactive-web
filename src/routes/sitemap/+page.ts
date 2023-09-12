import type { PageLoad } from './$types';

export const load = (({ url }) => {
  const pages = import.meta.glob('../**/+page.svelte');
  const pageNames = Object.entries(pages).map(([path]) =>
    path.slice(1).replace('+page.svelte', '').replace('./', '/')
  );

  return { pageNames: pageNames.filter((pageName) => pageName !== '/'), url };
}) satisfies PageLoad;
