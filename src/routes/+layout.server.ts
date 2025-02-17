import 'groupby-polyfill/lib/polyfill.js';
import type { LayoutServerLoad } from './$types';
import { _calculateAuthScopes } from './research/authenticate/+page.server';

export const load = (async ({ locals }) => {
  const { counter = 0 } = locals.session.data;

  // an object of scopes and whether they are authenticated
  const authScopes = _calculateAuthScopes(locals);

  await locals.session.set({
    ...locals.session.data,
    counter: counter + 1,
    authScopes,
  });

  return { session: locals.session.data };
}) satisfies LayoutServerLoad;
