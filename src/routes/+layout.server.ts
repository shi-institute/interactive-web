import { PROTECTED_PAGE_PASSWORD } from '$env/static/private';
import type { LayoutServerLoad } from './$types';

import 'groupby-polyfill/lib/polyfill.js';

export const load = (async ({ locals, url }) => {
  // handle authentication
  const { counter = 0, protectedPass = '' } = locals.session.data;
  const authenticated = protectedPass === PROTECTED_PAGE_PASSWORD;

  await locals.session.set({
    ...locals.session.data,
    counter: counter + 1,
    authenticated: authenticated,
  });

  return { session: locals.session.data, isEmbedded: url.searchParams.get('embedded') === '1' };
}) satisfies LayoutServerLoad;
