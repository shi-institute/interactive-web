import { hasKey } from '$utils';
import { capitalize } from '$utils/capitalize';
import { error } from '@sveltejs/kit';
import { isString } from 'is-what';
import { _ensureAuthentication } from '../../authenticate/+page.server';
import { validatePublic } from '../matcher';
import type { LayoutServerLoad } from './$types';

export const load = (async ({ params, parent, url, route }) => {
  const { gentrificationData, neighborhoodsData, tractsData, session } = await parent();

  restrictToValidRoutes({ neighborhoodsData, tractsData, session, params, url });

  if (isNaN(Number(params.neighborhood))) {
    const neighborhood = capitalize(params.neighborhood);

    const neighborhoodGentrificationData = gentrificationData.filter(
      ({ neighborhoods }) =>
        neighborhoods &&
        neighborhoods.map((n) => n.toLowerCase()).includes(params.neighborhood.toLowerCase())
    );

    return {
      neighborhood,
      neighborhoodGentrificationData,
      neighborhoodsData,
    };
  }

  const tract = parseInt(params.neighborhood);
  const tract_name = tractsData.find((d) => d.tract_id === tract)?.tract_name;

  const tractGentrificationData = gentrificationData.filter(({ Tract }) => Tract === tract);

  return { tract, tract_name, tractGentrificationData, neighborhoodsData };
}) satisfies LayoutServerLoad;

function restrictToValidRoutes({
  neighborhoodsData,
  tractsData,
  session,
  params,
  url,
}: {
  neighborhoodsData: readonly { neighborhood_name: string }[];
  tractsData: readonly { tract_id: number }[];
  session: App.Locals['session']['data'];
  params: { neighborhood: string };
  url: URL;
}) {
  const plotId = (hasKey(params, 'plot') && isString(params.plot) && params.plot) || undefined;

  const validNeighborhoodOrTracts = [
    ...neighborhoodsData.map((d) => d.neighborhood_name.toLocaleLowerCase()),
    ...tractsData.map((d) => d.tract_id.toString()),
  ];
  const isValid = validNeighborhoodOrTracts.includes(params.neighborhood.toLocaleLowerCase());
  if (!isValid) {
    throw error(404, 'Invalid neighborhood or tract');
  }

  const isPublic = validatePublic(params.neighborhood, plotId);
  if (!isPublic) {
    _ensureAuthentication({
      session,
      url,
      scope: 'application__neighborhood_analysis_24',
      appName: 'Neighborhood analysis (2024)',
    });
  }
}
