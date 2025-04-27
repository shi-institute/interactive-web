import { error } from '@sveltejs/kit';
import { _ensureAuthentication } from '../../authenticate/+page.server';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent, url }) => {
  const { session } = await parent();

  _ensureAuthentication({
    session,
    url,
    scope: 'application__neighborhood_analysis_24',
    appName: 'Neighborhood analysis (2024)',
  });

  const county = url.searchParams.get('county');
  if (!county) {
    throw error(422, 'County parameter is required');
  }

  return { county };
}) satisfies PageServerLoad;
