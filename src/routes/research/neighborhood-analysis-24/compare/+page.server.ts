import { _checkAuthentication } from '../../authenticate/+page.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
  const { session } = await parent();

  const authenticated = _checkAuthentication({
    session: session,
    scope: 'application__neighborhood_analysis_24',
  });

  return { authenticated };
}) satisfies PageServerLoad;
