import { _ensureAuthentication } from '../authenticate/+page.server';
import type { LayoutServerLoad } from './$types';

export const ssr = false;
export const prerender = false;

export const load = (async ({ parent, url }) => {
  const { session } = await parent();

  _ensureAuthentication({
    session,
    url,
    scope: 'application__rural_change_diagnostic_screen',
    appName: 'Rural change diagnostic screening tool',
  });

  return {};
}) satisfies LayoutServerLoad;
