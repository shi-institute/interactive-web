import { _ensureAuthentication } from '../authenticate/+page.server';
import type { PageServerLoad } from './$types';
import { validTractOrNeighborhood } from './matcher';

export const load = (async ({ parent, url }) => {
  const { session, neighborhoodsData, tractsData } = await parent();

  _ensureAuthentication({
    session,
    url,
    scope: 'application__neighborhood_analysis_24',
    appName: 'Neighborhood analysis (2024)',
  });

  const publicRoutes = validTractOrNeighborhood.map((id) => {
    return {
      id,
      url: `/research/neighborhood-analysis-24/${id}/plots`,
      type: isNaN(parseInt(id.toString())) ? 'neighborhood' : 'tract',
      locked: false,
    };
  });

  const allNeighborhoods = Array.from(new Set(neighborhoodsData.map((d) => d.neighborhood_name)));
  const allTracts = Array.from(new Set(tractsData.map((d) => d.tract_id)));
  const lockedRoutes = [
    ...allNeighborhoods.map((n) => ({
      id: n.toLocaleLowerCase(),
      url: `/research/neighborhood-analysis-24/${n.toLocaleLowerCase()}/plots`,
      type: 'neighborhood',
      locked: true,
    })),
    ...allTracts.map((t) => ({
      id: t,
      url: `/research/neighborhood-analysis-24/${t}/plots`,
      type: 'tract',
      locked: true,
    })),
  ];

  const routes = [
    ...publicRoutes,
    ...lockedRoutes.filter((r) => !publicRoutes.some((pr) => pr.id === r.id)),
  ].sort((a, b) => a.id.toString().localeCompare(b.id.toString()));

  return { routes };
}) satisfies PageServerLoad;
